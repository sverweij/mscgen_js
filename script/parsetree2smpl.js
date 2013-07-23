/*
 * takes a parsetree for a message sequence chart and renders it
 * as a simplified mscgen program. 
 */
var tosmpl = (function(){

function _renderParseTree(pParseTree){
    var lRetVal = new String("");
    if (pParseTree) {
        if(pParseTree.options){
            lRetVal += renderOptions(pParseTree.options) + "\n";
        }
        if (pParseTree.entities) {
            lRetVal += renderEntities(pParseTree.entities) + "\n";
        }
        if (pParseTree.arcs) {
            lRetVal += renderArcLines(pParseTree.arcs);
        }
    }
    return lRetVal;
}

function renderEntityName(pString){
    function isQuoatable(pString) {
        var lMatchResult = pString.match(/[a-z0-9]+/gi);
        if (lMatchResult) {
            return lMatchResult.length != 1;
        } else {
            return false;
        }
    }
    return isQuoatable(pString) ?  "\"" + pString + "\"" : pString;
}

function renderSmplString(pString){
    function isQuoatable(pString) {
        var lMatchResult = pString.match(/[;,]/);
        if (lMatchResult) {
            return lMatchResult.length === 1;
        } else {
            return false;
        }
    }
    return isQuoatable(pString) ?  "\"" + pString + "\"" : pString;
}

function pushAttribute(pArray, pAttr, pString) {
    if (pAttr) {
        pArray.push(pString + "=\"" + pAttr + "\"");
    }
}

function renderOptions(pOptions){
    var lOpts = [];
    var lRetVal = new String("# options\n");
    var i = 0;

    pushAttribute(lOpts, pOptions.hscale, "hscale");
    pushAttribute(lOpts, pOptions.width, "width");
    pushAttribute(lOpts, pOptions.arcgradient, "arcgradient");

    for (i=0;i<lOpts.length-1;i++) {
        lRetVal += lOpts[i] + ",\n"
    }
    lRetVal += lOpts[lOpts.length-1] + ";\n"
    return lRetVal;

}

function renderEntity(pEntity) {
    var lRetVal = new String();
    lRetVal += renderEntityName(pEntity.name);
    if (pEntity.label){
        lRetVal += " : " + renderSmplString(pEntity.label);
    }
    return lRetVal;
}

function renderEntities(pEntities) {
    var lRetVal = new String("# entities\n");
    var i = 0;
    for (i=0;i<pEntities.length-1;i++){
        lRetVal += renderEntity(pEntities[i]) + ", ";
    }
    lRetVal += renderEntity(pEntities[pEntities.length-1]) + ";\n";
    return lRetVal;
}

function renderArc(pArc) {
    var lRetVal = new String();
    if (pArc.from) {
        lRetVal += renderEntityName(pArc.from) + " ";
    }
    if (pArc.kind) {
        lRetVal += pArc.kind;
    }
    if (pArc.to) {
        lRetVal += " " + renderEntityName(pArc.to);
    }
    if (pArc.label) {
        lRetVal += " : " + renderSmplString(pArc.label);
    }
    return lRetVal;
}

function renderArcLines(pArcs) {
    var lRetVal = new String("# arcs\n");
    var i = 0;
    var j = 0;

    if (pArcs.length > 0) {
        for (i=0;i<pArcs.length;i++){
            if (pArcs[i].length > 0) {
                for (j=0;j<pArcs[i].length-1;j++){
                    lRetVal += renderArc(pArcs[i][j]) + ",\n";
                }
                lRetVal += renderArc(pArcs[i][pArcs[i].length-1]) + ";\n";
            }
        }
    }
    return lRetVal;
}

var result =  { 
    render: function (pParseTree){
        return _renderParseTree(pParseTree);
    }
}

return result;
})();
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
