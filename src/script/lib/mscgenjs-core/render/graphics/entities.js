/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){
    "use strict";

    var renderlabels      = require("./renderlabels");
    var svgelementfactory = require("./svgelementfactory/index");
    var svgutensils       = require("./svgutensils");
    var constants         = require("./constants");
    var _                 = require("../../lib/lodash/lodash.custom");

    var DEFAULT_INTER_ENTITY_SPACING = 160; // px
    var DEFAULT_ENTITY_WIDTH         = 100; // px
    var DEFAULT_ENTITY_HEIGHT        = 34; // px

    var gEntityDims = Object.seal({
        interEntitySpacing : DEFAULT_INTER_ENTITY_SPACING,
        height             : DEFAULT_ENTITY_HEIGHT,
        width              : DEFAULT_ENTITY_WIDTH,
        entityXHWM         : 0
    });

    var gEntity2X = {};

    function getX(pName){
        return gEntity2X[pName];
    }

    function setX(pEntity, pX){
        gEntity2X[pEntity.name] = pX + (gEntityDims.width / 2);
    }

    function getDims(){
        return gEntityDims;
    }

    function getNoEntityLines(pLabel, pFontSize, pOptions){
        return renderlabels.splitLabel(pLabel, "entity", gEntityDims.width, pFontSize, pOptions).length;
    }

    function sizeEntityBoxToLabel(pLabel, pBBox) {
        var lLabelWidth = Math.min(
            svgutensils.getBBox(pLabel).width + (4 * constants.LINE_WIDTH),
            (pBBox.interEntitySpacing / 3) + pBBox.width
        );
        if (lLabelWidth >= pBBox.width) {
            pBBox.x -= (lLabelWidth - pBBox.width) / 2;
            pBBox.width = lLabelWidth;
        }
        return pBBox;
    }

    function renderEntity(pEntity, pX, pY, pOptions) {
        var lGroup = svgelementfactory.createGroup();
        var lBBox = _.cloneDeep(gEntityDims);
        lBBox.x = pX ? pX : 0;
        lBBox.y = pY ? pY : 0;
        var lLabel = renderlabels.createLabel(
            _.defaults(
                pEntity,
                {
                    kind: "entity"
                }
            ),
            {
                x:lBBox.x,
                y:pY + (lBBox.height / 2),
                width:lBBox.width
            },
            pOptions
        );

        lGroup.appendChild(
            svgelementfactory.createRect(
                sizeEntityBoxToLabel(lLabel, lBBox),
                "entity",
                pEntity.linecolor,
                pEntity.textbgcolor
            )
        );
        lGroup.appendChild(lLabel);
        return lGroup;
    }

    function renderEntities(pEntities, pEntityYPos, pOptions){
        var lEntityGroup = svgelementfactory.createGroup();

        gEntityDims.entityXHWM = 0;
        gEntityDims.height = getMaxEntityHeight(pEntities, pOptions) + constants.LINE_WIDTH * 2;

        pEntities.forEach(function(pEntity){
            lEntityGroup.appendChild(renderEntity(pEntity, gEntityDims.entityXHWM, pEntityYPos, pOptions));
            setX(pEntity, gEntityDims.entityXHWM);
            gEntityDims.entityXHWM += gEntityDims.interEntitySpacing;
        });

        return lEntityGroup;
    }

    /**
     * getMaxEntityHeight() -
     * crude method for determining the max entity height;
     * - take the entity with the most number of lines
     * - if that number > 2 (default entity hight easily fits 2 lines of text)
     *   - render that entity
     *   - return the height of its bbox
     *
     * @param <object> - pEntities - the entities subtree of the AST
     * @return <int> - height - the height of the heighest entity
     */
    function getMaxEntityHeight(pEntities, pOptions){
        var lHighestEntity = pEntities[0];
        var lHWM = 2;
        pEntities.forEach(function(pEntity){
            var lNoEntityLines = getNoEntityLines(pEntity.label, constants.FONT_SIZE, pOptions);
            if (lNoEntityLines > lHWM){
                lHWM = lNoEntityLines;
                lHighestEntity = pEntity;
            }
        });

        if (lHWM > 2){
            return Math.max(
                gEntityDims.height,
                svgutensils.getBBox(
                    renderEntity(lHighestEntity, 0, 0, pOptions)
                ).height
            );
        }
        return gEntityDims.height;
    }

    return {
        init: function (pHScale){
            gEntityDims.interEntitySpacing = DEFAULT_INTER_ENTITY_SPACING;
            gEntityDims.height             = DEFAULT_ENTITY_HEIGHT;
            gEntityDims.width              = DEFAULT_ENTITY_WIDTH;
            gEntityDims.entityXHWM         = 0;

            if (pHScale) {
                gEntityDims.interEntitySpacing = pHScale * DEFAULT_INTER_ENTITY_SPACING;
                gEntityDims.width              = pHScale * DEFAULT_ENTITY_WIDTH;
            }
            gEntity2X = {};
        },
        getX: getX,
        getOAndD: function (pFrom, pTo){
            return {
                from: getX(pFrom) < getX(pTo) ? getX(pFrom) : getX(pTo),
                to: getX(pTo) > getX(pFrom) ? getX(pTo) : getX(pFrom)
            };
        },
        getDims: getDims,
        renderEntities: renderEntities
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
