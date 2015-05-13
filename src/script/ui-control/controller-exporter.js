/* jshint nonstandard:true */
/* jshint browser: true */ // for btoa. Alternative: https://github.com/node-browser-compat/btoa/blob/master/index.js
/* jshint node: true */
/* global canvg */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../render/text/ast2dot",
        "../render/text/ast2mscgen",
        "../utl/paramslikker",
        "../../lib/canvg/canvg",
        "../../lib/canvg/StackBlur",
        "../../lib/canvg/rgbcolor"
        ],
        function(ast2dot, ast2mscgen, par) {
    "use strict";

    function toHTMLSnippet (pSource, pLanguage){
        return "<!DOCTYPE html>\n<html>\n  <head>\n    <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>\n    <script src='https://sverweij.github.io/mscgen_js/mscgen-inpage.js' defer>\n    </script>\n  </head>\n  <body>\n    <pre class='code " + pLanguage + " mscgen_js' data-language='" + pLanguage +"'>\n" + pSource + "\n    </pre>\n  </body>\n</html>";
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

    return {
        toVectorURI: function (pSVGSource) {
            var lb64 = btoa(unescape(encodeURIComponent(pSVGSource)));
            return "data:image/svg+xml;base64,"+lb64;
        },
        toRasterURI: function (pDocument, pSVGSource, pType){
            var lCanvas = pDocument.createElement('canvas');
            lCanvas.setAttribute('style', 'display:none');
            pDocument.body.appendChild(lCanvas);
            canvg(lCanvas, pSVGSource);
            var lRetval = lCanvas.toDataURL(pType, 0.8);
            pDocument.body.removeChild(lCanvas);
            return lRetval;
        },
        toHTMLSnippet: toHTMLSnippet,
        toHTMLSnippetURI: function(pSource, pLanguage){
            return 'data:text/plain;charset=utf-8,'+encodeURIComponent(toHTMLSnippet(pSource, pLanguage));
        },
        todotURI: function(pAST){
            return 'data:text/plain;charset=utf-8,'+encodeURIComponent(ast2dot.render(pAST));
        },
        toVanillaMscGenURI: function(pAST){
            return 'data:text/plain;charset=utf-8,'+encodeURIComponent(ast2mscgen.render(pAST));
        },
        toDebugURI: function(pLocation, pSource, pLanguage){
            return 'data:text/plain;charset=utf-8,'+
                encodeURIComponent(
                    pLocation.protocol + '//' +
                    pLocation.host +
                    pLocation.pathname +
                    '?lang=' + pLanguage +
                    getAdditionalParameters(pLocation) +
                    '&msc=' + encodeURIComponent(pSource)
                );
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
