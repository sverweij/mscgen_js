/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    return {
        baseTemplate : "svg.<%=id%>{font-family:Helvetica,sans-serif;font-size:<%=fontSize%>px;font-weight:normal;font-style:normal;text-decoration:none;background-color:white;stroke:black;stroke-width:<%=lineWidth%>;color:black}.<%=id%> path, .<%=id%> rect{fill:none;color:black;stroke:black}.<%=id%> .label-text-background{fill:white;stroke:white;stroke-width:0}.<%=id%> .bglayer{fill:white;stroke:white;stroke-width:0}.<%=id%> line{stroke:black}.<%=id%> .return, .<%=id%> .comment{stroke-dasharray:5,3}.<%=id%> .inline_expression_divider{stroke-dasharray:10,5}.<%=id%> text{color:inherit;stroke:none;text-anchor:middle}.<%=id%> text.entity-text{text-decoration:underline}.<%=id%> text.anchor-start{text-anchor:start}.<%=id%> .arrow-marker{overflow:visible}.<%=id%> .arrow-style{stroke-width:1}.<%=id%> .arcrow, .<%=id%> .arcrowomit, .<%=id%> .emphasised{stroke-linecap:butt}.<%=id%> .arcrowomit{stroke-dasharray:2,2;}.<%=id%> .box, .<%=id%> .entity{fill:white;stroke-linejoin:round}.<%=id%> .inherit{stroke:inherit;color:inherit}.<%=id%> .inherit-fill{fill:inherit}.<%=id%> .watermark{stroke:black;color:black;fill:black;font-size:48pt;font-weight:bold;opacity:0.14}",
        namedStyles : [
    {
        "name": "basic",
        "description": "Basic",
        "experimental": false,
        "renderMagic": "straight",
        "cssBefore": "",
        "cssAfter": ""
    },
    {
        "name": "lazy",
        "description": "Lazy",
        "experimental": false,
        "renderMagic": "straight",
        "cssBefore": "",
        "cssAfter": ".<%=id%> text.entity-text{font-weight:bold;text-decoration:none;}.<%=id%> text.return-text{font-style:italic}.<%=id%> path.note{fill:#FFFFCC}.<%=id%> rect.label-text-background{opacity:0.9}.<%=id%> line.comment,.<%=id%> rect.inline_expression,.<%=id%> .inline_expression_divider,.<%=id%> .inline_expression_label{stroke:grey}"
    },
    {
        "name": "classic",
        "description": "Classic",
        "experimental": false,
        "renderMagic": "straight",
        "cssBefore": "",
        "cssAfter": ".<%=id%> text.entity-text{text-decoration:none}.<%=id%> .entity{stroke:none;}.<%=id%> line,.<%=id%> rect,.<%=id%> path{stroke-width:1px}.<%=id%> .arrow-style{stroke-width:2;}.<%=id%> .inline_expression,.<%=id%> .inline_expression_divider,.<%=id%> .inline_expression_label{stroke-width: 1px}"
    },
    {
        "name": "fountainpen",
        "description": "Fountain pen",
        "experimental": false,
        "renderMagic": "wobbly",
        "cssBefore": "@import 'https://fonts.googleapis.com/css?family=Gochi+Hand';",
        "cssAfter": "svg.<%=id%>{font-family:'Gochi Hand', cursive;font-size:14px;stroke-opacity:0.4;stroke-linecap:round;background-color:transparent}.<%=id%> text{fill:rgba(0,0,128,0.7)}.<%=id%> marker polygon{fill:rgba(0,0,255,0.4);stroke-linejoin:round}.<%=id%> line, .<%=id%> path, .<%=id%> rect, .<%=id%> polygon{stroke:blue !important}.<%=id%> text.entity-text{font-weight:bold;text-decoration:none}.<%=id%> text.return-text{font-style:italic}.<%=id%> path.note{fill:#FFFFCC;}.<%=id%> .label-text-background{opacity:0}.<%=id%> .comment,.<%=id%> .inline_expression,.<%=id%> .inline_expression_divider,.<%=id%> .inline_expression_label{stroke:black}"
    },
    {
        "name": "cygne",
        "description": "Cygne (best with msgenny)",
        "experimental": false,
        "renderMagic": "straight",
        "cssBefore": "",
        "cssAfter": ".<%=id%> line, .<%=id%> path{stroke:#00A1DE}.<%=id%> text{fill:#005B82}.<%=id%> .entity,.<%=id%> .box{fill:#00A1DE;stroke:#00A1DE}.<%=id%> text.box-text{fill:white}.<%=id%> text.entity-text{font-weight:bold;fill:white;text-decoration:none}.<%=id%> text.return-text{font-style:italic}.<%=id%> path.note{fill:#E77B2F;stroke:white}.<%=id%> .comment,.<%=id%> .inline_expression,.<%=id%> .inline_expression_divider,.<%=id%> .inline_expression_label{fill:white}"
    },
    {
        "name": "pegasse",
        "description": "Pégase (best with msgenny)",
        "experimental": false,
        "renderMagic": "straight",
        "cssBefore": "",
        "cssAfter": ".<%=id%> line, .<%=id%> path{stroke:rgba(0, 43, 84, 1)}.<%=id%> text{fill:rgba(0, 43, 84, 1)}.<%=id%> .entity,.<%=id%> .box{fill:rgba(0, 43, 84, 1);stroke:rgba(0, 43, 84, 1)}.<%=id%> text.box-text{fill:white}.<%=id%> text.entity-text{font-weight:bold;fill:white;text-decoration:none}.<%=id%> text.return-text{font-style:italic}.<%=id%> path.note{fill:rgba(255, 50, 0, 1);stroke:white}.<%=id%> .comment,.<%=id%> .inline_expression,.<%=id%> .inline_expression_divider,.<%=id%> .inline_expression_label{fill:white}"
    },
    {
        "name": "grayscaled",
        "description": "Grayscaled (not in IE or Safari)",
        "experimental": true,
        "renderMagic": "straight",
        "cssBefore": "",
        "cssAfter": "svg.<%=id%>{filter:grayscale(1);-webkit-filter:grayscale(1);}"
    },
    {
        "name": "inverted",
        "description": "Inverted (not in IE or Safari)",
        "experimental": true,
        "renderMagic": "straight",
        "cssBefore": "",
        "cssAfter": "svg.<%=id%>{filter:invert(1);-webkit-filter:invert(1);}"
    }
]
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
