/* jshint nonstandard:true */
/* jshint browser: true */ // for btoa. Alternative: https://github.com/node-browser-compat/btoa/blob/master/index.js
/* jshint node: true */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../render/text/ast2dot",
        "../render/text/ast2mscgen",
        "../render/text/ast2doxygen",
        "../utl/paramslikker",
        ],
        function(ast2dot, ast2mscgen, ast2doxygen, par) {
    "use strict";
    
    var MAX_LOCATION_LENGTH = 4094;// max length of an URL on github (4122) - "https://sverweij.github.io/".length (27) - 1
    var gTemplate = "<!DOCTYPE html>\n<html>\n  <head>\n    <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>\n{{config}}    <script src='https://sverweij.github.io/mscgen_js/mscgen-inpage.js' defer>\n    </script>\n  </head>\n  <body>\n    <pre class='code {{language}} mscgen_js' data-language='{{language}}'>\n{{source}}\n    </pre>\n  </body>\n</html>";
    var gLinkToEditorConfig = "    <script>\n      var mscgen_js_config = {\n        clickable: true\n      }\n    </script>\n";
    
    function toHTMLSnippet (pSource, pLanguage, pWithLinkToEditor){
        return gTemplate.replace(/{{config}}/g, pWithLinkToEditor ? gLinkToEditorConfig : "")
                        .replace(/{{language}}/g, pLanguage)
                        .replace(/{{source}}/g, pSource);
    }

    function getAdditionalParameters(pLocation){
        var lParams = par.getParams(pLocation.search);
        var lAdditionalParameters = "";
        
        if (lParams.donottrack){
            lAdditionalParameters += '&donottrack=' + lParams.donottrack;
        }
        if (lParams.debug){
            lAdditionalParameters += '&debug=' + lParams.debug;
        }
        
        return lAdditionalParameters;
    }
    
    function source2LocationString(pLocation, pSource, pLanguage){
        return pLocation.pathname +
                '?lang=' + pLanguage +
                getAdditionalParameters(pLocation) +
                '&msc=' + encodeURIComponent(pSource);
    }
    
    function sourceIsURLable(pLocation, pSource, pLanguage){
        return source2LocationString(pLocation, pSource, pLanguage).length < MAX_LOCATION_LENGTH;
    }
    
    return {
        toVectorURI: function (pSVGSource, pWindow) {
            pWindow = pWindow ? pWindow : window;
            var lb64 = pWindow.btoa(unescape(encodeURIComponent(pSVGSource)));
            return "data:image/svg+xml;charset=utf-8;base64,"+lb64;
        },
        toHTMLSnippet: toHTMLSnippet,
        toHTMLSnippetURI: function(pSource, pLanguage, pWithLinkToEditor){
            return 'data:text/plain;charset=utf-8,'+encodeURIComponent(toHTMLSnippet(pSource, pLanguage, pWithLinkToEditor));
        },
        todotURI: function(pAST){
            return 'data:text/plain;charset=utf-8,'+encodeURIComponent(ast2dot.render(pAST));
        },
        toVanillaMscGenURI: function(pAST){
            return 'data:text/plain;charset=utf-8,'+encodeURIComponent(ast2mscgen.render(pAST));
        },
        toDoxygenURI: function(pAST){
            return 'data:text/plain;charset=utf-8,'+encodeURIComponent(ast2doxygen.render(pAST));
        },
        toLocationString: function (pLocation, pSource, pLanguage) {
            var lSource = '# source too long for an URL';
            if (sourceIsURLable(pLocation, pSource, pLanguage)) {
                lSource = pSource;
            }
            return source2LocationString(pLocation, lSource, pLanguage); 
        }
    };
});
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
