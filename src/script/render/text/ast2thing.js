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
    "use strict";

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
            "opener" : "",
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
            if (pAST.postcomment) {
                lRetVal += gConfig.renderCommentfn(pAST.postcomment);
            }           
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
        pSupportedOptions.forEach(function(pSupportedOption) {
            pushAttribute(lRetvalAry, pSupportedOption, pOptions[pSupportedOption]);
        }); 
        return lRetvalAry;
    }

    function renderComments(pArray) {
        return pArray.reduce(function(pPrevComment, pCurComment) {
            return pPrevComment + pCurComment;
        }, "");
    }

    function renderEntityName(pString) {
        function isQuotable(pString) {
            var lMatchResult = pString.match(/[a-z0-9]+/gi);
            if (lMatchResult && lMatchResult !== null) {
                return lMatchResult.length !== 1;
            } else {
                return true;
            }
        }

        return isQuotable(pString) ? "\"" + pString + "\"" : pString;
    }

    function renderOption(pOption) {
        return pOption.name + "=\"" + utl.escapeString(pOption.value) + "\"";
    }

    function renderOptions(pOptions) {
        var lOptions = extractSupportedOptions(pOptions, gConfig.supportedOptions);
        var lLastOption = lOptions.pop();
        var lRetVal = lOptions.reduce(function(pPrevOption, pCurOption) {
            return pPrevOption + gConfig.renderOptionfn(pCurOption) + gConfig.option.separator;
        }, gConfig.option.opener);
        lRetVal += gConfig.renderOptionfn(lLastOption) + gConfig.option.closer;
        return lRetVal;
    }

    function renderEntity(pEntity) {
        var lRetVal = gConfig.renderEntityNamefn(pEntity.name);
        lRetVal += renderAttributes(pEntity, gConfig.supportedEntityAttributes);
        return lRetVal;
    }

    function renderEntities(pEntities) {
        var lRetVal = "";
        if (pEntities.length > 0) {
            lRetVal = pEntities.slice(0, -1).reduce(function(pPrev, pEntity){
                return pPrev + renderEntity(pEntity) + gConfig.entity.separator;
            }, gConfig.entity.opener);
            lRetVal += renderEntity(pEntities[pEntities.length - 1]) + gConfig.entity.closer;
        }
        return lRetVal;
    }

    function renderAttributes(pArcOrEntity, pSupportedAttributes) {
        var lRetVal = "";
        var lAttributes = extractSupportedOptions(pArcOrEntity, pSupportedAttributes);
        if (lAttributes.length > 0) {
            var lLastAtribute = lAttributes.pop();
            lRetVal = lAttributes.reduce(function(pPreviousAttribute, pCurrentAttribute) {
                return pPreviousAttribute + gConfig.renderAttributefn(pCurrentAttribute) + gConfig.attribute.separator;
            }, gConfig.attribute.opener);
            lRetVal += gConfig.renderAttributefn(lLastAtribute) + gConfig.attribute.closer;
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
            lRetVal = pArcLine.slice(0, -1).reduce(function(pPrev, pArc) {
                return pPrev + pIndent + renderArc(pArc, pIndent) + gConfig.arcline.separator;
            }, gConfig.arcline.opener);
            lRetVal += pIndent + renderArc(pArcLine[pArcLine.length - 1], pIndent) + gConfig.arcline.closer;
        }
        return lRetVal;
    }

    function renderArcLines(pArcLines, pIndent) {
        return pArcLines.reduce(function(pPrev, pArcLine){
            return pPrev + renderArcLine(pArcLine, pIndent);
        }, "");
    }

    return {
        render : _renderAST
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
