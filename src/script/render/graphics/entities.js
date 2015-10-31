/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./renderlabels", "./constants"], function(labels, C) {
    "use strict";

    var DEFAULT_INTER_ENTITY_SPACING = 160; // px
    var DEFAULT_ENTITY_WIDTH = 100; // px
    var DEFAULT_ENTITY_HEIGHT = 34; // px

    var gEntityDims = {
        interEntitySpacing: DEFAULT_INTER_ENTITY_SPACING,
        height: DEFAULT_ENTITY_HEIGHT,
        width: DEFAULT_ENTITY_WIDTH
    };

    var gEntity2X = {};

    function init(pOptions){
        gEntityDims.interEntitySpacing = DEFAULT_INTER_ENTITY_SPACING;
        gEntityDims.height = DEFAULT_ENTITY_HEIGHT;
        gEntityDims.width = DEFAULT_ENTITY_WIDTH;

        if (pOptions && pOptions.hscale) {
            gEntityDims.interEntitySpacing = pOptions.hscale * DEFAULT_INTER_ENTITY_SPACING;
            gEntityDims.width = pOptions.hscale * DEFAULT_ENTITY_WIDTH;
        }
        gEntity2X = {};
    }

    function getOAndD (pFrom, pTo){
        return {
            from: getX(pFrom),
            to: getX(pTo)
        };
    }
    /**
     * returns the x position of the entity
     */
    function getX(pName){
        return gEntity2X[pName];
    }

    function setX(pEntity, pX){
        gEntity2X[pEntity.name] = pX + (gEntityDims.width / 2);
    }

    function getDims(){
        return gEntityDims;
    }

    function setHeight(pHeight){
        gEntityDims.height = pHeight;
    }

    return {
        // render: render,
        init: init,

        getX: getX,
        setX: setX,
        getOAndD: getOAndD,

        setHeight: setHeight,
        getDims: getDims,

        getNoEntityLines : function(pLabel){
            return labels.splitLabel(pLabel, "box", gEntityDims.width, C.FONT_SIZE).length;
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
