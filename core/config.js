
function getConfig(non) {
	var iniFileName = CURRENT_PATH + "config.ini";
	var config = {};
	if (FileExists(iniFileName)) {
		var iniFile = TIniFile.Create(iniFileName);
		config.PcbOutlineMech1 = iniFile.ReadBool("General", "PcbOutlineMech1", false);
		var highlightPin1Str = iniFile.ReadString("HtmlDefaults", "HighlightPin1", "none");
		if (highlightPin1Str == "True" || highlightPin1Str == "true" || highlightPin1Str == "1") highlightPin1Str = "all";
		else if (highlightPin1Str == "False" || highlightPin1Str == "false" || highlightPin1Str == "0") highlightPin1Str = "none";
		var bomView = "left-right";
		if (iniFile.ReadBool("HtmlDefaults", "BomViewOnly", false)) bomView = "bom-only";
		else if (iniFile.ReadBool("HtmlDefaults", "BomViewTopDrawingBottom", false)) bomView = "top-bottom";
		var layerView = "FB";
		if (iniFile.ReadBool("HtmlDefaults", "PcbLayerFrontOnly", false)) layerView = "F";
		else if (iniFile.ReadBool("HtmlDefaults", "PcbLayerBackOnly", false)) layerView = "B";
		config["htmlConfig"] = {
			"redraw_on_drag": iniFile.ReadBool("HtmlDefaults", "ContinuousRedrawOnDrag", true),
			"bom_view": bomView,
			"layer_view": layerView,
			"show_silkscreen": iniFile.ReadBool("HtmlDefaults", "ShowSilkscreen", true),
			"checkboxes": iniFile.ReadString("HtmlDefaults", "HtmlCheckboxes", "Sourced,Placed"),
			"dark_mode": iniFile.ReadBool("HtmlDefaults", "DarkMode", false),
			"highlight_pin1": highlightPin1Str,
			"show_pads": iniFile.ReadBool("HtmlDefaults", "ShowFootprintPads", true),
			"show_fabrication": iniFile.ReadBool("HtmlDefaults", "ShowFabricationLayer", false),
			"extra_fields": [],
			"board_rotation": iniFile.ReadInteger("HtmlDefaults", "PcbRotation", 0),
			"offset_back_rotation": iniFile.ReadBool("HtmlDefaults", "OffsetBackRotation", false),
			"kicad_text_formatting": false,
			"mark_when_checked": "",
			"custom_metadata": ""
		};
		config["htmlConfig"]["fields"] = ["Value", "Footprint"].concat(config["htmlConfig"]["extra_fields"]);
		config["include"] = {
			"vias": iniFile.ReadBool("General", "IncludeVias", false),
			"nets": iniFile.ReadBool("General", "IncludeNets", false),
			"polyHatched": false  // a group of tracks and arcs( arc to tracks), very slow.
		};
		if (iniFile.ReadBool("General", "IncludeTracksAndSolidPolygons", false)) {
			config["include"]["tracks"] = true;
			config["include"]["polys"] = true;
		} else {
			config["include"]["tracks"] = false;
			config["include"]["polys"] = false;
		}

		config["bomFilter"] = {
			"skipempty": iniFile.ReadBool("General", "BlacklistEmpty", true),
			"skiponepad": iniFile.ReadBool("General", "Blacklist1Pad", true),
			"skipth": iniFile.ReadBool("General", "BlacklistTh", false)
		}

		iniFile.Free;
	} else {
		config.PcbOutlineMech1 = false;
		config["htmlConfig"] = {
			"redraw_on_drag": true,
			"bom_view": "left-right",
			"layer_view": "FB",
			"show_silkscreen": true,
			"checkboxes": "Sourced,Placed",
			"dark_mode": false,
			"highlight_pin1": "none",
			"show_pads": true,
			"show_fabrication": false,
			"extra_fields": [],
			"board_rotation": 0,
			"offset_back_rotation": false,
			"kicad_text_formatting": false,
			"mark_when_checked": "",
			"custom_metadata": ""
		};
		config["htmlConfig"]["fields"] = ["Value", "Footprint"].concat(config["htmlConfig"]["extra_fields"]);

		config["include"] = {
			"tracks": false, // not support arc for now, so parse one arc to a few tracks. slow.
			"vias": false,  // so many objects in pcbdata slow down the speed of generating bom.
			"nets": false,
			"polys": false,
			"polyHatched": false  // a group of tracks and arcs( arc to tracks), very slow.
		};

		config["bomFilter"] = {
			"skipempty": true,
			"skiponepad": true,
			"skipth": false
		}
	}
	return config;
}
