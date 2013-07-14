module.exports = (function(){
const INDENT = "  ";

function _renderParseTree(pParseTree){
    var lRetVal = new String("msc {\n");
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
    return lRetVal += "}"
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

function pushAttribute(pArray, pAttr, pString) {
    if (pAttr) {
        pArray.push(pString + "=\"" + pAttr + "\"");
    }
}

function renderOptions(pOptions){
    var lOpts = [];
    var lRetVal = new String(INDENT + "# options\n");
    var i = 0;

    pushAttribute(lOpts, pOptions.hscale, "hscale");
    pushAttribute(lOpts, pOptions.width, "width");
    pushAttribute(lOpts, pOptions.arcgradient, "arcgradient");

    for (i=0;i<lOpts.length-1;i++) {
        lRetVal += INDENT + lOpts[i] + ",\n"
    }
    lRetVal += INDENT + lOpts[lOpts.length-1] + ";\n"
    return lRetVal;

}

function renderAttributes (pThing) {
    var lAttrs = [];
    var lRetVal = new String("");
    pushAttribute(lAttrs, pThing.label, "label");
    pushAttribute(lAttrs, pThing.idurl, "idurl");
    pushAttribute(lAttrs, pThing.id, "id");
    pushAttribute(lAttrs, pThing.url, "url");
    pushAttribute(lAttrs, pThing.linecolor, "linecolor");
    pushAttribute(lAttrs, pThing.textcolor, "textcolor");
    pushAttribute(lAttrs, pThing.textbgcolor, "textbgcolor");
    pushAttribute(lAttrs, pThing.arclinecolor, "arclinecolor");
    pushAttribute(lAttrs, pThing.arctextcolor, "arctextcolor");
    pushAttribute(lAttrs, pThing.arctextbgcolor, "arctextbgcolor");
    pushAttribute(lAttrs, pThing.arcskip, "arcskip");
    
    if (lAttrs.length > 0 ) {
        lRetVal = " ["; 
        for (i=0;i<lAttrs.length-1;i++) {
            lRetVal += lAttrs[i] + ", "
        }
        lRetVal += lAttrs[lAttrs.length-1];
        lRetVal += "]";
    }

    return lRetVal;
}

function renderEntity(pEntity) {
    var lRetVal = new String();
    lRetVal += renderEntityName(pEntity.name);
    lRetVal += renderAttributes(pEntity);
    return lRetVal;
}

function renderEntities(pEntities) {
    var lRetVal = new String(INDENT + "# entities\n");
    var i = 0;
    for (i=0;i<pEntities.length-1;i++){
        lRetVal += INDENT + renderEntity(pEntities[i]) + ",\n";
    }
    lRetVal += INDENT + renderEntity(pEntities[pEntities.length-1]) + ";\n";
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
    lRetVal += renderAttributes(pArc);
    return lRetVal;
}

function renderArcLines(pArcs) {
    
    var lRetVal = new String(INDENT + "# arcs\n");
    var i = 0;
    var j = 0;

    if (pArcs.length > 0) {
        for (i=0;i<pArcs.length;i++){
            if (pArcs[i].length > 0) {
                for (j=0;j<pArcs[i].length-1;j++){
                    lRetVal += INDENT + renderArc(pArcs[i][j]) + ",\n";
                }
                lRetVal += INDENT + renderArc(pArcs[i][pArcs[i].length-1]) + ";\n";
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
