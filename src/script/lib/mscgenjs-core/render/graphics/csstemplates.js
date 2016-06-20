/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    return {
        baseTemplate : "svg.mscgenjs-fence{font-family:Helvetica,sans-serif;font-size:<%=fontSize%>px;font-weight:normal;font-style:normal;text-decoration:none;background-color:white;stroke:black;stroke-width:<%=lineWidth%>;color:black;}.mscgenjs-fence rect{fill:none;stroke:black;}.mscgenjs-fence rect.entity{fill:white;}.mscgenjs-fence rect.label-text-background{fill:white;stroke:white;stroke-width:0;}.mscgenjs-fence rect.bglayer{fill:white;stroke:white;stroke-width:0;}.mscgenjs-fence line{stroke:black;}.mscgenjs-fence line.return{stroke-dasharray:5,2;}.mscgenjs-fence line.comment{stroke-dasharray:5,2;}.mscgenjs-fence line.inline_expression_divider{stroke-dasharray:10,5;}.mscgenjs-fence text{color:inherit;stroke:none;text-anchor:middle;}.mscgenjs-fence text.entity-text{text-decoration:underline;}.mscgenjs-fence text.anchor-start{text-anchor:start;}.mscgenjs-fence path{stroke:black;color:black;fill:none;}.mscgenjs-fence .arrow-marker{overflow:visible;}.mscgenjs-fence .arrow-style{stroke-width:1;}.mscgenjs-fence .arcrowomit{stroke-dasharray:2,2;}.mscgenjs-fence rect.box, .mscgenjs-fence path.box{fill:white;}.mscgenjs-fence .inherit{stroke:inherit;color:inherit;}.mscgenjs-fence .inherit-fill{fill:inherit;}.mscgenjs-fence .watermark{stroke:black;color:black;fill:black;font-size:48pt;font-weight:bold;opacity:0.14;}"
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

