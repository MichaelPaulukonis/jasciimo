/*
 * asciimo.js
 *
 * Copyright (c) 2010 Marak Squires
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * http://github.com/marak/figlet-js
 * Figlet JS
 *
 * Copyright (c) 2010 Scott González
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://github.com/scottgonzalez/figlet-js
 */


(function() {

  // Remark : not a very good env check
  var fontPath;
  var inBrowser = (typeof exports === "undefined");

  if(typeof __dirname == "undefined"){
    fontPath = "./fonts/";
  }
  else{
    if (inBrowser) {
      fontPath = __dirname.substring(0, __dirname.lastIndexOf("/")) + "/fonts/";
    } else {
      fontPath = __dirname.substring(0, __dirname.lastIndexOf(require("path").sep)) + "/fonts/";
    }
  }

  // var Figlet = (typeof exports !== "undefined" ? exports : window).Figlet = {
  var Figlet = (inBrowser ? window : exports).Figlet = {
    fonts: {},

    parseFont: function(name, fn) { //        debug.log('parseFont', name);
      if (name in Figlet.fonts) {
        fn();
      }
      Figlet.loadFont(name, function(defn) {
        Figlet._parseFont(name, defn, fn);
      });
    },

    _parseFont: function(name, defn, fn) {
      var lines = defn.split("\n"),
          header = lines[0].split(" "),
          hardblank = header[0].charAt(header[0].length - 1),
          height = +header[1],
          comments = +header[5];

      Figlet.fonts[name] = {
        defn: lines.slice(comments + 1),
        hardblank: hardblank,
        height: height,
        char: {}
      };
      fn();
    },

    parseChar: function(char, font) { // debug.log('parseChar');
      var fontDefn = Figlet.fonts[font];
      if (char in fontDefn.char) {
        return fontDefn.char[char];
      }

      var height = fontDefn.height,
          start = (char - 32) * height,
          charDefn = [],
          i;
      for (i = 0; i < height; i++) {
        charDefn[i] = fontDefn.defn[start + i]
          .replace(/@/g, "")
          .replace(RegExp("\\" + fontDefn.hardblank, "g"), " ");
      }

      return fontDefn.char[char] = charDefn;
    },

    write: function(str, font, fn) {
      Figlet.parseFont(font, function() { // debug.log('parseFont');
        var chars = [],
            result = "";
        for (var i = 0, len = str.length; i < len; i++) {
          chars[i] = Figlet.parseChar(str.charCodeAt(i), font);
        }
        for (i = 0, height = chars[0].length; i < height; i++) {
          for (var j = 0; j < len; j++) {
            result += chars[j][i];
          }
          result += "\n";
        }
        fn(result, font);
      });
    },

    loadFont: function(name, fn) {
      if(!inBrowser){
        var sys = require('sys');
        require("fs").readFile(fontPath + name + ".flf", "utf-8", function(err, contents) {
          if (err) {
            sys.puts(err);
          }
          else {
            fn(contents);
          }
        });
      }
      else{
        $.get(fontPath + name+ '.flf',function(contents){
          fn(contents);
        });
      }
    }
  };

})();
