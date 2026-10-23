var CURRENT_PATH = "C:\\Users\\14117\\OneDrive\\文件夹 集\\AD元件库\\脚本\\AD脚本-交互式BOM\\InteractiveHtmlBomForAD-master(V2.12.0)\\";

//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });

//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.


// source link : https://github.com/douglascrockford/JSON-js

// slightly modified to be compatible with AD.  

function initJSON(non) {
    //"use strict";

    var JSON = {};
    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10)
            ? "0" + n
            : n;
    }

    function this_value(non) {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function anonymFun2JSON(non) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function anonymFun(a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value
            && typeof value === "object"
            && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return (isFinite(value))
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? "[\n"
                            + gap
                            + partial.join(",\n" + gap)
                            + "\n"
                            + mind
                            + "]"
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function anonymFunStringify(value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function"
                && (typeof replacer !== "object"
                || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function anonymFunParse(text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function anonymFun2(a) {
                    return "\\u"
                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (rx_one.test(
                text
                    .replace(rx_two, "@")
                    .replace(rx_three, "]")
                    .replace(rx_four, ""))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
    return JSON;
};

var JSON = initJSON();
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
// 
// 
// source link : https://github.com/pieroxy/lz-string
// slightly modified to be compatible with AD.  

function LZString(non) {
// private property
  var f = String.fromCharCode;
  var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 

  function compressToBase64(input) {
    if (input == null) return "";
    var res = _compress(input, 6, function anonymFun(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  }

  function _compress (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii; 

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      } 

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          } 
  

        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    } 

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        } 
  

      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    } 

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    } 

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  } 

  var LZString = {
    "compressToBase64" : compressToBase64
  };
    return LZString;
  }

var LZStr = LZString();

// if (typeof define === 'function' && define.amd) {
//   define(function () { return LZString; });
// } else if( typeof module !== 'undefined' && module != null ) {
//   module.exports = LZString
// } else if( typeof angular !== 'undefined' && angular != null ) {
//   angular.module('LZString', [])
//   .factory('LZString', function () {
//     return LZString;
//   });
// }

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

/// export
///
function exportJSON() {  // export json of pcb without attr "bom" & "ibom_version"
    var res = {};
    var config = getConfig();
    var pcb = parsePcb(config);
    if (!pcb) {
        return;
    };

    res["components"] = [];
    var kk = pcb.modules.length;
    for (var n = 0; n < kk; n++) {
        res["components"].push(pcb.modules[n].component);
    }

    res["pcbdata"] = pcb.pcbdata;
    // res["pcbdata"]["modules"] = res["pcbdata"]["footprints"]; 
    // delete res["pcbdata"].footprints;
    res["source"] = "AD10";
    var s = JSON.stringify(res);
    var filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".json";
    save2file(s, filename, true);

    try {
        var commandline = "explorer.exe " + ExtractFilePath(filename);
        var errcode = RunApplication(commandline);
    }
    catch(e) {
        showmessage(e.message);
    };
}


function exportBOM() {
    var config = getConfig();
    var pcb = parsePcb(config);
    if (!pcb) {
        return;
    };
    var modules = pcb.modules;
    var count = modules.length ;
    var rows = {};
    var rowsDNP = {};
    for (var i = 0; i < count; i++) {
        if (skipComponent(modules[i], config)) {
            if (modules[i]["footprint"].pads.length <= 1) {
                continue;
            }

            if (!Object.prototype.hasOwnProperty.call(rowsDNP, modules[i].itemkey)) {
                rowsDNP[modules[i].itemkey] = [modules[i]["component"].val, modules[i].soldertype, modules[i]["component"].footprint, " ", 1, " ", [modules[i]["component"].ref], " ", [], []];
            } else {
                rowsDNP[modules[i].itemkey][4]++;
                rowsDNP[modules[i].itemkey][6].push(modules[i]["component"].ref);
            }

            if (modules[i]["component"].layer == "F") {
                rowsDNP[modules[i].itemkey][8].push(modules[i]["component"].ref);
            } else {
                rowsDNP[modules[i].itemkey][9].push(modules[i]["component"].ref);
            }           
            continue;
        }

        if (!Object.prototype.hasOwnProperty.call(rows, modules[i].itemkey)) {
            rows[modules[i].itemkey] = [modules[i]["component"].val, modules[i].soldertype, modules[i]["component"].footprint, " ", 1, " ", [modules[i]["component"].ref], " ", [], []];
        } else {
            rows[modules[i].itemkey][4]++;
            rows[modules[i].itemkey][6].push(modules[i]["component"].ref);
        }

        if (modules[i]["component"].layer == "F") {
            rows[modules[i].itemkey][8].push(modules[i]["component"].ref);
        } else {
            rows[modules[i].itemkey][9].push(modules[i]["component"].ref);
        }
    }    

    var res = [];
    var filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".txt";
    res.push(["Comment", "Soldertype", "Footprint", " ", "Quantity", " ", "Designator", " ", "TopLayer", "BtmLayer"].join("\t"));
    for (var i in rows) {
        rows[i][6]= rows[i][6].join(",");
        rows[i][8]= rows[i][8].join(",");
        rows[i][9]= rows[i][9].join(",");
        res.push(rows[i].join("\t"));
    }

    for (var i in rowsDNP) {
        rowsDNP[i][6]= rowsDNP[i][6].join(",");
        rowsDNP[i][8]= rowsDNP[i][8].join(",");
        rowsDNP[i][9]= rowsDNP[i][9].join(",");
        res.push(rowsDNP[i].join("\t"));
    }

    save2file(res.join("\n"), filename, false);

    var commandline = "notepad.exe " + filename;
    var errcode = RunApplication(commandline);
}

function exportPnP() {
    var config = getConfig();
    var pcb = parsePcb(config);
    if (!pcb) {
        return;
    };
    var modules = pcb.modules;
    var count = modules.length; 
    var rowsF = {};
    var rowsB = {};
    var rowsDNP = {};
    for (var i = 0; i < count; i++) {
        if (skipComponent(modules[i]), config) {
            if (modules[i]["footprint"].pads.length <= 1) {
                continue;
            }

            if (!Object.prototype.hasOwnProperty.call(rowsDNP, modules[i].itemkey)) {
                rowsDNP[modules[i].itemkey] = [i];
            } else {
                rowsDNP[modules[i].itemkey].push(i);
            }     
            continue;
        }

        if (modules[i]["component"].layer == "F") {
            if (!Object.prototype.hasOwnProperty.call(rowsF, modules[i].itemkey)) {
                rowsF[modules[i].itemkey] = [i];
            } else {
                rowsF[modules[i].itemkey].push(i);
            }
        } else {
            if (!Object.prototype.hasOwnProperty.call(rowsB, modules[i].itemkey)) {
                rowsB[modules[i].itemkey] = [i];
            } else {
                rowsB[modules[i].itemkey].push(i);
            }
        }
    }    

    var res = [];
    // res.push(["Designator", "Footprint", "Mid X", "Mid Y", "Ref X", "Ref Y", "Pad X", "Pad Y", "Layer", "Rotation", "Comment"].join(","));
    res.push(["Designator", "Footprint", "Mid X", "Mid Y", "Layer", "Rotation", "Comment"].join(","));
    for (var i in rowsF) {
        var lenF = rowsF[i].length;
        for (var k = 0; k < lenF; k++) {
            res.push([modules[rowsF[i][k]]["component"].ref, modules[rowsF[i][k]]["component"].footprint, [(modules[rowsF[i][k]]["footprint"].center[0] - pcb.pos[0]).toFixed(2), "mm"].join("") , [(-modules[rowsF[i][k]]["footprint"].center[1] - pcb.pos[1]).toFixed(2), "mm"].join(""), "T", modules[rowsF[i][k]].angle, modules[rowsF[i][k]]["component"].val].join(","));
        }
    }

    for (var i in rowsB) {
        var lenB = rowsB[i].length;
        for (var k = 0; k < lenB; k++) {
            res.push([modules[rowsB[i][k]]["component"].ref, modules[rowsB[i][k]]["component"].footprint, [(modules[rowsB[i][k]]["footprint"].center[0] - pcb.pos[0]).toFixed(2), "mm"].join("") , [(-modules[rowsB[i][k]]["footprint"].center[1] - pcb.pos[1]).toFixed(2), "mm"].join(""), "B", modules[rowsB[i][k]].angle, modules[rowsB[i][k]]["component"].val].join(","));
        }
    }

    for (var i in rowsDNP) {
        var lenD = rowsDNP[i].length;
        for (var k = 0; k < lenD; k++) {
            res.push([modules[rowsDNP[i][k]]["component"].ref, modules[rowsDNP[i][k]]["component"].footprint, [(modules[rowsDNP[i][k]]["footprint"].center[0] - pcb.pos[0]).toFixed(2), "mm"].join("") , [(-modules[rowsDNP[i][k]]["footprint"].center[1] - pcb.pos[1]).toFixed(2), "mm"].join(""), modules[rowsDNP[i][k]]["component"].layer, modules[rowsDNP[i][k]].angle, modules[rowsDNP[i][k]]["component"].val].join(","));
        }
    }

    var filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".csv";
    save2file(res.join("\n"), filename, false);

    try {
        var commandline = "explorer.exe " + ExtractFilePath(filename);
        var errcode = RunApplication(commandline);
    }
    catch(e) {
        showmessage(e.message);
    };
}
