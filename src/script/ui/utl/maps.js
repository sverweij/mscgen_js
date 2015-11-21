
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */
/* jshint node:true */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    return {
        /**
         * Given a filename in pString, returns what language is probably
         * contained in that file, judging from the extension (the last dot
         * in the string to end-of-string)
         *
         * When in doubt returns "mscgen"
         *
         * @param {string} pString
         * @return  {string} - language. Possible values: "mscgen", "msgenny", "json".
         */
        classifyExtension : function(pString) {
            var lExtMap = {
                "msgenny" : "msgenny",
                "mscgen" : "mscgen",
                "msc" : "mscgen",
                "mscin" : "mscgen",
                "xu" : "xu",
                "json" : "json",
                "ast" : "json"
            };
            if (!pString) {
                return "mscgen";
            }

            var lPos = pString.lastIndexOf(".");
            if (lPos > -1) {
                var lExt = pString.slice(lPos + 1);
                if (lExtMap[lExt]) {
                    return lExtMap[lExt];
                }
            }

            return "mscgen";
        },
        /**
         * Given a language in pLanguage, returns the codemirror mode to use
         *
         * When not known returns pLanguage
         *
         * @param {string} pLangauge
         * @return  {string} - language. Possible values: "xu", "application/json"
         *     or the input string
         */
        language2Mode: function(pLanguage){
            var lLang2Mode = {
                "mscgen"  : "text/x-xu",
                "xu"      : "text/x-xu",
                "msgenny" : "text/x-msgenny",
                "json"    : "application/json"
            };

            if (lLang2Mode[pLanguage]){
                return lLang2Mode[pLanguage];
            }

            return pLanguage;
        },
        correctLanguage: function (pExtendedFeatures, pLanguage){
            if (true === pExtendedFeatures && pLanguage === "mscgen"){
                return "xu";
            }
            if (false === pExtendedFeatures && pLanguage === "xu"){
                return "mscgen";
            }
            return pLanguage;
        }
    };
}); // define
/*
 This file is part of mscgen_js.

 mscgen_js is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 mscgen_js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
