/// ibom.js
///
 
/*
module = {
    "angle": xx,
    "itemkey": xx,
    "soldertype": xx,
    "footprint": {xx..}
    "comment": {xx..}
}
*/
function skipComponent(m, config, extra_data) {
    // config = config || {};
    // config.bomFilter.skiplist = [];
    // config.bomFilter.skipvirtual = true;
    // config.bomFilter.dnpfield = true;
    // config.bomFilter.skiplayer = true;

    // extra_data = extra_data || {};
    // var re = /^[A-Z]*/g;
    // var ref_prefix = re.exec(m["component"].ref);
    // if (m["component"].ref in config.bomFilter.skiplist) {
    //     return true;
    // }
    // if (ref_prefix + "*" in config.bomFilter.skiplist) {
    //     return true;
    // } 
    // skip component with empty comment
    if (config.bomFilter.skipempty && m["component"].val in {"DNP": 1, "": 2, "~": 3}) {
        return true;
    }
    // skip virtual components
    // if (config.bomFilter.skipvirtual && m["component"].attr == "virtual") {
    //     return true;
    // }
    // skip components with one pad
    if (config.bomFilter.skiponepad && m["footprint"].pads.length <= 1) {
        return true;
    }
    // skip components with dnp field not empty
    // if (config.bomFilter.dnpfield && extra_data[m["component"].ref][config.dnpfield]) {
    //     return true;
    // }
    // skip th components
    if (config.bomFilter.skipth && m.soldertype == "th") {
        return true;
    }
    // skip components on layer, "F" or "B"
    // if (config.bomFilter.skiplayer == m["component"].layer) {
    //     return true;
    // }
}


function sortModules(modules) {
    function mergeModules (iBegin, iMid, iEnd) {
        var tmp = [];
        var j = iBegin;
        var n = iMid;
        var k = iMid + 1;
        while (j <= n && k <= iEnd) {

            // sort: smd > th
            if (modules[j].soldertype != modules[k].soldertype) {
                if (modules[j].soldertype == "smd") {
                    tmp.push(modules[j]);
                    j++;
                    continue;
                }
                if (modules[k].soldertype == "smd") {
                    tmp.push(modules[k]);
                    k++;
                    continue;
                }
            }

            // sort by itemkey
            if (modules[j].itemkey > modules[k].itemkey) {   ///  <
                tmp.push(modules[j]);
                j++;
            } else if (modules[j].itemkey == modules[k].itemkey) {
                if (modules[j]["component"].ref.length < modules[k]["component"].ref.length) {
                    tmp.push(modules[j]);
                    j++;
                } else if (modules[j]["component"].ref.length == modules[k]["component"].ref.length && modules[j]["component"].ref < modules[k]["component"].ref) {
                    tmp.push(modules[j]);
                    j++;
                } else {
                    tmp.push(modules[k]);
                    k++;
                }
            } else {
                tmp.push(modules[k]);
                k++;
            }
        }   

        while (j <= n) {
            tmp.push(modules[j]);
            j++;
        }   

        while (k <= iEnd) {
            tmp.push(modules[k]);
            k++;
        }   

        k = tmp.length;
        for (var i = 0; i < k; i++) {
            if (modules[iBegin + i]["component"].ref != tmp[i]["component"].ref) {
                modules[iBegin + i] = tmp[i];
            }
        }       
    }

    var len = modules.length;
    var dt = 1;
    while (dt < len) {
        var i = 0;
        while (i < len - dt) {
            if (i + 2 * dt < len) {
                mergeModules(i, i + dt - 1, i + 2 * dt - 1);
            } else {
                mergeModules(i, i + dt - 1, len - 1);
            }
            i = i + 2 * dt;
        }
        dt = 2 * dt;
    }
    return modules;
};


function generateBom(pcb, config, extra_data) {
    // type (list, dict, dict) -> dict
    // New v2.x format: bom rows are lists of [ref, id] tuples.
    // Field values (Value, Footprint, extra fields) are stored in bom.fields keyed by component id.
    var extra_data = arguments[2] ? arguments[2] : {};

    var res = {};
    var modules = pcb.modules;
    var show_fields = (config["htmlConfig"].fields) ? config["htmlConfig"].fields : ["Value", "Footprint"];
    var part_groups = {};   // group_key -> [[ref, id], ...]
    var fields = {};        // id -> [field_value1, field_value2, ...]
    var skippedComponents = [];
    var failedIds = [];
    var failedErrors = {};
    var failedGroups = [];
    var count = modules.length;

    for (var i = 0; i < count; i++) {
        if (!modules[i]["failed"] && skipComponent(modules[i], config)) {
            skippedComponents.push(i);
            continue;
        }

        var comp = modules[i]["component"];
        var flds = [];
        var group_key_parts = [];

        for (var fi = 0; fi < show_fields.length; fi++) {
            var field_name = show_fields[fi];
            var val;
            if (field_name === "Value") {
                val = comp.val;
            } else if (field_name === "Footprint") {
                val = comp.footprint;
            } else {
                // extra field
                val = "";
                if (Object.prototype.hasOwnProperty.call(extra_data, comp.ref) &&
                    Object.prototype.hasOwnProperty.call(extra_data[comp.ref], field_name)) {
                    val = extra_data[comp.ref][field_name];
                }
            }
            flds.push(val);
            group_key_parts.push(val);
        }

        fields[i] = flds;

        if (modules[i]["failed"]) {
            // failed component: always a standalone row, shown on top in red
            failedIds.push(i);
            failedErrors[i] = modules[i]["error"];
            failedGroups.push([[comp.ref, i]]);
            continue;
        }

        var group_key = group_key_parts.join("\x1f");

        if (!Object.prototype.hasOwnProperty.call(part_groups, group_key)) {
            part_groups[group_key] = [[comp.ref, i]];
        } else {
            part_groups[group_key].push([comp.ref, i]);
        }
    }

    res.both = [];
    for (var fg = 0; fg < failedGroups.length; fg++) {
        res.both.push(failedGroups[fg]);
    }
    for (var key in part_groups) {
        res.both.push(part_groups[key]);
    }

    res.F = [];
    res.B = [];
    for (var r = 0; r < res.both.length; r++) {
        var row = res.both[r];
        var frefs = [];
        var brefs = [];
        for (var rr = 0; rr < row.length; rr++) {
            if (modules[row[rr][1]]["component"].layer == "F") {
                frefs.push(row[rr]);
            } else {
                brefs.push(row[rr]);
            }
        }
        if (frefs.length > 0) {
            res.F.push(frefs);
        }
        if (brefs.length > 0) {
            res.B.push(brefs);
        }
    }

    res.skipped = skippedComponents;
    res.failed = failedIds;
    res.failedErrors = failedErrors;
    res.fields = fields;
    return res;
}


function save2file(src, filename, noBOM) {
    var noBOM = arguments[2] ? arguments[2] : false; 
    var fso = new ActiveXObject("Scripting.FileSystemObject"); 
    var filename = filename.replace("/", "\\");
    var arrFolder = filename.split("\\");
    var len = arrFolder.length - 1;
    var folder = "";
    if (arrFolder[len] == "") {
        showmessage("path error");
        return;
    }
    for (var i = 0; i < len; i++) {
        if (arrFolder[i] == "") {
            showmessage("path error");
            return;
        }
        folder = folder + arrFolder[i];
        if (!fso.FolderExists(folder)) {
            fso.CreateFolder(folder);
        }
        folder = folder + "\\"; 
    }
    // var folder = ExtractFilePath(filename);
    // if (!fso.FolderExists(folder)) {
    //     fso.CreateFolder(folder);
    // } 

    if (fso.FileExists(filename)) {
        try {
            fso.DeleteFile(filename, true);
        }
        catch (e) {
            showmessage(e.message);
        }
    }

    var stm = new ActiveXObject("Adodb.Stream");
    stm.Type = 2;
    stm.Mode = 3;
    stm.Open();
    stm.Charset = "utf-8";
    
    stm.Position = stm.Size;
    stm.WriteText(src);
    
    if (noBOM) {
        // remove the BOM head
        stm.Position = 3;
        var newstm = new ActiveXObject("Adodb.Stream");
        newstm.Mode = 3;
        newstm.Type = 1;
        newstm.Open();
        stm.CopyTo(newstm);
        newstm.SaveToFile(filename, 2);      
        newstm.flush();
        newstm.Close();
    } else {
        stm.SaveToFile(filename, 2);      
        stm.flush();
        stm.Close();     
    }
}

function loadfile(filename) {
    var stm = new ActiveXObject("Adodb.Stream");
    stm.Type = 2;
    stm.Mode = 3;
    stm.Open();
    stm.Charset = "utf-8";
    stm.Position = stm.Size;

    var fso = new ActiveXObject("Scripting.FileSystemObject"); 
    if (!fso.FileExists(filename)) {
        s = "";
    }
    else {
        stm.LoadFromFile(filename);
        var s = stm.ReadText();    
    }
    stm.flush();
    stm.Close();
    return s;
}


function generateFile(compressed_pcbdata, config_js) {
    var filepath = CURRENT_PATH + "web\\";

    var html = loadfile(filepath + "ibom.html");
    html = html.replace("///CSS///", loadfile(filepath + "ibom.css"));
    html = html.replace("///SPLITJS///", loadfile(filepath + "split.js"));
    html = html.replace("///LZ-STRING///", loadfile(filepath + "lz-string.js"));
    html = html.replace("///POINTER_EVENTS_POLYFILL///", loadfile(filepath + "pep.js"));
    html = html.replace("///CONFIG///", config_js);
    html = html.replace("///PCBDATA///", compressed_pcbdata);
    html = html.replace("///UTILJS///", loadfile(filepath + "util.js"));
    html = html.replace("///RENDERJS///", loadfile(filepath + "render.js"));
    html = html.replace("///TABLEUTILJS///", loadfile(filepath + "table-util.js"));
    html = html.replace("///IBOMJS///", loadfile(filepath + "ibom.js"));

    html = html.replace("///USERCSS///", loadfile(filepath + "user.css"));
    html = html.replace("///USERJS///", loadfile(filepath + "user.js"));
    html = html.replace("///USERHEADER///", loadfile(filepath + "userheader.html"));
    html = html.replace("///USERFOOTER///", loadfile(filepath + "userfooter.html"));
   
    return html;
}


function loadExtraData(filename) {
    var s = loadfile(filename);
    if (s == "") {
        return {};
    }
    var d = JSON.parse(s);
    //d = {"123": "C1,C2", "332": "R1"}

    //    {
    //       ref1: {
    //         field_name1: field_value1,
    //         field_name2: field_value2,
    //         ...
    //         },
    //       ref2: ...
    //    }
    var extra_data = {};
    for (var key in d) {
        var ref = d[key].split(",")[0];
        extra_data[ref] = {};
        extra_data[ref]["Num."] = key;
    }
    return extra_data;
}


function main() {
    var config = getConfig();
    var pcb = parsePcb(config);
    if (!pcb) {
        return;
    };
    
    var filename = pcb.boardpath + "PnPout\\" + "extra_data.txt";
    // var extra_data = loadExtraData(filename);
    var extra_data;

    pcb.pcbdata["bom"] = generateBom(pcb, config, extra_data);
    pcb.pcbdata["ibom_version"] = "v2.12.0";

    // var t1 = new Date().getTime();

    var s = JSON.stringify(pcb.pcbdata);
    // var t2 = new Date().getTime();
    var b = LZStr.compressToBase64(s);
    // var t3 = new Date().getTime();
    // showmessage("t1: "+String(t1-t0)+"   t2: "+String(t2-t1)+"   t3: "+String(t3-t2));

    b = 'var pcbdata = JSON.parse(LZString.decompressFromBase64("' + b + '"))';

    var config_js = "var config = " + JSON.stringify(config.htmlConfig);
    var html = generateFile(b, config_js);
    filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".html";
    save2file(html, filename, false);

    try {
        var commandline = "explorer.exe " + ExtractFilePath(filename);
        var errcode = RunApplication(commandline);
    }
    catch(e) {
        showmessage(e.message);
    };
}

