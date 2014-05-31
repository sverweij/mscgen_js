/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as a simplified mscgen (ms genny)program.
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./textutensils"], function(utl) {
    var INDENT = "  ";
    var SP = " ";
    var EOL = "\n";

    var CONFIG = {
        "renderCommentfn" : renderComments,
        "renderOptionfn" : renderOption,
        "renderEntityNamefn" : renderEntityName,
        "renderKindfn" : renderKind,
        "supportedOptions" : ["hscale", "width", "arcgradient", "wordwraparcs", "watermark"],
        "supportedEntityAttributes" : ["label"],
        "supportedArcAttributes" : ["label"],
        // "renderAttributefn" : renderAttribute
        "program" : {
            "opener" : "",
            "closer" : ""
        },
        "option" : {
            "separator" : "," + EOL,
            "closer" : ";" + EOL + EOL
        },
        "entity" : {
            "opener" : "",
            "separator" : "," + SP,
            "closer" : ";" + EOL + EOL
        },
        "arcline" : {
            "opener" : "",
            "separator" : "," + EOL,
            "closer" : ";" + EOL
        },
        "inline" : {
            "opener" : " {" + EOL,
            "closer" : "}"
        },
        "attribute" : {
            "opener" : "",
            "separator" : "",
            "closer" : ""
        }
    };
    var gConfig = {};

    function _renderAST(pAST, pConfig) {
        var lAttribute = "";
        for (lAttribute in CONFIG) {
            gConfig[lAttribute] = CONFIG[lAttribute];
        }
        for (lAttribute in pConfig) {
            gConfig[lAttribute] = pConfig[lAttribute];
        }

        return jurk(pAST);
    }

    function jurk(pAST) {
        var lRetVal = "";
        if (pAST) {
            if (pAST.precomment) {
                lRetVal += gConfig.renderCommentfn(pAST.precomment);
            }
            lRetVal += gConfig.program.opener;
            if (pAST.options) {
                lRetVal += renderOptions(pAST.options);
            }
            if (pAST.entities) {
                lRetVal += renderEntities(pAST.entities, gConfig.renderEntityfn);
            }
            if (pAST.arcs) {
                lRetVal += renderArcLines(pAST.arcs, "");
            }
            lRetVal += gConfig.program.closer;
        }
        return lRetVal;
    }

    function pushAttribute(pArray, pAttr, pString) {
        if (pAttr && pString) {
            pArray.push({
                "name" : pAttr,
                "value" : pString
            });
        }
    }

    function extractSupportedOptions(pOptions, pSupportedOptions) {
        var lRetvalAry = [];
        var lOption = "";
        for (var i = 0; i < pSupportedOptions.length; i++) {
            lOption = pSupportedOptions[i];
            pushAttribute(lRetvalAry, lOption, pOptions[lOption]);
        }
        return lRetvalAry;
    }

    function renderComments(pArray) {
        var lRetval = "";
        for (var i = 0; i < pArray.length; i++) {
            lRetval += pArray[i];
            // not using EOL constant here is intentional
        }
        return lRetval;
    }

    function renderEntityName(pString) {
        function isQuoatable(pString) {
            var lMatchResult = pString.match(/[a-z0-9]+/gi);
            if (lMatchResult && lMatchResult !== null) {
                return lMatchResult.length != 1;
            } else {
                return true;
            }
        }

        return isQuoatable(pString) ? "\"" + pString + "\"" : pString;
    }

    function renderOption(pOption) {
        return pOption.name + "=\"" + utl.escapeString(pOption.value) + "\"";
    }

    function renderOptions(pOptions) {
        var lRetVal = "";
        var lOptions = extractSupportedOptions(pOptions, gConfig.supportedOptions);

        for (var i = 0; i < lOptions.length - 1; i++) {
            lRetVal += gConfig.renderOptionfn(lOptions[i]) + gConfig.option.separator;
        }
        lRetVal += gConfig.renderOptionfn(lOptions[lOptions.length - 1]) + gConfig.option.closer;
        return lRetVal;

    }

    function renderEntity(pEntity) {
        var lRetVal = gConfig.renderEntityNamefn(pEntity.name);
        lRetVal += renderAttributes(pEntity, gConfig.supportedEntityAttributes);
        return lRetVal;
    }

    function renderEntities(pEntities) {
        var lRetVal = "";
        var i = 0;
        if (pEntities.length > 0) {
            lRetVal = gConfig.entity.opener;
            for ( i = 0; i < pEntities.length - 1; i++) {
                lRetVal += renderEntity(pEntities[i]) + gConfig.entity.separator;
            }
            lRetVal += renderEntity(pEntities[pEntities.length - 1]) + gConfig.entity.closer;
        }
        return lRetVal;
    }

    function renderAttributes(pArcOrEntity, pSupportedAttributes) {
        var lRetVal = "";
        var lAttributes = extractSupportedOptions(pArcOrEntity, pSupportedAttributes);
        if (lAttributes.length > 0) {
            lRetVal = gConfig.attribute.opener;
            for (var i = 0; i < lAttributes.length - 1; i++) {
                lRetVal += gConfig.renderAttributefn(lAttributes[i]) + gConfig.attribute.separator;
            }
            lRetVal += gConfig.renderAttributefn(lAttributes[lAttributes.length - 1]) + gConfig.attribute.closer;
        }
        return lRetVal;
    }

    function renderKind(pKind) {
        return pKind;
    }

    function renderArc(pArc, pIndent) {
        var lRetVal = "";
        if (pArc.from) {
            lRetVal += gConfig.renderEntityNamefn(pArc.from) + " ";
        }
        if (pArc.kind) {
            lRetVal += gConfig.renderKindfn(pArc.kind);
        }
        if (pArc.to) {
            lRetVal += " " + gConfig.renderEntityNamefn(pArc.to);
        }
        lRetVal += renderAttributes(pArc, gConfig.supportedArcAttributes);
        if (pArc.arcs) {
            lRetVal += gConfig.inline.opener;
            lRetVal += renderArcLines(pArc.arcs, pIndent + INDENT);
            lRetVal += pIndent + gConfig.inline.closer;
        }
        return lRetVal;
    }

    function renderArcLine(pArcLine, pIndent) {
        var lRetVal = "";
        if (pArcLine.length > 0) {
            lRetVal = gConfig.arcline.opener;
            for (var j = 0; j < pArcLine.length - 1; j++) {
                lRetVal += pIndent + renderArc(pArcLine[j], pIndent) + gConfig.arcline.separator;
            }
            lRetVal += pIndent + renderArc(pArcLine[pArcLine.length - 1], pIndent) + gConfig.arcline.closer;
        }
        return lRetVal;
    }

    function renderArcLines(pArcLines, pIndent) {
        var lRetVal = "";
        if (pArcLines.length > 0) {
            for (var i = 0; i < pArcLines.length; i++) {
                lRetVal += renderArcLine(pArcLines[i], pIndent);
            }
        }
        return lRetVal;
    }

    return {
        render : function(pAST, pConfig) {
            return _renderAST(pAST, pConfig);
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
