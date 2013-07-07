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

var TEXT_HEIGHT = 12; /* TODO: should really be derived */


function _clean () {
    utl.cleanElement("msc_source");
    utl.cleanElement("sequence");
    utl.cleanElement("notelayer");
    utl.cleanElement("defs");
}

function _renderParseTree (pParseTree, pSource) {

    INTER_ENTITY_SPACING = DEFAULT_INTER_ENTITY_SPACING;
    ENTITY_WIDTH         = DEFAULT_ENTITY_WIDTH;
    ARCROW_HEIGHT        = DEFAULT_ARCROW_HEIGHT;
    ARC_GRADIENT         = DEFAULT_ARC_GRADIENT;

    if (pParseTree.options) {
        if (pParseTree.options.hscale) {
            INTER_ENTITY_SPACING =
                pParseTree.options.hscale * DEFAULT_INTER_ENTITY_SPACING;
            ENTITY_WIDTH =
                pParseTree.options.hscale * DEFAULT_ENTITY_WIDTH;
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

    if (pSource) {
        var lDescription = document.getElementById("msc_source");
        var lContent = document.createTextNode(pSource);
        lDescription.appendChild(lContent);
    }

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

function renderEntities (pEntities) {
    var defs = document.getElementById("defs");
    var sequence = document.getElementById("sequence");
    var lEntityXPos = 0;
    var i;

    gEntity2X = new Object();

    if (pEntities) {
        for (i=0;i<pEntities.length;i++){
            defs.appendChild(createEntity(pEntities[i].name, pEntities[i]));
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
                        defs.appendChild(createEmptyArcText(lCurrentId,pArcs[i][j]));
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case ("|||"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(createEmptyArcText(lCurrentId,pArcs[i][j]));
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case ("---"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(createComment(lCurrentId,pArcs[i][j]));
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case("box"): case ("rbox"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                            createBox(lCurrentId,
                                        gEntity2X[pArcs[i][j].from],
                                        gEntity2X[pArcs[i][j].to],
                                        pArcs[i][j]));
                        notelayer.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case("abox"):{
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                            createABox(lCurrentId,
                                        gEntity2X[pArcs[i][j].from],
                                        gEntity2X[pArcs[i][j].to], pArcs[i][j]));
                        notelayer.appendChild(utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case("note"): {
                        sequence.appendChild(utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                            createNote(lCurrentId,
                                        gEntity2X[pArcs[i][j].from],
                                        gEntity2X[pArcs[i][j].to], pArcs[i][j]));
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
                                pArcs[i][j].label=lLabel;
                                sequence.appendChild(
                                    createTextLabel(lCurrentId + "_txt", pArcs[i][j],
                                        0, lArcRowYPos-(TEXT_HEIGHT/2), lArcEnd)
                                );
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
                                pArcs[i][j].label=lLabel;
                                sequence.appendChild(
                                    createTextLabel(lCurrentId + "_txt", pArcs[i][j],
                                        0, lArcRowYPos-(TEXT_HEIGHT/2), lArcEnd)
                                );
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

function createEntity (pId, pEntity) {
    var lGroup = utl.createGroup(pId);
    var lRect = utl.createRect(ENTITY_WIDTH, ENTITY_HEIGHT);
    
    if (!(pEntity.label)) {
        pEntity.label = pEntity.name;
    }
    colorBox(lRect, pEntity);
    lGroup.appendChild(lRect);
    lGroup.appendChild(
            createTextLabel(pId + "_txt", pEntity,
                0, (ENTITY_HEIGHT + TEXT_HEIGHT -8 )/2,
                ENTITY_WIDTH, "entity")); /* TODO: -8 should really be derived */

    // lText.setAttribute("id", pId + "t");
    // var bbox = lText.getBBox();
    // var TEXT_HEIGHT = bbox.height;
    // var lTextWidth = bbox.width;

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

function createSelfRefArc(pClass, pFrom, pYTo, pDouble) {
    var lHeight = 2*(ARCROW_HEIGHT/5);
    var lWidth  = INTER_ENTITY_SPACING/3;

    var lPathString = "M" + pFrom.toString() + ", -" +(ARCROW_HEIGHT/5).toString();
    lPathString += " l" + lWidth.toString() + ",0"; // right
    if (pYTo < 0 ) {
        lPathString += " l0,-" + lHeight.toString(); // down
    } else {
        lPathString += " l0," + lHeight.toString(); // down
    }
    lPathString += " l0," + pYTo.toString(); // extra down for arcskip
    lPathString += " l-" + lWidth.toString() + ",0"; // left
    
    return lutl.createPath(lPathString, pClass);
}

function createArc (pId, pArc, pFrom, pTo) {
    var lGroup = utl.createGroup(pId);
    var lClass = "";
    var lLabel = pArc.label ? pArc.label : undefined;
    var lArcGradient = ARC_GRADIENT;
    var lDoubleLine = false;

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
            lDoubleLine = true;
            break;
        } case ("<:"): {
            lClass = "emphasised";
            lDoubleLine = true;
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<:>"): {
            lDoubleLine = true;
            lClass = "emphasised-both";
            break;
        } case ("::"): {
            lClass = "double";
            lDoubleLine = true;
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

    var lYTo = 0;
    if (pArc.arcskip) {
        lYTo = pArc.arcskip*ARCROW_HEIGHT; /* TODO: derive from hashmap */
        lArcGradient = lYTo;
    } 
    if (pFrom === pTo) {
        lLine = createSelfRefArc(lClass, pFrom, lYTo, lDoubleLine);
        lGroup.appendChild(
            createTextLabel(pId + "_txt", pArc, pFrom +2 , 0-(ARCROW_HEIGHT/5)-(TEXT_HEIGHT/2), pTo - pFrom , "anchor-start", false)
        );
    } else {
        lLine = utl.createLine(pFrom, 0, pTo, lArcGradient, lClass, lDoubleLine);
        lGroup.appendChild(
            createTextLabel(pId + "_txt", pArc, pFrom, 0-(TEXT_HEIGHT/2), pTo - pFrom)
        );

    }
    if (pArc.linecolor) {
        lLine.setAttribute("style", "stroke: " + pArc.linecolor + ";");
    }

    lGroup.appendChild(lLine);
    return lGroup;
}


function createTextLabel (pId, pArc, pStartX, pStartY, pWidth, pClass, pCenter) {
    var lGroup = utl.createGroup(pId);

    if (pArc.label) {
        var lMiddle = pStartX + (pWidth/2);
        var lTextWidth = utl.getTextWidth(pArc.label);
        var lHeight = ARCROW_HEIGHT - 2 -2;

        var lText = utl.createText(pArc.label, lMiddle, pStartY + TEXT_HEIGHT/4, pClass, pArc.url, pArc.id, pArc.idurl);
        if ( pCenter == undefined || pCenter === true) {
            var lRect =
                utl.createRect(lTextWidth,TEXT_HEIGHT, "textbg",
                        lMiddle - (lTextWidth/2),  pStartY - (TEXT_HEIGHT/2));
        } else {
            var lRect =
                utl.createRect(lTextWidth,TEXT_HEIGHT, "textbg",
                        pStartX,  pStartY - (TEXT_HEIGHT/2));
        }
        colorText(lText, pArc);
        if (pArc.textbgcolor) {
            lRect.setAttribute("style", "fill: " + pArc.textbgcolor + "; stroke:" + pArc.textbgcolor + ";");
        }
        if (pArc.url && !pArc.textcolor) {
            pArc.textcolor = "blue";
            colorText(lText, pArc);
        }
        lGroup.appendChild(lRect);
        lGroup.appendChild(lText);

    }
    return lGroup;
}

function createEmptyArcText (pId, pArc) {
    var lArcEnd = gEntityXHWM - INTER_ENTITY_SPACING + ENTITY_WIDTH;
    var lArcMiddle = lArcEnd / 2;
    var lGroup = utl.createGroup(pId);

    lGroup.appendChild(createTextLabel(pId, pArc, 0, 0, lArcEnd));
                
    return lGroup;
}

function createComment (pId, pArc) {
    var lArcEnd = gEntityXHWM - INTER_ENTITY_SPACING + ENTITY_WIDTH;
    var lGroup = utl.createGroup(pId);
    var lLine = utl.createLine(0, 0, lArcEnd, 0, "dotted");
    lGroup.appendChild(lLine);
    lGroup.appendChild(createEmptyArcText(pId + "_txt", pArc));

    if (pArc.linecolor) {
        lLine.setAttribute("style", "stroke: " + pArc.linecolor + ";");
    }

    return lGroup;
}
function colorText (pElement, pArc){
    if (pArc.textcolor) {
        var lStyleString = new String();
        lStyleString += "fill:" + pArc.textcolor + ";"
        lStyleString += "stroke:" + pArc.textcolor + ";"
        pElement.setAttribute("style", lStyleString);
    }
}

function colorBox (pElement, pArc) {
    var lStyleString = new String();
    if (pArc.textbgcolor) {
        lStyleString += "fill:" + pArc.textbgcolor + ";"
    }
    if (pArc.linecolor) {
        lStyleString += "stroke:" + pArc.linecolor + ";"
    }
    pElement.setAttribute("style", lStyleString);
}

function createBox (pId, pFrom, pTo, pArc) {
    var lWidth = ((pTo - pFrom) + INTER_ENTITY_SPACING - 4);
    var lHeight = ARCROW_HEIGHT - 2 -2;

    var lStart = (pFrom - ((INTER_ENTITY_SPACING - 4)/2));
    var lGroup = utl.createGroup(pId);
    var lBox;

    switch (pArc.kind) {
          case ("rbox") : {
          lBox = utl.createRect(lWidth, lHeight, "box", lStart, (0-lHeight/2), 6, 6);
          break;
        } default : {
          lBox = utl.createRect(lWidth, lHeight, "box", lStart, (0-lHeight/2));
          break;
        }
    }
    colorBox (lBox, pArc);
    lGroup.appendChild(lBox);
    lGroup.appendChild(createTextLabel(pId + "_txt", pArc, lStart, 0, lWidth));

    return lGroup;
}

function createABox (pId, pFrom, pTo, pArc) {
    
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
    colorBox(lPath, pArc);
    lGroup.appendChild(lPath);
    lGroup.appendChild(createTextLabel(pId + "_txt", pArc, lStart, 0, lWidth));

    return lGroup;
}

function createNote (pId, pFrom, pTo, pArc) {
    
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
    colorBox(lPath, pArc);
    lGroup.appendChild(lPath);
    lGroup.appendChild(createTextLabel(pId + "_txt", pArc, lStart, 0, lWidth));
    
    return lGroup;
}

return {
    clean : function () {
                _clean();
            },
    renderParseTree : function (pParseTree, pSource) {
                          _renderParseTree(pParseTree, pSource);
                      }
};
}); // define
