/// newstroke_font.js
/*
 * newstroke_font.cpp - definitions for automatically converted font
 *
 * This program source code file is part of KiCad, a free EDA CAD application.
 *
 * Copyright (C) 2010 vladimir uryvaev <vovanius@bk.ru>
 * Copyright (C) 1992-2010 KiCad Developers, see change_log.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 *
This file is copied from KiCad source tree and
slightly modified to be valid python by qu1ck.
*/
// CJK part of newstroke_font.cpp from KiCad added, file is larger.
//
// The glyph coordinate tables are stored in newstroke_font.dat (same folder as
// this script) and loaded at run time, so that the generated script stays small
// enough for Altium's script parser to enumerate its procedures.

var strokeFontData = null;

function loadStrokeFontData() {
  if (strokeFontData != null) {
    return strokeFontData;
  }
  var arr1 = [];
  var arr2 = [];
  var arr3 = [];
  var arr4 = [];
  var arr5 = [];
  var sections = [arr1, arr2, arr3, arr4, arr5];
  var text = loadfile(CURRENT_PATH + "core\\newstroke_font.dat");
  if (text) {
    var lines = text.split("\n");
    var cur = -1;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.length > 0 && line.charAt(line.length - 1) == "\r") {
        line = line.substring(0, line.length - 1);
      }
      if (line.length == 0) {
        continue;
      }
      if (line.charAt(0) == "#") {
        cur = parseInt(line.substring(1), 10) - 1;
      } else if (cur >= 0 && cur < sections.length) {
        sections[cur].push(line);
      }
    }
  }
  strokeFontData = {
    arr1: arr1,
    arr2: arr2,
    arr3: arr3,
    arr4: arr4,
    arr5: arr5
  };
  return strokeFontData;
}

function parseTextToNewStrokeFont (s) {
  var STROKE_FONT_SCALE = 1/21;
  var FONT_OFFSET = -10;
  var mergeFont = loadStrokeFontData();
  var newStrokeFont;
  function parseFontChar(c) {
    var line = [];
    var lines = [];
    var glyph_x = 0;
    var glyph_width;
    var index = c.charCodeAt(0);
    if (index>31 && index<256) {
      newStrokeFont = mergeFont.arr1;
      index -= 32; 
    } else if (index>255 && index<11264) {
      newStrokeFont = mergeFont.arr2;
      index -= 256;
    } else if (index>12287 && index<19968) {
      newStrokeFont = mergeFont.arr3;
      index -= 12288;
    } else if (index>19967 && index<40960) {
      newStrokeFont = mergeFont.arr4;
      index -= 19968;
    } else if (index>65279 && index<65519) {
      newStrokeFont = mergeFont.arr5;
      index -= 65280;
    } else {
      newStrokeFont = mergeFont.arr1;
      index = "?".charCodeAt(0) - 32;
    }
    var glyph_str = newStrokeFont[index];
    if (!glyph_str) {
      glyph_str = "RR";
    }
    var coord;
    var len = glyph_str.length;
    for (var i = 0; i < len; i += 2) {
      coord = glyph_str.slice(i, i + 2);
      if (i < 2) {
        glyph_x = (coord.charCodeAt(0) - "R".charCodeAt(0)) * STROKE_FONT_SCALE;
        glyph_width = (coord.charCodeAt(1) - coord.charCodeAt(0)) * STROKE_FONT_SCALE;
      } else if (coord.slice(0, 1) == " " && coord.slice(1, 2) == "R") {
        lines.push(line);
        line = [];
      } else {
        var px = (coord.charCodeAt(0) - "R".charCodeAt(0)) * STROKE_FONT_SCALE - glyph_x;
        var py = (coord.charCodeAt(1) - "R".charCodeAt(0) + FONT_OFFSET) * STROKE_FONT_SCALE;
        line.push([px.round(), py.round()]);
      }
    }
    if (line.length > 0) {
      lines.push(line);
    }
    return {
      "w": glyph_width.round(),
      "l": lines
    }
  }
  var res = {};
  var chrArr = s.split("");
  var mk = chrArr.length;
  for (var i = 0; i < mk; i++) {
    if (chrArr[i] == "\t" && !Object.prototype.hasOwnProperty.call(res, chrArr[i])) {
      res[" "] = parseFontChar(" ");
    }
    if (!Object.prototype.hasOwnProperty.call(res, chrArr[i]) && chrArr[i].charCodeAt(0) > 31) {
      res[chrArr[i]] = parseFontChar(chrArr[i]);
    }
  }
  return res;
}
