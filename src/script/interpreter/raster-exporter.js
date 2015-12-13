/* jshint nonstandard:true */
/* global canvg, define */

define(["../lib/canvg/canvg",
        "../lib/canvg/StackBlur",
        "../lib/canvg/rgbcolor"
        ],
        function() {
    "use strict";

    return {
        toRasterURI: function (pDocument, pSVGSource, pType){
            var lCanvas = pDocument.createElement('canvas');
            lCanvas.setAttribute('style', 'display:none');
            pDocument.body.appendChild(lCanvas);
            canvg(lCanvas, pSVGSource);
            var lRetval = lCanvas.toDataURL(pType, 0.8);
            pDocument.body.removeChild(lCanvas);
            return lRetval;
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
