/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
/* eslint max-params: 0 */
define(function(require){
    var cssTemplates     = require("../render/graphics/csstemplates");

    return Object.freeze({
        inputType: [
            {name: "mscgen",  experimental: false},
            {name: "msgenny", experimental: false},
            {name: "xu",      experimental: false},
            {name: "json",    experimental: false},
            {name: "ast",     experimental: false}
        ],
        outputType: [
            {name: "mscgen",  experimental: false},
            {name: "msgenny", experimental: false},
            {name: "xu",      experimental: false},
            {name: "json",    experimental: false},
            {name: "ast",     experimental: false},
            {name: "dot",     experimental: false},
            {name: "doxygen", experimental: false}
        ],
        regularArcTextVerticalAlignment: [
            {name: "above",   experimental: true},
            {name: "middle",  experimental: false},
            {name: "below",   experimental: true}
        ],
        namedStyle: cssTemplates.namedStyles.map(
            function(pStyle){
                return {
                    name         : pStyle.name,
                    description  : pStyle.description,
                    experimental : pStyle.experimental,
                    deprecated   : pStyle.deprecated
                };
            }
        )
    });
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