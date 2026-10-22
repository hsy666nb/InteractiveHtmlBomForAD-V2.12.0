
function startWin() {
    mainWin.Show(); 
}

function mainWinShow(Sender) {
    mainWin.Caption = "\u4EA4\u4E92\u5F0FBOM v2.12.0";
    TabSheet1.Caption = "\u901A\u7528";
    GroupBox1.Caption = "BOM \u8F93\u51FA\u8DEF\u5F84";
    StaticText1.Caption = "\u76EE\u5F55";
    GroupBox3.Caption = "\u9644\u52A0 PCB \u6570\u636E";
    CbIncludeTracksAndSolidPolygons.Caption = "\u5305\u542B\u8D70\u7EBF/\u5B9E\u5FC3\u94DC\u76AE";
    CbIncludeVias.Caption = "\u5305\u542B\u8FC7\u5B54";
    CbIncludeHatched.Caption = "\u5305\u542B\u7F51\u683C\u586B\u5145";
    CbIncludeNets.Caption = "\u5305\u542B\u7F51\u7EDC";
    GroupBox4.Caption = "\u5143\u4EF6\u9ED1\u540D\u5355";
    CbBlacklistEmpty.Caption = "\u503C\u4E3A DNP/\u7A7A/~ \u7684\u5143\u4EF6";
    CbBlacklist1Pad.Caption = "\u5355\u710A\u76D8\u5143\u4EF6";
    CbBlacklistTh.Caption = "\u63D2\u4EF6\u5143\u4EF6";
    GenerateBom.Caption = "\u751F\u6210BOM";
    GroupBox10.Caption = "PCB \u8FB9\u6846\u5C42";
    RBtnKeepOutLayer.Caption = "\u7981\u6B62\u5E03\u7EBF\u5C42(KeepOut)";
    RBtnMech1.Caption = "\u673A\u68B01\u5C42(Mech-1)";
    TabSheet2.Caption = "\u8BBE\u7F6E";
    CbDarkMode.Caption = "\u6DF1\u8272\u6A21\u5F0F";
    CbShowFootprintPads.Caption = "\u663E\u793A\u5C01\u88C5\u710A\u76D8";
    CbShowFabricationLayer.Caption = "\u663E\u793A\u88C5\u914D\u5C42";
    CbShowSilkscreen.Caption = "\u663E\u793A\u4E1D\u5370\u5C42";
    StaticText3.Caption = "\u9AD8\u4EAE1\u811A";
    RBtnHighlightPin1None.Caption = "\u65E0";
    RBtnHighlightPin1All.Caption = "\u5168\u90E8";
    RBtnHighlightPin1Selected.Caption = "\u9009\u4E2D";
    CbContinuousRedrawOnDrag.Caption = "\u62D6\u52A8\u65F6\u5B9E\u65F6\u91CD\u7ED8";
    StaticText2.Caption = "\u677F\u5B50\u65CB\u8F6C";
    CbOffsetBackRotation.Caption = "\u80CC\u9762\u65CB\u8F6C\u504F\u79FB";
    GroupBox5.Caption = "\u52FE\u9009\u5217";
    GroupBox6.Caption = "BOM \u89C6\u56FE";
    RBtnBomOnly.Caption = "\u4EC5BOM";
    RBtnBomLeftDrawingRight.Caption = "BOM\u5DE6, \u677F\u56FE\u53F3";
    RBtnBomTopDrawingBottom.Caption = "BOM\u4E0A, \u677F\u56FE\u4E0B";
    GroupBox7.Caption = "\u5C42\u89C6\u56FE";
    RBtnFrontAndBack.Caption = "\u6B63\u9762\u548C\u80CC\u9762";
    RBtnFrontOnly.Caption = "\u4EC5\u6B63\u9762";
    RBtnBackOnly.Caption = "\u4EC5\u80CC\u9762";
    GroupBox8.Caption = "\u5176\u4ED6";
    CbOpenBrowser.Caption = "\u6253\u5F00\u6D4F\u89C8\u5668";
    CbOpenExplorer.Caption = "\u6253\u5F00\u6587\u4EF6\u5939";
    SaveDialog1.Filter = "HTML \u6587\u4EF6 (*.html)|*.HTML|\u6587\u672C\u6587\u4EF6 (*.txt)|*.TXT|\u6240\u6709\u6587\u4EF6 (*.*)|*.*";
    OpenDialog1.Filter = "\u5B57\u6BB5\u503C(\u952E)-\u4F4D\u53F7(\u503C) (*.json)|*.JSON|\u6587\u672C\u6587\u4EF6 (*.txt)|*.TXT|\u6240\u6709\u6587\u4EF6 (*.*)|*.*";

    var iniFileName = CURRENT_PATH + "config.ini";

    if (FileExists(iniFileName)) {
        var iniFile = TIniFile.Create(iniFileName);
        if (PCBServer != null) {
            PCBServer.PreProcess;
            var currentPcb = PCBServer.GetCurrentPCBBoard();

            if (currentPcb != null) {
                var currentPath = ExtractFilePath(currentPcb.FileName);
                var pcbBaseName = ExtractFileName(currentPcb.FileName);
                var dotPos = pcbBaseName.lastIndexOf(".");
                if (dotPos > 0) {
                    pcbBaseName = pcbBaseName.substring(0, dotPos);
                }
                var filename = currentPath + "PnPout\\" + pcbBaseName + ".html";
                TEditCurrentPcbPath.Text = filename;
            } else {
                TEditCurrentPcbPath.Text = iniFile.ReadString("General", "Directory", "");
            }

            PCBServer.PostProcess;
        } else {
            TEditCurrentPcbPath.Text = iniFile.ReadString("General", "Directory", "");
        }
        CbIncludeTracksAndSolidPolygons.Checked = iniFile.ReadBool("General", "IncludeTracksAndSolidPolygons", false);
        CbIncludeVias.Checked = iniFile.ReadBool("General", "IncludeVias", false);
        // CbIncludeHatched.Checked = iniFile.ReadBool("General", "IncludeHatched", false);
        // CbIncludeNets.Checked = iniFile.ReadBool("General", "IncludeNets", false);
        CbIncludeHatched.Checked = false;
        CbIncludeNets.Checked = false;

        CbBlacklistEmpty.Checked = iniFile.ReadBool("General", "BlacklistEmpty", true);
        CbBlacklist1Pad.Checked = iniFile.ReadBool("General", "Blacklist1Pad", true);
        CbBlacklistTh.Checked = iniFile.ReadBool("General", "BlacklistTh", false);
        if (iniFile.ReadBool("General", "PcbOutlineMech1", true)) {
            RBtnMech1.Checked = true;
            RBtnKeepOutLayer.Checked = false;
        } else {
            RBtnMech1.Checked = false;
            RBtnKeepOutLayer.Checked = true;
        }

        CbDarkMode.Checked = iniFile.ReadBool("HtmlDefaults", "DarkMode", false);
        CbShowFootprintPads.Checked = iniFile.ReadBool("HtmlDefaults", "ShowFootprintPads", true);
        CbShowFabricationLayer.Checked = iniFile.ReadBool("HtmlDefaults", "ShowFabricationLayer", false);
        CbShowSilkscreen.Checked = iniFile.ReadBool("HtmlDefaults", "ShowSilkscreen", true);
        var hp1 = iniFile.ReadString("HtmlDefaults", "HighlightPin1", "none");
        if (hp1 == "True" || hp1 == "true" || hp1 == "1") hp1 = "all";
        else if (hp1 == "False" || hp1 == "false" || hp1 == "0") hp1 = "none";
        RBtnHighlightPin1None.Checked = (hp1 == "none");
        RBtnHighlightPin1All.Checked = (hp1 == "all");
        RBtnHighlightPin1Selected.Checked = (hp1 == "selected");
        CbContinuousRedrawOnDrag.Checked = iniFile.ReadBool("HtmlDefaults", "ContinuousRedrawOnDrag", true);

        TTrackBarRotation.Position = (iniFile.ReadInteger("HtmlDefaults", "PcbRotation", 0) + 180)/5;
        TTextRotation.Caption = [TTrackBarRotation.Position * 5 - 180, String.fromCharCode(176)].join("");
        CbOffsetBackRotation.Checked = iniFile.ReadBool("HtmlDefaults", "OffsetBackRotation", false);

        TEditHtmlCheckboxes.Text = iniFile.ReadString("HtmlDefaults", "HtmlCheckboxes", "Sourced,Placed");
        RBtnBomOnly.Checked = iniFile.ReadBool("HtmlDefaults", "BomViewOnly", false);
        RBtnBomLeftDrawingRight.Checked = iniFile.ReadBool("HtmlDefaults", "BomViewLeftDrawingRight", true);
        RBtnBomTopDrawingBottom.Checked = iniFile.ReadBool("HtmlDefaults", "BomViewTopDrawingBottom", false);
        RBtnFrontOnly.Checked = iniFile.ReadBool("HtmlDefaults", "PcbLayerFrontOnly", false);
        RBtnFrontAndBack.Checked = iniFile.ReadBool("HtmlDefaults", "PcbLayerFrontAndBack", true);
        RBtnBackOnly.Checked = iniFile.ReadBool("HtmlDefaults", "PcbLayerBackOnly", false);
        CbOpenBrowser.Checked = iniFile.ReadBool("HtmlDefaults", "OtherOpenBrowser", false);
        CbOpenExplorer.Checked = iniFile.ReadBool("HtmlDefaults", "OtherOpenExplorer", true);

        iniFile.Free;
    } else {
        if (PCBServer != null) {
            PCBServer.PreProcess;
            var currentPcb = PCBServer.GetCurrentPCBBoard();

            if (currentPcb != null) {
                var currentPath = ExtractFilePath(currentPcb.FileName);
                var pcbBaseName = ExtractFileName(currentPcb.FileName);
                var dotPos = pcbBaseName.lastIndexOf(".");
                if (dotPos > 0) {
                    pcbBaseName = pcbBaseName.substring(0, dotPos);
                }
                var filename = currentPath + "PnPout\\" + pcbBaseName + ".html";
                TEditCurrentPcbPath.Text = filename;
            } else {
                TEditCurrentPcbPath.Text = "";
            }

            PCBServer.PostProcess;
        } else {
            TEditCurrentPcbPath.Text = "";
        }

        CbBlacklistEmpty.Checked = true;
        CbBlacklist1Pad.Checked = true;
        CbBlacklistTh.Checked = false;

        CbIncludeTracksAndSolidPolygons.Checked = false;
        CbIncludeVias.Checked = false;
        CbIncludeHatched.Checked = false;
        CbIncludeNets.Checked = false;

        CbBlacklistEmpty.Checked = true;
        CbBlacklist1Pad.Checked = true;
        RBtnKeepOutLayer.Checked = false;
        RBtnMech1.Checked = true;

        CbDarkMode.Checked = false;
        CbShowFootprintPads.Checked = true;
        CbShowFabricationLayer.Checked = false;
        CbShowSilkscreen.Checked = true;
        RBtnHighlightPin1None.Checked = true;
        RBtnHighlightPin1All.Checked = false;
        RBtnHighlightPin1Selected.Checked = false;
        CbContinuousRedrawOnDrag.Checked = true;

        TTrackBarRotation.Position = 36;
        TTextRotation.Caption = [0, String.fromCharCode(176)].join("");
        CbOffsetBackRotation.Checked = false;

        TEditHtmlCheckboxes.Text = "Sourced,Placed";
        RBtnBomOnly.Checked = false;
        RBtnBomLeftDrawingRight.Checked = true;
        RBtnBomTopDrawingBottom.Checked = false;
        RBtnFrontOnly.Checked = false;
        RBtnFrontAndBack.Checked = true;
        RBtnBackOnly.Checked = false;
        CbOpenBrowser.Checked = false;
        CbOpenExplorer.Checked = true;
    }
}

function GenerateBomClick(Sender) {
    var iniFileName = CURRENT_PATH + "config.ini";
    setValueToInifile(iniFileName);

    // var config = getConfig();
    var config = {};
    config.include = {};
    config.htmlConfig = {};
    config.bomFilter = {};
    config.bomFilter["skipempty"] = CbBlacklistEmpty.Checked;
    config.bomFilter["skiponepad"] = CbBlacklist1Pad.Checked;
    config.bomFilter["skipth"] = CbBlacklistTh.Checked;

    config.htmlConfig["extra_fields"] = [];
    config.htmlConfig["fields"] = ["Value", "Footprint"].concat(config.htmlConfig["extra_fields"]);
    config.htmlConfig["redraw_on_drag"] = CbContinuousRedrawOnDrag.Checked;
    config.htmlConfig["offset_back_rotation"] = CbOffsetBackRotation.Checked;
    config.htmlConfig["kicad_text_formatting"] = false;
    config.htmlConfig["mark_when_checked"] = "";
    config.htmlConfig["custom_metadata"] = "";

    if (RBtnMech1.Checked) {
        config.PcbOutlineMech1 = true;
    } else {
        config.PcbOutlineMech1 = false;
    }
    
    if (RBtnBomOnly.Checked) {
        config.htmlConfig["bom_view"] = "bom-only";
    } else if (RBtnBomLeftDrawingRight.Checked) {
        config.htmlConfig["bom_view"] = "left-right";
    } else if (RBtnBomTopDrawingBottom.Checked) {
        config.htmlConfig["bom_view"] = "top-bottom";
    }

    if (RBtnFrontOnly.Checked) {
        config.htmlConfig["layer_view"] = "F";
    } else if (RBtnFrontAndBack.Checked) {
        config.htmlConfig["layer_view"] = "FB";
    } else if (RBtnBackOnly.Checked) {
        config.htmlConfig["layer_view"] = "B";
    }
    
    config.htmlConfig["show_silkscreen"] = CbShowSilkscreen.Checked;
    config.htmlConfig["checkboxes"] = TEditHtmlCheckboxes.Text;
    config.htmlConfig["dark_mode"] = CbDarkMode.Checked;
    var hp1Mode = "none";
    if (RBtnHighlightPin1All.Checked) hp1Mode = "all";
    else if (RBtnHighlightPin1Selected.Checked) hp1Mode = "selected";
    config.htmlConfig["highlight_pin1"] = hp1Mode;
    config.htmlConfig["show_pads"] = CbShowFootprintPads.Checked;
    config.htmlConfig["show_fabrication"] = CbShowFabricationLayer.Checked;
    // config.htmlConfig["extra_fields"] = [];
    config.htmlConfig["board_rotation"] = TTrackBarRotation.Position * 5 - 180;

    config.include["tracks"] = CbIncludeTracksAndSolidPolygons.Checked;
    config.include["polys"] = CbIncludeTracksAndSolidPolygons.Checked;
    config.include["polyHatched"] = CbIncludeHatched.Checked;
    config.include["vias"] = CbIncludeVias.Checked;
    config.include["nets"] = CbIncludeNets.Checked;

    var filename = getSaveDir(TEditCurrentPcbPath.Text);
    if (filename == "") {
        return;
    }

    var pcb = parsePcb(config);
    if (!pcb) {
        return;
    };

    var extra_data;

    pcb.pcbdata["bom"] = pickBom(pcb, config, extra_data);
    pcb.pcbdata["ibom_version"] = "v2.12.0";

    var s = JSON.stringify(pcb.pcbdata);
    var b = LZStr.compressToBase64(s);

    b = 'var pcbdata = JSON.parse(LZString.decompressFromBase64("' + b + '"))';

    var config_js = "var config = " + JSON.stringify(config.htmlConfig);
    var html = generateFile(b, config_js);
    save2file(html, filename, false);

    try {
        if (CbOpenExplorer.Checked) {
            var commandline = "explorer.exe " + ExtractFilePath(filename);
            var errcode = RunApplication(commandline);
        }
        if (CbOpenBrowser.Checked) {
            var browserCmd = "cmd /c start \"\" \"" + filename + "\"";
            RunApplication(browserCmd);
        }
    }
    catch(e) {
        showmessage(e.message);
    };
}

function pickBom(pcb, config, extra_data) {
    // New v2.x format: bom rows are lists of [ref, id] tuples.
    // Field values are stored in bom.fields keyed by component id.
    var extra_data = arguments[2] ? arguments[2] : {};

    var res = {};
    var modules = pcb.modules;
    var show_fields = (config["htmlConfig"].fields) ? config["htmlConfig"].fields : ["Value", "Footprint"];
    var part_groups = {};   // group_key -> [[ref, id], ...]
    var fields = {};        // id -> [field_value1, field_value2, ...]
    var skippedComponents = [];
    var count = modules.length;

    for (var i = 0; i < count; i++) {
        if (skipComponent(modules[i], config)) {
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
        var group_key = group_key_parts.join("\x1f");

        if (!Object.prototype.hasOwnProperty.call(part_groups, group_key)) {
            part_groups[group_key] = [[comp.ref, i]];
        } else {
            part_groups[group_key].push([comp.ref, i]);
        }
    }

    res.both = [];
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
    res.fields = fields;
    return res;
}


function BtnSaveClick(Sender) {
    SaveDialog1.InitialDir = ExtractFilePath(TEditCurrentPcbPath.Text);
    if (SaveDialog1.Execute) {
        TEditCurrentPcbPath.Text = SaveDialog1.Filename;
    }
}

function TTrackBarRotationChange(Sender) {
    TTextRotation.Caption = [TTrackBarRotation.Position * 5 - 180, String.fromCharCode(176)].join("");
}


function setValueToInifile(iniFileName) {
    var iniFile = TIniFile.Create(iniFileName);
    iniFile.WriteString("General", "Directory", TEditCurrentPcbPath.Text);
    iniFile.WriteBool("General", "IncludeTracksAndSolidPolygons", CbIncludeTracksAndSolidPolygons.Checked);
    iniFile.WriteBool("General", "IncludeVias", CbIncludeVias.Checked);
    iniFile.WriteBool("General", "IncludeHatched", CbIncludeHatched.Checked);
    iniFile.WriteBool("General", "IncludeNets", CbIncludeNets.Checked);
    iniFile.WriteBool("General", "BlacklistEmpty", CbBlacklistEmpty.Checked);
    iniFile.WriteBool("General", "Blacklist1Pad", CbBlacklist1Pad.Checked);
    iniFile.WriteBool("General", "BlacklistTh", CbBlacklistTh.Checked);
    iniFile.WriteBool("General", "PcbOutlineMech1", RBtnMech1.Checked);

    iniFile.WriteBool("HtmlDefaults", "DarkMode", CbDarkMode.Checked);
    iniFile.WriteBool("HtmlDefaults", "ShowFootprintPads", CbShowFootprintPads.Checked);
    iniFile.WriteBool("HtmlDefaults", "ShowFabricationLayer", CbShowFabricationLayer.Checked);
    iniFile.WriteBool("HtmlDefaults", "ShowSilkscreen", CbShowSilkscreen.Checked);
    var hp1Val = "none";
    if (RBtnHighlightPin1All.Checked) hp1Val = "all";
    else if (RBtnHighlightPin1Selected.Checked) hp1Val = "selected";
    iniFile.WriteString("HtmlDefaults", "HighlightPin1", hp1Val);
    iniFile.WriteBool("HtmlDefaults", "ContinuousRedrawOnDrag", CbContinuousRedrawOnDrag.Checked);
    iniFile.WriteInteger("HtmlDefaults", "PcbRotation", (TTrackBarRotation.Position * 5 - 180));
    iniFile.WriteBool("HtmlDefaults", "OffsetBackRotation", CbOffsetBackRotation.Checked);
    iniFile.WriteString("HtmlDefaults", "HtmlCheckboxes", TEditHtmlCheckboxes.Text);
    iniFile.WriteBool("HtmlDefaults", "BomViewOnly", RBtnBomOnly.Checked);
    iniFile.WriteBool("HtmlDefaults", "BomViewLeftDrawingRight", RBtnBomLeftDrawingRight.Checked);
    iniFile.WriteBool("HtmlDefaults", "BomViewTopDrawingBottom", RBtnBomTopDrawingBottom.Checked);
    iniFile.WriteBool("HtmlDefaults", "PcbLayerFrontOnly", RBtnFrontOnly.Checked);
    iniFile.WriteBool("HtmlDefaults", "PcbLayerFrontAndBack", RBtnFrontAndBack.Checked);
    iniFile.WriteBool("HtmlDefaults", "PcbLayerBackOnly", RBtnBackOnly.Checked);
    iniFile.WriteBool("HtmlDefaults", "OtherOpenBrowser", CbOpenBrowser.Checked);
    iniFile.WriteBool("HtmlDefaults", "OtherOpenExplorer", CbOpenExplorer.Checked);

    iniFile.Free;
}

function getSaveDir(text) {
    var fso = new ActiveXObject("Scripting.FileSystemObject"); 
    var filename = text.replace("/", "\\");
    var arr = filename.split("\\");
    var len = arr.length - 1;

    if (!fso.FolderExists(arr[0])) {
        showmessage("Directory error");
        return "";
    }

    for (var i = 0; i <= len; i++) {
        if (arr[i] == "") {
            showmessage("Directory error");
            return "";
        }
    }

    return filename;
}

