/*
 * Helper functions for the parsers. These used to be in the parsers
 * themselves, often duplicated. This module is a mixed bag thing now
 * with generic things (=> replace with lodash?) and specific things
 * (split into different modules?) mixed - and is only a first step
 * in refactoring the parser code a bit.
 *
 */

/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {

    function nameValue2Option(pName, pValue){
        var lOption = {};
        lOption[pName.toLowerCase()] = pValue;
        return lOption;
    }

    function flattenBoolean(pBoolean) {
        return (["true", "on", "1"].indexOf(pBoolean.toLowerCase()) > -1);
    }

    /* eslint no-undefined: 0 */
    function entityExists (pEntities, pName) {
        return pName === undefined || pName === "*" || pEntities.some(function(pEntity){
            return pEntity.name === pName;
        });
    }

    function isMscGenKeyword(pString){
        return [
            "box", "abox", "rbox", "note", "msc", "hscale", "width",
            "arcgradient", "wordwraparcs", "label", "color", "idurl", "id",
            "url", "linecolor", "linecolour", "textcolor", "textcolour",
            "textbgcolor", "textbgcolour", "arclinecolor", "arclinecolour",
            "arctextcolor", "arctextcolour", "arctextbgcolor", "arctextbgcolour",
            "arcskip"
        ].indexOf(pString) > -1;
    }

    function buildEntityNotDefinedMessage(pEntityName, pArc){
        return "Entity '" + pEntityName + "' in arc " +
               "'" + pArc.from + " " + pArc.kind + " " + pArc.to + "' " +
               "is not defined.";
    }

    function EntityNotDefinedError(pEntityName, pArc) {
        this.name = "EntityNotDefinedError";
        this.message = buildEntityNotDefinedMessage(pEntityName, pArc);
    }

    function checkForUndeclaredEntities (pEntities, pArcLines) {
        (pArcLines || []).forEach(function(pArcLine) {
            pArcLine.forEach(function(pArc) {
                if (pArc.from && !entityExists(pEntities, pArc.from)) {
                    throw new EntityNotDefinedError(pArc.from, pArc);
                }
                if (pArc.to && !entityExists(pEntities, pArc.to)) {
                    throw new EntityNotDefinedError(pArc.to, pArc);
                }
                if (!!pArc.arcs){
                    checkForUndeclaredEntities(pEntities, pArc.arcs);
                }
            });
        });
    }

    function hasExtendedOptions (pOptions){
        if (pOptions){
            return (
                pOptions.hasOwnProperty("watermark") ||
                  pOptions.hasOwnProperty("wordwrapentities") ||
                  pOptions.hasOwnProperty("wordwrapboxes") ||
                  (pOptions.hasOwnProperty("width") && pOptions.width === "auto")
            );
        } else {
            return false;
        }
    }

    function hasExtendedArcTypes(pArcLines){
        return (pArcLines || []).some(function(pArcLine){
            return pArcLine.some(function(pArc){
                return (["alt", "else", "opt", "break", "par",
                    "seq", "strict", "neg", "critical",
                    "ignore", "consider", "assert",
                    "loop", "ref", "exc"].indexOf(pArc.kind) > -1);
            });
        });
    }

    function getMetaInfo(pOptions, pArcLines){
        var lHasExtendedOptions  = hasExtendedOptions(pOptions);
        var lHasExtendedArcTypes = hasExtendedArcTypes(pArcLines);
        return {
            "extendedOptions" : lHasExtendedOptions,
            "extendedArcTypes": lHasExtendedArcTypes,
            "extendedFeatures": lHasExtendedOptions || lHasExtendedArcTypes
        };
    }

    return {
        nameValue2Option: nameValue2Option,

        flattenBoolean: flattenBoolean,
        entityExists: entityExists,
        EntityNotDefinedError: EntityNotDefinedError,
        checkForUndeclaredEntities: checkForUndeclaredEntities,
        isMscGenKeyword: isMscGenKeyword,
        getMetaInfo: getMetaInfo
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
