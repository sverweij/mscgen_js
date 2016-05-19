/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    function _scaleCanvasToWidth(pWidth, pCanvas) {
        pCanvas.scale = (pWidth / pCanvas.width);
        pCanvas.width *= pCanvas.scale;
        pCanvas.height *= pCanvas.scale;
        pCanvas.horizontaltransform *= pCanvas.scale;
        pCanvas.verticaltransform *= pCanvas.scale;
        pCanvas.x = 0 - pCanvas.horizontaltransform;
        pCanvas.y = 0 - pCanvas.verticaltransform;
    }

    function _determineDepthCorrection(pDepth, pLineWidth){
        return pDepth ? 2 * ((pDepth + 1) * 2 * pLineWidth) : 0;
    }

    function _determineArcXTo(pKind, pFrom, pTo){
        if ("-x" === pKind) {
            return pFrom + (pTo - pFrom) * (3 / 4);
        } else {
            return pTo;
        }
    }

    return {
        scaleCanvasToWidth : _scaleCanvasToWidth,
        determineDepthCorrection : _determineDepthCorrection,
        determineArcXTo: _determineArcXTo
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
