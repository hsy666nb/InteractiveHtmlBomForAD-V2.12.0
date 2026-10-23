
/// AD10.js
/// 
// function Normalize(coord) {
//     return Math.round(0.0254 * coord / 100) / 100;
// }

// function RoundNum(num) {
//     return Math.round(num * 100) / 100;
// }

Number.prototype.round = function anonymFun_round(n) {
    var n = n || 2;
    if (n == 2 || n < 0) {
        return Math.round(this * 100) / 100;
    }
    var d = Math.pow(10, n);
    return Math.round(this * d) / d;
};


function rotatePoint(cPoint, rPoint, angle) {
    var rad = Degrees2Radians(angle);
    var dx = rPoint[0] - cPoint[0];
    var dy = rPoint[1] - cPoint[1];
    var nx = (dx * Math.cos(rad) - dy * Math.sin(rad) + cPoint[0]).round();
    var ny = -((dx * Math.sin(rad) + dy * Math.cos(rad) + cPoint[1]).round());
    return [nx, ny];
}


function get_bbox(Prim) {

    function get_component_bbox(Component) {
        var bbox = {};
        var x0, y0, x1, y1;
        x0 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Left);
        y0 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Bottom);
        x1 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Right);
        y1 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Top);
        bbox["pos"] = [x0.round(), -y1.round()]; // 
        bbox["relpos"] = [0, 0];
        bbox["angle"] = 0;
        bbox["size"] = [(x1 - x0).round(), (y1 - y0).round()];
        bbox["center"] = [(x0 + bbox.size[0] / 2).round(), -(y0 + bbox.size[1] / 2).round()];
        return bbox;
    }

    function get_text_bbox(Text) {
        var bbox = {};
        var x0, y0, x1, y1;
        x0 = CoordToMMs(Text.BoundingRectangleForSelection.Left);
        y0 = CoordToMMs(Text.BoundingRectangleForSelection.Bottom);
        x1 = CoordToMMs(Text.BoundingRectangleForSelection.Right);
        y1 = CoordToMMs(Text.BoundingRectangleForSelection.Top);
        
        // bbox["pos"] = [x0, -y1];
        // bbox["relpos"] = [0, 0];
        // bbox["angle"] = 0;
        bbox["size"] = [(x1 - x0).round(), (y1 - y0).round()];

        bbox["center"] = [(x0 + bbox.size[0] / 2).round(), -(y0 + bbox.size[1] / 2).round()];

        return bbox;
    }

    switch (Prim.ObjectId) {
        case eComponentObject:
            return get_component_bbox(Prim);
            break;
        case eTextObject:
            return get_text_bbox(Prim);
            break;

        default:
    }
}

/// 
function parsePcb(config) {
    //"use strict";
    var pcb = {}; 
    pcb["pcbdata"] = {};
    pcb["tracks"] = [];
    pcb["texts"] = [];
    pcb["pads"] = [];
    pcb["vias"] = [];
    pcb["arcs"] = [];
    pcb["modules"] = [];
    pcb["fills"] = [];
    pcb["regions"] = [];
    pcb["polygons"] = [];

    pcb["pos"] = [];

    pcb["Layers"] = {};
    
    if (config.PcbOutlineMech1) {
        pcb.Layers.OUTLINE_LAYER = eMechanical1;
    } else {
        pcb.Layers.OUTLINE_LAYER = String2Layer("Keep Out Layer");
    }
    
    pcb.Layers.INFO_LAYER = eMechanical2;
    pcb.Layers.TOP_DIMENSIONS_LAYER = eMechanical11;
    pcb.Layers.BOT_DIMENSIONS_LAYER = eMechanical12;
    pcb.Layers.TOP_MECH_BODY_LAYER = eMechanical13;
    pcb.Layers.BOT_MECH_BODY_LAYER = eMechanical14;
    pcb.Layers.TOP_COURTYARD_LAYER = eMechanical15;
    pcb.Layers.BOT_COURTYARD_LAYER = eMechanical16;
    pcb.Layers.UNUSED_LAYERS = MkSet(eMechanical3, eMechanical4, eMechanical5, eMechanical6, eMechanical7, eMechanical8, eMechanical9, eMechanical10);
    pcb.Layers.TOP_OVERLAY_LAYER = String2Layer("Top Overlay");
    pcb.Layers.BOT_OVERLAY_LAYER = String2Layer("Bottom Overlay");
    pcb.Layers.TOP_SOLDERMASK_LAYER = String2Layer("Top Solder Mask");
    pcb.Layers.BOT_SOLDERMASK_LAYER = String2Layer("Bottom Solder Mask");
    pcb.Layers.TOP_PASTE_LAYER = String2Layer("Top Paste");
    pcb.Layers.BOT_PASTE_LAYER = String2Layer("Bottom Paste");
    pcb.Layers.DRILL_GUIDE_LAYER = String2Layer("Drill Guide");
    pcb.Layers.DRILL_DRAWING_LAYER = String2Layer("Drill Drawing");
    pcb.Layers.KEEP_OUT_LAYER = String2Layer("Keep Out Layer");
    pcb.Layers.MULTI_LAYER = String2Layer("Multi Layer");

    // Resolve the fill object id once: AD exposes it as eFillObject in some
    // builds and eFillobject in others. Passing an undefined value to MkSet
    // can crash the scripting system.
    var FILL_OBJ = (typeof eFillObject != "undefined") ? eFillObject : eFillobject;

    function getNetName(Prim) {
        try {
            if (!Prim.InNet) return "";
            var net = Prim.Net;
            if (net == null) return "";
            if (typeof net == "string") return net;
            if (net.Name == null) return "";
            return String(net.Name);
        } catch (e) {
            return "";
        }
    }

    function parseTrack(Prim) {
        var res = {};
        var start = [CoordToMMs(Prim.x1).round(), -CoordToMMs(Prim.y1).round()];
        var end = [CoordToMMs(Prim.x2).round(), -CoordToMMs(Prim.y2).round()];
        res["layer"] = Prim.Layer;
        if (Prim.InPolygon) {
            res["type"] = "polygon";
            res["svgpath"] = ["M", start, "L", end].join(" ");
        } else {
            res["type"] = "segment";
            res["start"] = start;
            res["end"] = end;
            res["width"] = CoordToMMs(Prim.Width).round();
        } 

        // Only copper primitives carry a net; touching the net API on
        // silkscreen / mechanical graphics can crash inside AD.
        if (config.include.nets && (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer)) {
            var net = getNetName(Prim);
            if (net) res["net"] = net;
        };

        return res;
    }

    function parseArc(Prim) {
        var res = {};
        var width = CoordToMMs(Prim.LineWidth).round();
        var netName = (config.include.nets && (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer)) ? getNetName(Prim) : "";
        function arc2path(cx, cy, radius, startangle, endangle) {
            var startrad = Degrees2Radians(startangle);
            var endrad = Degrees2Radians(endangle);
            var start = [cx + (radius * Math.cos(startrad)), cy + (radius * Math.sin(startrad))];
            var end = [cx + (radius * Math.cos(endrad)), cy + (radius * Math.sin(endrad))];

            if (start[0] == end[0] && start[1] == end[1]) {
                var d = ["M", cx - radius, -cy, "a", radius, radius, 0, 1, 0, 2*radius, 0, "a", radius, radius, 0, 1, 0, -2*radius, 0].join(" ");
                return d;
            }

            var da = startangle > endangle ? endangle - startangle + 360 : endangle - startangle;
            var largeArcFlag = da <= 180 ? "0" : "1";
            var sweepFlag = 0;
            var d = ["M", start[0].round(), -start[1].round(), "A", radius, radius, 0, largeArcFlag, sweepFlag, end[0].round(), -end[1].round()].join(" ");

            return d;            
        }

        function arc2tracks(cx, cy, radius, startangle, endangle) {
            var da = startangle > endangle ? endangle - startangle + 360 : endangle - startangle;
            var n;
            if (da <= 90 && da >= 0) {
                n = 4;
            } else if (da <= 180 && da > 90) {
                n = 8;
            } else if (da <= 270 && da > 180) {
                n = 16;
            } else if (da <= 360 && da > 270) {
                n = 32;
            }

            var o = [cx + radius, cy];
            // var start = rotatePoint([cx, cy], o, startangle);

            var points = [];
            var step = da / n;
            for (var i = 0; i <= n; i++) {
                points.push(rotatePoint([cx, cy], o, startangle + i * step));
            }

            var tracks = [];
            var len = points.length - 1;
            if (Prim.InPolygon) {
                for (var i = 0; i < len; i++) {
                    tracks.push({
                        "type": "polygon",
                        // "svgpath": ["M", points[i+0][0], -points[i+0][1], points[i+1][0], -points[i+1][1]].join(" "),
                        "svgpath": ["M", points[i+0], points[i+1]].join(" "),
                        "layer": Prim.Layer
                    })
                }   
            } else {
                for (var i = 0; i < len; i++) {
                    tracks.push({
                        "type": "segment",
                        // "start": [points[i+0][0], -points[i+0][1]],
                        // "end": [points[i+1][0], -points[i+1][1]],
                        "start": points[i+0],
                        "end": points[i+1],
                        "layer": Prim.Layer,
                        "width": width
                    })
                }     
            }

            if (netName) {
                for (var j = 0; j < tracks.length; j++) {
                    tracks[j]["net"] = netName;
                }
            }

            return tracks;
        }

        // if (Prim.IsFreePrimitive && (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer)) {
        if (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer) {
            return arc2tracks(CoordToMMs(Prim.XCenter), CoordToMMs(Prim.YCenter), CoordToMMs(Prim.Radius), Prim.StartAngle, Prim.EndAngle);     
        } else {
            res["type"] = "arc";
            res["width"] = width;
            res["startangle"] = -Prim.EndAngle.round();
            res["endangle"] = -Prim.StartAngle.round();
            res["start"] = [CoordToMMs(Prim.XCenter).round(), -CoordToMMs(Prim.YCenter).round()];
            res["radius"] = CoordToMMs(Prim.Radius).round();
            res["layer"] = Prim.Layer;
            if (netName) res["net"] = netName;
            return res;
        }
    }

    // 90% done
    function parsePad(Prim) {
        var pads = [];
        var res = {};
        var layers = [];

        if (Prim.Layer == eTopLayer) {
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.TopXSize).round(), CoordToMMs(Prim.TopYSize).round()];
        }
        else if (Prim.Layer == eBottomLayer) {
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.BotXSize).round(), CoordToMMs(Prim.BotYSize).round()];
        }
        else {
            layers.splice(0, 0, "F", "B");
            res["type"] = "th";
            res["size"] = [CoordToMMs(Prim.TopXSize).round(), CoordToMMs(Prim.TopYSize).round()];  
        }

        res["layers"] = layers;
        res["pos"] = [CoordToMMs(Prim.x).round(), -CoordToMMs(Prim.y).round()]; 
        res["angle"] = -Prim.Rotation.round();
        
        // not done 
        if (Prim.Layer == eMultiLayer) {
            switch (Prim.TopShape) {
                case 1:  //  Round in AD
                    res["shape"] = (res["size"][0] == res["size"][1]) ? "circle" : "oval";  // done
                    break;
                case 2:  //  Rectangular in AD
                    res["shape"] = "rect";  // done
                    break;
                case 3:  // Octagonal in AD
                    res["shape"] = "chamfrect";  // not done,  it is circle for now  
                    break;
                case 9:  // Rounded Rectangle in AD
                    res["shape"] = "roundrect";  // 
                    break;
                default:
                    res["shape"] = "rect";  // unsupported custom shape, fallback to rect
            }

            switch (Prim.BotShape) {
                case 1: 
                    res["shape"] = (res["size"][0] == res["size"][1]) ? "circle" : "oval"; 
                    break;
                case 2:
                    res["shape"] = "rect";
                    break;
                case 3:
                    res["shape"] = "chamfrect"; 
                    break;
                case 9:
                    res["shape"] = "roundrect";
                    break;
                default:
                    res["shape"] = "rect";
            }    
        } 
        else {
            switch (Prim.ShapeOnLayer(Prim.Layer)) {
                case 1: 
                    res["shape"] = (res["size"][0] == res["size"][1]) ? "circle" : "oval"; 
                    break;
                case 2:
                    res["shape"] = "rect";
                    break;
                case 3:
                    res["shape"] = "chamfrect";  
                    break;
                case 9:
                    res["shape"] = "roundrect";
                    break;
                default:
                    res["shape"] = "rect";
            }           
        }   

        if (res["shape"] == "chamfrect") {  // not done
            res["radius"] = (Math.min(res["size"][0], res["size"][1]) * 0.5).round();
            res["chamfpos"] = res["pos"];
            res["chamfratio"] = 0.5;  

        } else if (res["shape"] == "roundrect") {
            res["radius"] = CoordToMMs(Prim.CornerRadius(Prim.Layer)).round();  //  smd ? th ?
        }

        if ("A1".indexOf(Prim.Name) != -1) {
            res["pin1"] = 1;
        }

        if (res["type"] == "th") {
            switch (Prim.HoleType) {
                case 0: // circle
                    res["drillsize"] = [CoordToMMs(Prim.HoleSize).round(), CoordToMMs(Prim.HoleSize).round()];
                    res["drillshape"] = "circle";
                    break;
                case 1: // square, but not supported in kicad, so do as circle
                    res["drillsize"] = [CoordToMMs(Prim.HoleSize).round(), CoordToMMs(Prim.HoleSize).round()];
                    res["drillshape"] = "circle";
                    break;
                case 2: // slot
                    res["drillsize"] = [CoordToMMs(Prim.HoleWidth).round(), CoordToMMs(Prim.HoleSize).round()];
                    res["drillshape"] = "oblong"; 
                    break;
                default:  //
            }
        }

        res["offset"] =  [CoordToMMs(Prim.XPadOffset(Prim.Layer)).round(), -CoordToMMs(Prim.YPadOffset(Prim.Layer)).round()];
        if (res["offset"][0] == 0 && res["offset"][1] == 0) {
            delete res["offset"];
        }

        if (config.include.nets) {
            var net = getNetName(Prim);
            if (net) res["net"] = net;
        }

        pads.push(res);

        return pads;
    }

    // 75% done
    function parseVia(Prim) {
        var vias = [];
        var res = {};
        var layers = [];

        var viaLayer; 
        if (Prim.StartLayer.LayerID == eTopLayer && Prim.StopLayer.LayerID != eBottomLayer) {
            viaLayer = eTopLayer;
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID != eBottomLayer && Prim.StopLayer.LayerID == eTopLayer) {
            viaLayer = eTopLayer;
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eTopLayer && Prim.StopLayer.LayerID == eTopLayer) {
            viaLayer = eTopLayer;
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eBottomLayer && Prim.StopLayer.LayerID != eTopLayer) {
            viaLayer = eBottomLayer;
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID != eTopLayer && Prim.StopLayer.LayerID == eBottomLayer) {
            viaLayer = eBottomLayer;
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eBottomLayer && Prim.StopLayer.LayerID == eBottomLayer) {
            viaLayer = eBottomLayer;
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eTopLayer && Prim.StopLayer.LayerID == eBottomLayer) {
            viaLayer = eMultiLayer;
            layers.splice(0, 0, "F", "B");
            res["type"] = "th";
            res["size"] = [CoordToMMs(Prim.Size).round(), CoordToMMs(Prim.Size).round()];  
        } 
        else if (Prim.StartLayer.LayerID == eBottomLayer && Prim.StopLayer.LayerID == eTopLayer) {
            viaLayer = eMultiLayer;
            layers.splice(0, 0, "F", "B");
            res["type"] = "th";
            res["size"] = [CoordToMMs(Prim.Size).round(), CoordToMMs(Prim.Size).round()];  
        } else {
            viaLayer = "inner";
        }

        res["layers"] = layers;
        res["pos"] = [CoordToMMs(Prim.x).round(), -CoordToMMs(Prim.y).round()];
        res["angle"] = 0; 
        
        res["shape"] = "circle";

        if (res["type"] == "th") {
            res["drillsize"] = [CoordToMMs(Prim.HoleSize).round(), CoordToMMs(Prim.HoleSize).round()];
            res["drillshape"] = "circle";
        }

        if (config.include.nets) {
            var net = getNetName(Prim);
            if (net) res["net"] = net;
        }
        // Mark the pad as a via so the viewer can hide vias independently of
        // real footprint pads.
        res["via"] = true;
        vias.push(res);

        return vias;
    }

    // 99% done
    function parseFill(Prim) {
        var res = {};

        if (Prim.IsKeepout) {
            return res;
        }
        var angle = Prim.Rotation;
        var corner1 = [CoordToMMs(Prim.X1Location), CoordToMMs(Prim.Y1Location)];
        var corner3 = [CoordToMMs(Prim.X2Location), CoordToMMs(Prim.Y2Location)];
        var width = corner3[0] - corner1[0];
        var height = corner3[1] - corner1[1];
        var pos = [corner1[0] + width / 2, corner1[1] + height / 2];
        var corner2 = [corner1[0], corner3[1]];
        var corner4 = [corner3[0], corner1[1]];
        var tcorner1 = rotatePoint(pos, corner1, angle);
        var tcorner2 = rotatePoint(pos, corner2, angle);
        var tcorner3 = rotatePoint(pos, corner3, angle);
        var tcorner4 = rotatePoint(pos, corner4, angle);

        // res["svgpath"] =  ["M", tcorner1[0], -tcorner1[1], "L", tcorner2[0], -tcorner2[1], "L", tcorner3[0], -tcorner3[1], "L", tcorner4[0], -tcorner4[1], "Z"].join(" ");
        res["svgpath"] =  ["M", tcorner1, "L", tcorner2, "L", tcorner3, "L", tcorner4, "Z"].join(" ");
        res["type"] = "polygon";
        res["layer"] = Prim.Layer;
       
        if (config.include.nets && (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer)) {
            var net = getNetName(Prim);
            if (net) res["net"] = net;
        }

        // if (!Prim.IsFreePrimitive) {
        //     res['free'] = false;
        // }
        return res;
    }

    // 55% done
    function parseRegion(Prim) {
        var res = {};
        var polygons = [];
        var count = Prim.MainContour.Count;
        var holes_svg = [];
        if (Prim.Kind == 0 && !Prim.IsKeepout) {    // Kind "Board Cutout" not done (Tracks on KeepOutLayer can do it).
            for (var i = 1; i <= count; i++) {
                polygons.push([CoordToMMs(Prim.MainContour.x(i)).round(), -CoordToMMs(Prim.MainContour.y(i)).round()].join(" "));
            }      
            
            count = Prim.HoleCount;
            for (var k = 0; k < count; k++) {
                var hole = [];
                for (var i = 1; i <= Prim.Holes(k).Count; i++) {
                    hole.push([CoordToMMs(Prim.Holes(k).x(i)).round(), -CoordToMMs(Prim.Holes(k).y(i)).round()].join(" "));
                }
                holes_svg.push(["M", hole.shift(), "L", hole.join("L"), "Z "].join(""));
            }
        } else {
            return res;
        }

        res["type"] = "polygon";
        res["svgpath"] = ["M", polygons.shift(), "L", polygons.join("L"), "Z "].join("") + holes_svg.join(""); 
        res["layer"] = Prim.Layer;
        if (config.include.nets && (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer)) {
            var net = getNetName(Prim);
            if (net) res["net"] = net;
        }

        return res;
    }

    // 50% done
    function parsePoly(Polygon) {
        var drawings = [];
        // var count = Polygon.PointCount; 
        // for (var i = 0; i <= count; i++) {
        //     if (Polygon.Segments(i).Kind == ePolySegmentArc) {
        //         polygons.push({"x": CoordToMMs(Polygon.Segments(i).cx), "y": CoordToMMs(-Polygon.Segments(i).cy)});
        //     }
        //     else {
        //         polygons.push({"x": CoordToMMs(Polygon.Segments(i).vx), "y": CoordToMMs(-Polygon.Segments(i).vy)});
        //     }           
        // }   
        var hatched_drawings = [];

        var Iter = Polygon.GroupIterator_Create;
        var Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            switch (Prim.ObjectId) {
                case eArcObject:
                    hatched_drawings = hatched_drawings.concat(parseArc(Prim));
                    break;
                case eTrackObject:
                    hatched_drawings.push(parseTrack(Prim));
                    break;
                case eRegionObject:
                    drawings.push(parseRegion(Prim));
                    break;
            }
            Prim = Iter.NextPCBObject;
        }
        try {
            Polygon.GroupIterator_Destroy(Iter);
        } catch (e) {}

        var len = hatched_drawings.length;
        if (len > 1) {
            var hatchedAll2One = {};
            var pathArr = [];
            for (var i = 0; i < len; i++) {
                pathArr.push(hatched_drawings[i].svgpath);
            }
            var trackWidth = 0.2;
            hatchedAll2One["width"] = trackWidth;
            hatchedAll2One["type"] = "polygon"
            hatchedAll2One["svgpath"] = pathArr.join(" ");
            hatchedAll2One["layer"] = hatched_drawings[0].layer;
            if (config.include.nets) {
                // Avoid touching Polygon.Net directly; reuse the net already
                // resolved on the polygon's child primitives instead.
                var net = "";
                for (var q = 0; q < len; q++) {
                    if (hatched_drawings[q] && hatched_drawings[q]["net"]) {
                        net = hatched_drawings[q]["net"];
                        break;
                    }
                }
                if (net) hatchedAll2One["net"] = net;
            }
            drawings.push(hatchedAll2One);
        }
        return drawings;
    }

    // 95% done
    function parseEdges(pcb) {
        var edges = [];
        var default_width = CoordToMMs(MilsToCoord(5)).round();
        var bbox = {};
        bbox["minx"] = CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Left).round();
        bbox["miny"] = -CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Top).round();
        bbox["maxx"] = CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Right).round();
        bbox["maxy"] = -CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Bottom).round();
    
        // boardoutline edges 
        // var k;
        // var count = pcb.board.BoardOutline.PointCount
        // for (var i = 0; i < count; i++) {
        //     k = i + 1;
        //     edges.push({});
        //     if (pcb.board.BoardOutline.Segments(i).Kind == ePolySegmentLine) {
        //         if (k == pcb.board.BoardOutline.PointCount) {
        //             k = 0;
        //         }
        //         edges[i]["start"] = [CoordToMMs(pcb.board.BoardOutline.Segments(i).vx).round(), -CoordToMMs(pcb.board.BoardOutline.Segments(i).vy).round()];
        //         edges[i]["end"] = [CoordToMMs(pcb.board.BoardOutline.Segments(k).vx).round(), -CoordToMMs(pcb.board.BoardOutline.Segments(k).vy).round()];
        //         edges[i]["type"] = "segment";
        //         edges[i]["width"] = default_width;
        //         edges[i]["layer"] = pcb.Layers.OUTLINE_LAYER;
        //     }
        //     else {
        //         edges[i]["start"] = [CoordToMMs(pcb.board.BoardOutline.Segments(i).cx).round(), -CoordToMMs(pcb.board.BoardOutline.Segments(i).cy).round()];
        //         edges[i]["startangle"] = -pcb.board.BoardOutline.Segments(i).Angle2;
        //         edges[i]["endangle"] = -pcb.board.BoardOutline.Segments(i).Angle1;
        //         edges[i]["type"] = "arc";
        //         edges[i]["radius"] = CoordToMMs(pcb.board.BoardOutline.Segments(i).Radius).round();
        //         edges[i]["width"] = default_width;
        //         edges[i]["layer"] = pcb.Layers.OUTLINE_LAYER;
        //     }
        // }

        var Iter, Prim;
        Iter = pcb.board.BoardIterator_Create;
        Iter.AddFilter_ObjectSet(MkSet(eArcObject, eTrackObject));
        Iter.AddFilter_LayerSet(MkSet(pcb.Layers.OUTLINE_LAYER));
        Iter.AddFilter_Method(eProcessAll);
        Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            switch (Prim.ObjectId) {
                case eArcObject:
                    edges.push(parseArc(Prim));
                    break;
                case eTrackObject:
                    edges.push(parseTrack(Prim));
                    break;
            }
            Prim = Iter.NextPCBObject;
        }
        pcb.board.BoardIterator_Destroy(Iter);

        pcb.pcbdata["edges"] = edges;
        pcb.pcbdata["edges_bbox"] = bbox;
    }

    function getMetadata(pcb) {
        var res = {};
        res["title"] = ChangeFileExt(pcb.boardname, "");
        res["revision"] = "";
        res["company"] = "";

        var fso = new ActiveXObject("Scripting.FileSystemObject"); 
        var boardfile = fso.GetFile(pcb.board.FileName);
        var d = new Date(boardfile.DateLastModified);
        
        res["date"] = [d.getFullYear() , d.getMonth() + 1, d.getDate()].join("-") + " " + [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
        return res;
    }

    // 90% done  // use the KiCad's font , not support chinese char.
    function parseText(Prim) {
        var res = {};
        if (Prim.IsHidden) {
            return res;
        }
        else if (Prim.TextKind == eText_BarCode) {
            return res;  //  an API in AD called ConvetToStrokeArray, how to use it?
        }

        var len = Prim.Text.length;
        if (len == 0) {
            return res;
        }

        res["attr"] = [];
        if (Prim.MirrorFlag) {
            res.attr.push("mirrored");
        }
        if (Prim.Italic) {
            res.attr.push("italic");
        }
        if (Prim.Bold) {
            res.attr.push("bold");
        }
        if (Prim.Inverted) {
            res.attr.push("inverted");
        }
        res["type"] = "text";
        res["text"] = String(Prim.Text).replace(/\r/g, "");
        res["angle"] = Prim.Rotation.round();
        res["layer"] = Prim.Layer;

        var bbox = get_bbox(Prim);
        res["pos"] = bbox["center"];
        res["bbox"] = bbox["size"]; // used to keep off-board notes inside the view

        var text_height = 0;
        var text_thickness = 0;
        if (Prim.TextKind == 1) {
            // TrueType text: AD does not expose per-character metrics, so the page
            // estimates the advance width of every character by class. Keep the
            // glyphs unstretched (1 em = height) and let the estimator lay them out.
            text_height = CoordToMMs(Prim.TTFTextHeight * 0.6);
            text_thickness = text_height * 0.1;
            res["ttf"] = 1;
        } else {
            text_height = CoordToMMs(Prim.Size);
            text_thickness = CoordToMMs(Prim.Width);
        }

        // Multi-line notes (text frames) report a zero TTF height, and some objects
        // report a zero stroke size as well. Fall back to the selection box so the
        // text stays visible instead of being exported with a zero size.
        if (!(text_height > 0)) {
            // Text frames report 0 for TTFTextHeight; AD's Size is the line box,
            // which renders taller than the visible glyph height.
            text_height = CoordToMMs(Prim.Size) * 0.6;
        }
        if (!(text_height > 0)) {
            var n_lines = String(Prim.Text).split("\n").length;
            text_height = CoordToMMs(Prim.BoundingRectangleForSelection.Top -
                Prim.BoundingRectangleForSelection.Bottom) / (1.5 * n_lines - 0.1);
        }
        if (!(text_height > 0)) {
            text_height = 1;
        }
        if (!(text_thickness > 0)) {
            text_thickness = text_height * 0.1;
        }

        res["height"] = text_height.round();
        res["thickness"] = text_thickness.round();
        res["width"] = res["height"]; // single char's width in kicad

        // res["horiz_justify"] = 0; // center align, tag 2.3
        res["justify"] = [0, 0];  //

        if (Prim.IsDesignator) {
            res["ref"] = 1;
        }
        if (Prim.IsComment) {
            res["val"] = 1;
        }

        return res;
    }


    // 91% done
    function parseComponent(Component) {
        var res = {};
        var oFootprint = {};
        var oComponent = {};
        var pads = [];

        function pushDrawing(layer, drawing) {
            if (drawing instanceof Array) {
                for (var di = 0; di < drawing.length; di++) {
                    oFootprint["drawings"].push({"layer": layer, "drawing": drawing[di]});
                }
            } else {
                oFootprint["drawings"].push({"layer": layer, "drawing": drawing});
            }
        }

        var Iter, Prim;
        var isSMD = true;
        Iter = Component.GroupIterator_Create;
        Iter.AddFilter_ObjectSet(MkSet(ePadObject));
        Iter.AddFilter_LayerSet(AllLayers);
        Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            pads = pads.concat(parsePad(Prim));
            if (isSMD && Prim.Layer == eMultiLayer) {
                isSMD = false;
            }
            Prim = Iter.NextPCBObject;
        }
        Component.GroupIterator_Destroy(Iter);

        oFootprint["drawings"] = [];
        Iter = Component.GroupIterator_Create;
        Iter.AddFilter_ObjectSet(MkSet(eTrackObject, eArcObject, eFillobject, eRegionObject));
        Iter.AddFilter_LayerSet(MkSet(eTopLayer, eBottomLayer));
        Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            if (Prim.Layer == eTopLayer) {
                switch (Prim.ObjectId) {
                    case eTrackObject:
                        pushDrawing("F", parseTrack(Prim));
                        break;
                    case eArcObject:
                        pushDrawing("F", parseArc(Prim));
                        break;
                    case eFillobject:
                        pushDrawing("F", parseFill(Prim));
                        break;
                    case eRegionObject:
                        pushDrawing("F", parseRegion(Prim));
                        break;
                    default:
                }
            } 
            else if (Prim.Layer == eBottomLayer) {
                switch (Prim.ObjectId) {
                    case eTrackObject:
                        pushDrawing("B", parseTrack(Prim));
                        break;
                    case eArcObject:
                        pushDrawing("B", parseArc(Prim));
                        break;
                    case eFillobject:
                        pushDrawing("B", parseFill(Prim));
                        break;
                    case eRegionObject:
                        pushDrawing("B", parseRegion(Prim));
                        break;
                    default:
                }
            }
            Prim = Iter.NextPCBObject;
        }
        Component.GroupIterator_Destroy(Iter);

        var bbox = get_bbox(Component);
        oFootprint["center"] = bbox.center;
        delete bbox.center;
        oFootprint["bbox"] = bbox;
        oFootprint["pads"] = pads;
        oFootprint["ref"] = Component.Name.Text;
        if (Component.Layer == eTopLayer) {
            oFootprint["layer"] = "F";
        }
        else {
            oFootprint["layer"] = "B";
        }

        res["footprint"] = oFootprint;

        oComponent["ref"] = oFootprint.ref;
        oComponent["val"] = Component.Comment.Text;
        oComponent["footprint"] = Component.Pattern;
        oComponent["layer"] = oFootprint["layer"];
        oComponent["attr"] = null;

        res["angle"] = Component.Rotation.round();
        res["itemkey"] = ["k", oComponent["ref"].slice(0, 1), oComponent["footprint"], oComponent["val"]].join("");
        
        if (isSMD) {
            res["soldertype"] = "smd";
        }
        else {
            res["soldertype"] = "th";
        }

        res["component"] = oComponent;

        return res;
    }

    // fallback module for a component that failed to parse
    function parseFailedComponent(Component, err) {
        var ref = "";
        var val = "";
        var pattern = "";
        var layer = "F";

        try { ref = String(Component.Name.Text); } catch (e1) { ref = ""; }
        try { val = String(Component.Comment.Text); } catch (e2) { val = ""; }
        try { pattern = String(Component.Pattern); } catch (e3) { pattern = ""; }
        try { layer = (Component.Layer == eTopLayer) ? "F" : "B"; } catch (e4) { layer = "F"; }
        if (ref == "" || ref == "undefined") {
            ref = "[" + layer + "]?";
        }

        var res = {};
        res["footprint"] = {
            "drawings": [],
            "pads": [],
            "center": [0, 0],
            "bbox": {"pos": [0, 0], "relpos": [0, 0], "size": [0, 0], "angle": 0},
            "ref": ref,
            "layer": layer
        };
        res["angle"] = 0;
        res["soldertype"] = "smd";
        res["component"] = {"ref": ref, "val": val, "footprint": pattern, "layer": layer, "attr": null};
        res["itemkey"] = ["k", ref.slice(0, 1), pattern, val].join("");
        res["failed"] = true;
        res["error"] = String(err);
        return res;
    }

    //======
    function parseDrawingsOnLayers(drawings, f_layer, b_layer) {
        var front = [];
        var back = [];
        for (var i = drawings.length - 1; i >= 0; i--) {
            if (drawings[i].layer == f_layer) {
                front.push(drawings[i]);
            }
            else if (drawings[i].layer == b_layer) {
                back.push(drawings[i]);
            }
        }
        return {"F": front, "B": back};
    }

    // parse_board
    if (PCBServer == null) {
        showmessage("Please open a PCB document");
        return false;
    }
    PCBServer.PreProcess;
    var board = PCBServer.GetCurrentPCBBoard();
    if (board == null) {
        PCBServer.PostProcess;
        showmessage("ERROR:Current document is not a PCB document");
        return false;
    }
    pcb["board"] = board;
    pcb["boardpath"] = ExtractFilePath(board.FileName);
    pcb["boardname"] = ExtractFileName(board.FileName);

    pcb.pcbdata["metadata"] = getMetadata(pcb);

    parseEdges(pcb);

    pcb.pos.push(CoordToMMs(board.XOrigin).round());
    pcb.pos.push(CoordToMMs(board.YOrigin).round());

    var Iter, Prim; 
    Iter = pcb.board.BoardIterator_Create;
    Iter.AddFilter_ObjectSet(MkSet(eComponentObject));
    Iter.AddFilter_LayerSet(AllLayers);
    Iter.AddFilter_Method(eProcessAll);
    Prim = Iter.FirstPCBObject;
    while (Prim != null) {
        try {
            pcb.modules.push(parseComponent(Prim));
        } catch (err) {
            pcb.modules.push(parseFailedComponent(Prim, err));
        }
        Prim = Iter.NextPCBObject;
    }
    pcb.board.BoardIterator_Destroy(Iter);

    // parse freepads , all free pads mounted to a footprintNoBom to be rendered
    var footprintNoBom = {};
    footprintNoBom["bbox"] = {"pos": [0, 0], "relpos": [0, 0], "size": [0, 0], "angle": 0};
    footprintNoBom["center"] = [0, 0];
    footprintNoBom["ref"] = "";
    footprintNoBom["layer"] = "F";
    footprintNoBom["drawings"] = [];
    footprintNoBom["pads"] = [];

    Iter = pcb.board.BoardIterator_Create; 
    Iter.AddFilter_ObjectSet(MkSet(ePadObject, eViaObject));
    Iter.AddFilter_LayerSet(AllLayers);
    Iter.AddFilter_Method(eProcessAll);
    Prim = Iter.FirstPCBObject;
    while (Prim != null) {
        if (Prim.IsFreePrimitive) {
            switch (Prim.ObjectId) {
                case ePadObject:
                    footprintNoBom.pads = footprintNoBom.pads.concat(parsePad(Prim));
                    break;
                case eViaObject:
                    if (config.include.vias) {
                        footprintNoBom.pads = footprintNoBom.pads.concat(parseVia(Prim));
                    }
                    break;
                default:
            }
        }
        Prim = Iter.NextPCBObject;
    }
    pcb.board.BoardIterator_Destroy(Iter);

    pcb.modules = sortModules(pcb.modules);

    var kk = pcb.modules.length;
    pcb.pcbdata["footprints"] = [];
    for (var n = 0; n < kk; n++) {
        pcb.pcbdata["footprints"].push(pcb.modules[n].footprint);
    }
    pcb.pcbdata.footprints.push(footprintNoBom);

    // parse_drawings
    var drawings = [];
    Iter = pcb.board.BoardIterator_Create;
    Iter.AddFilter_ObjectSet(MkSet(eTextObject, eTrackObject, eArcObject, eFillobject, eRegionObject));
    Iter.AddFilter_LayerSet(MkSet(pcb.Layers.TOP_OVERLAY_LAYER, pcb.Layers.BOT_OVERLAY_LAYER));
    Iter.AddFilter_Method(eProcessAll);
    Prim = Iter.FirstPCBObject;
    while (Prim != null) {
        switch (Prim.ObjectId) {
            case eTextObject:
                pcb.texts.push(parseText(Prim));
                break;
            case eTrackObject:
                pcb.tracks.push(parseTrack(Prim));
                break;
            case eArcObject:
                pcb.arcs = pcb.arcs.concat(parseArc(Prim));
                break;
            case eFillobject:
                pcb.fills.push(parseFill(Prim));
                break;
            case eRegionObject:
                pcb.regions.push(parseRegion(Prim));
                break;                  
            default:
        }
        Prim = Iter.NextPCBObject;
    }
    pcb.board.BoardIterator_Destroy(Iter);

    drawings = drawings.concat(pcb.texts, pcb.tracks, pcb.arcs, pcb.fills, pcb.regions);
    pcb.pcbdata["drawings"] = {
        "silkscreen": parseDrawingsOnLayers(drawings, pcb.Layers.TOP_OVERLAY_LAYER, pcb.Layers.BOT_OVERLAY_LAYER),
        "fabrication": {
            "F": [],
            "B": []
        }
    };
    
    // rough handling tracks and zones, not done
    var wantTracks = config.include.tracks;
    var wantPolys = config.include.polys;
    var wantHatched = config.include.polyHatched;

    var draws = {};
    draws["tracks"] = [];
    draws["polygons"] = [];
    draws["arcs"] = [];

    if (wantTracks || wantPolys || wantHatched) {
        Iter = pcb.board.BoardIterator_Create;

        if (wantTracks && wantPolys) {
            Iter.AddFilter_ObjectSet(MkSet(FILL_OBJ, eRegionObject, ePolyObject, eArcObject, eTrackObject));
        } else if (wantTracks) {
            Iter.AddFilter_ObjectSet(MkSet(eTrackObject, eArcObject));
        } else if (wantPolys) {
            Iter.AddFilter_ObjectSet(MkSet(FILL_OBJ, eRegionObject, ePolyObject));
        } else {
            Iter.AddFilter_ObjectSet(MkSet(ePolyObject));
        }

        Iter.AddFilter_LayerSet(MkSet(eTopLayer, eBottomLayer));
        Iter.AddFilter_Method(eProcessAll);
        Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            try {
                if (!(Prim.InComponent || Prim.InPolygon)) {
                    switch (Prim.ObjectId) {
                        case eTrackObject:
                            draws.tracks.push(parseTrack(Prim));
                            break;
                        case eArcObject:
                            if (Prim.IsFreePrimitive) {
                                draws.tracks = draws.tracks.concat(parseArc(Prim));
                            } else {
                                // draws.arcs.push(parseArc(Prim));
                            }
                            break;
                        case FILL_OBJ:
                            if (!wantPolys) break;
                            draws.polygons.push(parseFill(Prim));
                            break;
                        case eRegionObject:
                            if (!wantPolys) break;
                            draws.polygons.push(parseRegion(Prim));
                            break;
                        case ePolyObject:
                            if (Prim.PolyHatchStyle == ePolySolid) {
                                if (!wantPolys) break;
                            } else {
                                if (!wantHatched) break;
                            }
                            draws.polygons = draws.polygons.concat(parsePoly(Prim));
                            break;
                        default:
                    }
                }
            } catch (err) {
                // Skip primitives that cannot be parsed instead of failing the
                // whole export.
            }
            Prim = Iter.NextPCBObject;
        }
        pcb.board.BoardIterator_Destroy(Iter);

        pcb.pcbdata["tracks"] = parseDrawingsOnLayers(draws.tracks, eTopLayer, eBottomLayer);
        pcb.pcbdata["zones"] = parseDrawingsOnLayers(draws.polygons, eTopLayer, eBottomLayer);
    }

    // Collect the net names referenced by the exported geometry so that the
    // viewer can highlight a whole net on click and offer the netlist table.
    if (config.include.nets) {
        var netSeen = {};
        var netList = [];
        var collectNet = function collectNet(item) {
            if (item == null) return;
            var n = item["net"];
            if (n == null || n == "") return;
            if (netSeen[n]) return;
            netSeen[n] = true;
            netList.push(n);
        };
        var layerKeys = ["F", "B"];
        var k, i, j, arr;
        for (k = 0; k < layerKeys.length; k++) {
            arr = pcb.pcbdata["tracks"] ? pcb.pcbdata["tracks"][layerKeys[k]] : null;
            if (arr) for (i = 0; i < arr.length; i++) collectNet(arr[i]);
            arr = pcb.pcbdata["zones"] ? pcb.pcbdata["zones"][layerKeys[k]] : null;
            if (arr) for (i = 0; i < arr.length; i++) collectNet(arr[i]);
        }
        for (i = 0; i < pcb.pcbdata["footprints"].length; i++) {
            var fpPads = pcb.pcbdata["footprints"][i]["pads"];
            if (!fpPads) continue;
            for (j = 0; j < fpPads.length; j++) collectNet(fpPads[j]);
        }
        netList.sort();
        if (netList.length > 0) pcb.pcbdata["nets"] = netList;
    }

    var str_text = [];
    for (var i = pcb.texts.length - 1; i >= 0; i--) {
        str_text.push(pcb.texts[i].text);
    }
    pcb.pcbdata.font_data = parseTextToNewStrokeFont(str_text.join(""));

    PCBServer.PostProcess;

    return pcb;
} 
// var t0 = new Date().getTime();
// var pcb = parsePcb();
