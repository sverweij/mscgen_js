/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){
    "use strict";

    var renderlabels = require("./renderlabels");

    var DEFAULT_INTER_ENTITY_SPACING = 160; // px
    var DEFAULT_ENTITY_WIDTH         = 100; // px
    var DEFAULT_ENTITY_HEIGHT        = 34; // px

    var gEntityDims = Object.seal({
        interEntitySpacing : DEFAULT_INTER_ENTITY_SPACING,
        height             : DEFAULT_ENTITY_HEIGHT,
        width              : DEFAULT_ENTITY_WIDTH
    });

    var gEntity2X = {};

    function getX (pName){
        return gEntity2X[pName];
    }

    return {
        init: function (pHScale){
            gEntityDims.interEntitySpacing = DEFAULT_INTER_ENTITY_SPACING;
            gEntityDims.height             = DEFAULT_ENTITY_HEIGHT;
            gEntityDims.width              = DEFAULT_ENTITY_WIDTH;

            if (pHScale) {
                gEntityDims.interEntitySpacing = pHScale * DEFAULT_INTER_ENTITY_SPACING;
                gEntityDims.width              = pHScale * DEFAULT_ENTITY_WIDTH;
            }
            gEntity2X = {};
        },
        getX: getX,
        setX: function (pEntity, pX){
            gEntity2X[pEntity.name] = pX + (gEntityDims.width / 2);
        },
        getOAndD: function (pFrom, pTo){
            return {
                from: getX(pFrom) < getX(pTo) ? getX(pFrom) : getX(pTo),
                to: getX(pTo) > getX(pFrom) ? getX(pTo) : getX(pFrom)
            };
        },
        setHeight: function (pHeight){
            gEntityDims.height = pHeight;
        },
        getDims: function (){
            return gEntityDims;
        },
        getNoEntityLines: function(pLabel, pFontSize, pOptions){
            return renderlabels.splitLabel(pLabel, "entity", gEntityDims.width, pFontSize, pOptions).length;
        }
    };
});
/* eslint security/detect-object-injection: 0*/
/* The 'generic object injection sink' is to a frozen object,
   attempts to modify it will be moot => we can safely use the []
   notation
*/

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
