/* jshint unused:strict */
/* jshint indent:4 */
/* jshint node:true */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../lib/lodash/lodash.custom"], function(_) {
    "use strict";
    return {
        baseTemplate : _.template("svg{font-family:Helvetica,sans-serif;font-size:<%=fontSize%>px;font-weight:normal;font-style:normal;text-decoration:none;background-color:white;stroke:black;color:black;}rect{fill:none;stroke:black;stroke-width:<%=lineWidth%>;}rect.entity{fill:white;}rect.label-text-background{fill:white;stroke:white;stroke-width:0;}rect.bglayer{fill:white;stroke:white;stroke-width:0;}line{stroke:black;stroke-width:<%=lineWidth%>;}line.return{stroke-dasharray:5,2;}line.comment{stroke-dasharray:5,2;}line.inline_expression_divider{stroke-dasharray:10,5;}text{color:inherit;stroke:none;text-anchor:middle;}text.entity-text{text-decoration:underline;}text.anchor-start{text-anchor:start;}text.box-text{}path{stroke:black;color:black;stroke-width:<%=lineWidth%>;fill:none;}.arrow-marker{overflow:visible;}.arrow-style{stroke-width:1;}.arcrowomit{stroke-dasharray:2,2;}rect.box,path.box{fill:white;}.inherit{stroke:inherit;color:inherit;}.inherit-fill{fill:inherit;}.watermark{stroke:black;color:black;fill:black;font-size:48pt;font-weight:bold;opacity:0.14;}")
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

