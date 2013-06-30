define(["log", "mscrenderutensils"], function(log, utl) {
var SVGNS = new String ("http://www.w3.org/2000/svg");
var XLINKNS = new String ("http://www.w3.org/1999/xlink");

var PAD_VERTICAL = 3;
var PAD_HORIZONTAL = 3;
var DEFAULT_INTER_ENTITY_SPACING = 160;
var INTER_ENTITY_SPACING = DEFAULT_INTER_ENTITY_SPACING;
var DEFAULT_ENTITY_WIDTH = 100;
var ENTITY_WIDTH = DEFAULT_ENTITY_WIDTH;
var ENTITY_HEIGHT = 30;
var DEFAULT_ARCROW_HEIGHT = 25;
var ARCROW_HEIGHT = DEFAULT_ARCROW_HEIGHT;
var DEFAULT_ARC_GRADIENT = 0;
var ARC_GRADIENT = DEFAULT_ARC_GRADIENT;

var gEntityXHWM = 0;
var gArcRowYHWM = 0;
var gEntity2X = new Object();
var gArcRow2Y = new Object();

var TEXT_HEIGHT = 8; /* TODO: should really be derived */

function _clean () {
    var lDefTag = document.getElementsByTagNameNS(SVGNS, "defs")[0];
    var lBody = document.getElementById("body");
    var lOldDefs = document.getElementById("defs");
    var lOldSequence = document.getElementById("sequence");
    var lOldNotelayer = document.getElementById("notelayer");
    var lNewDefs = utl.createGroup("defs");
    var lNewSequence = utl.createGroup("sequence");
    var lNewNotelayer = utl.createGroup("notelayer");
    lBody.replaceChild(lNewSequence, lOldSequence);
    lBody.replaceChild(lNewNotelayer, lOldNotelayer);
    lDefTag.replaceChild(lNewDefs, lOldDefs);
}

function _renderParseTree (pParseTree) {

    if (pParseTree.options) {
        if (pParseTree.options.hscale) {
            INTER_ENTITY_SPACING =
                pParseTree.options.hscale * DEFAULT_INTER_ENTITY_SPACING;
            ENTITY_WIDTH =
                pParseTree.options.hscale * DEFAULT_ENTITY_WIDTH;
        } else {
            INTER_ENTITY_SPACING = DEFAULT_INTER_ENTITY_SPACING;
            ENTITY_WIDTH = DEFAULT_ENTITY_WIDTH;
        }
        if (pParseTree.options.arcgradient) {
            ARCROW_HEIGHT =
                parseInt(pParseTree.options.arcgradient) + DEFAULT_ARCROW_HEIGHT;
            ARC_GRADIENT = 
                parseInt(pParseTree.options.arcgradient) + DEFAULT_ARC_GRADIENT;
        }
    }

    renderEntities(pParseTree.entities);
    renderArcs(pParseTree.arcs, pParseTree.entities);

    var body = document.getElementById("body");
    var lCanvasWidth = gEntityXHWM -  2*PAD_HORIZONTAL + INTER_ENTITY_SPACING/4;
    var lCanvasHeight = gArcRowYHWM - (ARCROW_HEIGHT/2) + 2*PAD_VERTICAL;
    var lSvgElement = document.getElementById("svg_output");
    body.setAttribute("transform",
            "translate("+ (PAD_HORIZONTAL + (INTER_ENTITY_SPACING/4)) + ","+ PAD_VERTICAL +")");
    lSvgElement.setAttribute("width", lCanvasWidth.toString());
    lSvgElement.setAttribute("height", lCanvasHeight.toString());

    if (pParseTree.options && pParseTree.options.width) {
        var lTransform = body.getAttribute("transform");
        lTransform += " scale(" + (pParseTree.options.width/lCanvasWidth) + ",1)";
        body.setAttribute ("transform", lTransform);
    }

}


function renderOptions (pOptions) {
}

function renderEntities (pEntities) {
    var defs = document.getElementById("defs");
    var sequence = document.getElementById("sequence");
    var lEntityXPos = 0;
    var lLabel = "";
    var i;

    gEntity2X = new Object();

    if (pEntities) {
        for (i=0;i<pEntities.length;i++){
            lLabel = pEntities[i].name;

            if (pEntities[i].label) { lLabel = pEntities[i].label; }
            defs.appendChild(createEntity(pEntities[i].name,lLabel));
            sequence.appendChild(
                utl.createUse(lEntityXPos,0,pEntities[i].name));
            gEntity2X[pEntities[i].name] = lEntityXPos + (ENTITY_WIDTH/2);
            lEntityXPos += INTER_ENTITY_SPACING;
        }
    }
    gEntityXHWM = lEntityXPos;
}

function renderArcs (pArcs, pEntities) {
    var defs = document.getElementById("defs");
    var sequence = document.getElementById("sequence");
    var notelayer = document.getElementById("notelayer");

    var lArcRowYPos = ENTITY_HEIGHT + (ARCROW_HEIGHT/2);
    var lLabel = "";
    var lArcEnd = gEntityXHWM - INTER_ENTITY_SPACING + ENTITY_WIDTH;
    var lArcMiddle = lArcEnd/2;
    var lNoEntities = pEntities.length;

    var i,j,k = 0;

    gArcRow2Y = new Object();

    defs.appendChild(createArcRow(lNoEntities, "arcrow"));
    defs.appendChild(createArcRow(lNoEntities, "arcrowomit"));

    sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
    lArcRowYPos += ARCROW_HEIGHT;

    if (pArcs) {
        for (i=0;i<pArcs.length;i++) {
            for (j=0;j<pArcs[i].length;j++) {
                var lCurrentId = i.toString() + "_" + j.toString();
                lLabel = "";
                if (pArcs[i][j].label) { lLabel = pArcs[i][j].label; }
                switch(pArcs[i][j].kind) {
                    case ("..."): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrowomit"));
                        sequence.appendChild(
                                utl.createRect(utl.getTextWidth(lLabel),TEXT_HEIGHT, "textbg", lArcMiddle - (utl.getTextWidth(lLabel)/2),  lArcRowYPos - (TEXT_HEIGHT/2)));
                        sequence.appendChild(
                                utl.createText(lLabel,lArcMiddle, lArcRowYPos + (TEXT_HEIGHT/2)));
                        break;
                        }
                    case ("|||"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        sequence.appendChild(
                                utl.createRect(utl.getTextWidth(lLabel),TEXT_HEIGHT, "textbg", lArcMiddle - (utl.getTextWidth(lLabel)/2),  lArcRowYPos - (TEXT_HEIGHT/2)));
                        sequence.appendChild(
                                utl.createText(lLabel,lArcMiddle, lArcRowYPos + (TEXT_HEIGHT/2)));
                        break;
                        }
                    case ("---"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        sequence.appendChild(utl.createLine(0, lArcRowYPos, lArcEnd, lArcRowYPos, "dotted"));
                        sequence.appendChild(
                                utl.createRect(utl.getTextWidth(lLabel),TEXT_HEIGHT, "textbg", lArcMiddle - (utl.getTextWidth(lLabel)/2),  lArcRowYPos - (TEXT_HEIGHT/2)));
                        sequence.appendChild(
                                utl.createText(lLabel,lArcMiddle, lArcRowYPos + (TEXT_HEIGHT/2)));
                        break;
                        }
                    case("box"): case ("rbox"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                            createBox(lCurrentId,
                                        gEntity2X[pArcs[i][j].from],
                                        gEntity2X[pArcs[i][j].to], lLabel,
                                        pArcs[i][j].kind));
                        notelayer.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case("abox"):{
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                            createABox(lCurrentId,
                                        gEntity2X[pArcs[i][j].from],
                                        gEntity2X[pArcs[i][j].to], lLabel,
                                        pArcs[i][j].kind));
                        notelayer.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case("note"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                            createNote(lCurrentId,
                                        gEntity2X[pArcs[i][j].from],
                                        gEntity2X[pArcs[i][j].to], lLabel));
                        notelayer.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    default:{
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        if (pArcs[i][j].from && pArcs[i][j].to) {
                            var lFrom = pArcs[i][j].from;
                            var lTo = pArcs[i][j].to;
                            if (lTo === "*"){
                                var xFrom = gEntity2X[lFrom];
                                for (k=0;k<pEntities.length;k++){
                                    if (pEntities[k].name != lFrom) {
                                        var xTo = gEntity2X[pEntities[k].name];
                                        pArcs[i][j].label = "";
                                        defs.appendChild(
                                            createArc(lCurrentId + "bc" + k,
                                                      pArcs[i][j], xFrom, xTo
                                                       ));
                                        sequence.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId + "bc" + k));
                                    }
                                }
                                sequence.appendChild(
                                        utl.createText(lLabel,lArcMiddle, lArcRowYPos - (TEXT_HEIGHT/2)));
                            } else if (lFrom === "*"){
                                var xTo = gEntity2X[lTo];
                                for (k=0;k<pEntities.length;k++){
                                    if (pEntities[k].name != lTo) {
                                        var xFrom = gEntity2X[pEntities[k].name];
                                        pArcs[i][j].label ="";
                                        defs.appendChild(
                                            createArc(lCurrentId + "bc" + k,
                                                      pArcs[i][j], xFrom, xTo
                                                       ));
                                        sequence.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId + "bc" + k));
                                    }
                                }
                                sequence.appendChild(
                                        utl.createText(lLabel,lArcMiddle, lArcRowYPos - (TEXT_HEIGHT/2)));
                            } else {
                                var xFrom = gEntity2X[lFrom];
                                var xTo = gEntity2X[lTo];
                                defs.appendChild(
                                    createArc(lCurrentId, pArcs[i][j], xFrom, xTo));
                                sequence.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                            }
                        }
                        break;
                    }
                }
            }
            lArcRowYPos += ARCROW_HEIGHT;
            gArcRow2Y[i+1] = lArcRowYPos;
        }
    }
    gArcRowYHWM = lArcRowYPos;

}

function createEntity (pId, pLabel) {
    var lGroup = utl.createGroup(pId);
    var lRect = utl.createRect(ENTITY_WIDTH, ENTITY_HEIGHT);
    var lText = utl.createText(pLabel, ENTITY_WIDTH/2, (ENTITY_HEIGHT + TEXT_HEIGHT)/2, "entity");

    // lText.setAttribute("id", pId + "t");
    // var bbox = lText.getBBox();
    // var TEXT_HEIGHT = bbox.height;
    // var lTextWidth = bbox.width;

    lGroup.appendChild(lRect);
    lGroup.appendChild(lText);
    return lGroup;
}

function createArcRow(pNoEntities, pClass) {
    var i = 0;
    var lGroup = utl.createGroup(pClass); // passing pClass as pId here
    var lEntityXPos = 0;

    for (i=0;i<pNoEntities;i++){
        lGroup.appendChild(utl.createLine (
            lEntityXPos + (ENTITY_WIDTH/2), 0-(ARCROW_HEIGHT/2), 
            lEntityXPos + (ENTITY_WIDTH/2),   (ARCROW_HEIGHT/2),
            pClass));
        lEntityXPos += INTER_ENTITY_SPACING;
    }
    return lGroup;
}

function createSelfRefArc(pClass, pFrom, pYTo) {
    var lPathString = "M" + pFrom.toString() + ", -" +(ARCROW_HEIGHT/5).toString();
    lPathString += " l" + (INTER_ENTITY_SPACING/3).toString() + ",0"; // right
    if (pYTo) {
        if (pYTo < 0 ) {
            lPathString += " l0,-" + (2*(ARCROW_HEIGHT/5)).toString(); // down
        } else {
            lPathString += " l0," + (2*(ARCROW_HEIGHT/5)).toString(); // down
        }
        lPathString += " l0," + pYTo.toString(); // extra down for arcskip
    } else {
        lPathString += " l0," + (2*(ARCROW_HEIGHT/5)).toString(); // down
    }
    lPathString += " l-" + (INTER_ENTITY_SPACING/3).toString() + ",0"; // left
    var lPath = utl.createPath(lPathString, pClass);
    // var lPath = utl.createPath("M"+ pFrom.toString() + ",-5 l40,0 l0,10 l-40,0", pClass);
    return lPath;
}

function createArc (pId, pArc, pFrom, pTo) {
    var lGroup = utl.createGroup(pId);
    var lClass = "";
    var lLabel = pArc.label ? pArc.label : undefined;
    var lArcGradient = ARC_GRADIENT;

    switch(pArc.kind) {
        case ("->"): {
            lClass = "signal";
            break;
        } case ("<-"): {
            lClass = "signal";
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<->"): {
            lClass = "signal-both";
            break;
        } case ("--"): {
            break;
        } case ("=>"): {
            lClass = "method";
            break;
        } case ("<="): {
            lClass = "method";
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<=>"): {
            lClass = "method-both";
            break;
        } case ("=="): {
            break;
        } case (">>"):{
            lClass = "returnvalue";
            break;
        } case ("<<"): {
            lClass = "returnvalue";
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<<>>"):{
            lClass = "returnvalue-both";
            break;
        } case (".."): {
            lClass = "dotted";
            break;
        } case ("=>>"): {
            lClass = "callback";
            break;
        } case ("<<="): {
            lClass = "callback";
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<<=>>"): {
            lClass = "callback-both";
            break;
        } case (":>"): {
            lClass = "emphasised";
            break;
        } case ("<:"): {
            lClass = "emphasised";
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<:>"): {
            lClass = "emphasised-both";
            break;
        } case ("::"): {
            lClass = "double";
            break;
        } case ("-x"): case("-X"): {
            lClass = "lost";
            pTo =  pFrom + (pTo - pFrom)*(3/4);
            break;
        } case ("x-"): case("X-"): {
            lClass = "lost";
            var pTmp = pTo;
            pTo = pFrom;
            pFrom = pTmp;
            pTo =  pFrom + (pTo - pFrom)*(3/4);
            break;
        } default : {
            break;
        }
    }

    if (pFrom === pTo) {
        var lYTo = 0;
        if (pArc.arcskip) {
            lYTo = pArc.arcskip*ARCROW_HEIGHT;
        }
        lLine = createSelfRefArc(lClass, pFrom, lYTo);
        if (lLabel) {
            lGroup.appendChild(
                utl.createText(lLabel,
                           pFrom + 2, -5-(TEXT_HEIGHT/2),
                           "anchor-start"
                           ));
        }
    } else {
        if (pArc.arcskip) {
            lArcGradient = pArc.arcskip*ARCROW_HEIGHT; //TODO: derive from hashmap
        } 
        lLine = utl.createLine(pFrom, 0, pTo, lArcGradient, lClass);
        if (lLabel) {
             var lText = utl.createText(lLabel,
                           pFrom + ((pTo - pFrom)/2),
                           0-(TEXT_HEIGHT/2));
            if (pArc.textcolor) {
                lText.setAttribute("style", "stroke: " + pArc.textcolor + ";");
            }
            lGroup.appendChild(lText);
        }

    }
    if (pArc.linecolor) {
        lLine.setAttribute("style", "stroke: " + pArc.linecolor + ";");
    }

    lGroup.appendChild(lLine);
    /*
    if (lText) {
        lGroup.appendChild(lText);
        if (pArc.textcolor) {
            lText.setAttribute("style", "color: " + pArc.textcolor + ";");
        }
    }
    */
    return lGroup;
}


function createBox (pId, pFrom, pTo, pLabel, pKind) {
    var lWidth = ((pTo - pFrom) + INTER_ENTITY_SPACING - 4);
    var lHeight = ARCROW_HEIGHT - 2 -2;

    var lStart = (pFrom - ((INTER_ENTITY_SPACING - 4)/2));
    var lGroup = utl.createGroup(pId);
    var lBox;

    switch (pKind) {
          case ("rbox") : {
          lBox = utl.createRect(lWidth, lHeight, "box", lStart, (0-lHeight/2), 6, 6);
          break;
        } default : {
          lBox = utl.createRect(lWidth, lHeight, "box", lStart, (0-lHeight/2));
          break;
        }
    }
    lGroup.appendChild(lBox);
    if (pLabel) {
        var lText = utl.createText(pLabel, lStart + (lWidth/2), TEXT_HEIGHT/2);
        lGroup.appendChild(lText);
    }

    return lGroup;
}

function createABox (pId, pFrom, pTo, pLabel) {
    
    var lWidth = ((pTo - pFrom) + INTER_ENTITY_SPACING - 4);
    var lHeight = ARCROW_HEIGHT - 2 -2;

    var lStart = (pFrom - ((INTER_ENTITY_SPACING - 4)/2));
    var lSlopeOffset = 3;
    var lPathString = "M" + lStart + ",0 "; // start
    lPathString += "l" + lSlopeOffset +", -" + lHeight/2;
    lPathString += "l" + (lWidth - 2*lSlopeOffset) + ",0";
    lPathString += "l" + lSlopeOffset + "," + lHeight/2;
    lPathString += "l-" + lSlopeOffset + "," + lHeight/2;
    lPathString += "l-" + (lWidth - 2*lSlopeOffset) + ",0 "; // bottom line
    lPathString += "l-" + lSlopeOffset + ",-" + lHeight/2;

    var lGroup = utl.createGroup(pId);
    var lPath = utl.createPath(lPathString, "box");
    var lText = utl.createText(pLabel, lStart + (lWidth/2), TEXT_HEIGHT/2);
    lGroup.appendChild(lPath);
    lGroup.appendChild(lText);
    return lGroup;
}

function createNote (pId, pFrom, pTo, pLabel) {
    
    var lWidth = ((pTo - pFrom) + INTER_ENTITY_SPACING - 4);
    var lHeight = ARCROW_HEIGHT - 2 -2;

    var lStart = (pFrom - ((INTER_ENTITY_SPACING - 4)/2));
    var lFoldSize = "9";
    var lPathString = "M" + lStart + ",-" + ((ARCROW_HEIGHT -4)/2); // start
    lPathString += "l" + (lWidth - lFoldSize) + ",0 "; // top line
    lPathString += "l0," + lFoldSize + " l" + lFoldSize +",0 m-" + lFoldSize + ",-" + lFoldSize + " l" + lFoldSize + "," +lFoldSize + " "; // fold
    lPathString += "l0," + (lHeight - lFoldSize) + " ";//down
    lPathString += "l-" + lWidth + ",0 "; // bottom line
    lPathString += "l0,-" +lHeight +" ";  // back to home

    var lGroup = utl.createGroup(pId);
    var lPath = utl.createPath(lPathString, "box");
    var lText = utl.createText(pLabel, lStart + (lWidth/2), TEXT_HEIGHT/2);
    lGroup.appendChild(lPath);
    lGroup.appendChild(lText);
    return lGroup;
}

return {
    clean : function () {
                _clean();
            },
    renderParseTree : function (pParseTree) {
                          _renderParseTree(pParseTree);
                      }
};
}); // define
