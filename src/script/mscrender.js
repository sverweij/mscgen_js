/*
 * renders an abstract syntax tree of a sequence chart
 *
 * knows of:
 *  - the syntax tree
 *  - the target canvas
 *
 * Defines default sizes and distances for all objects.
 */
define(["mscrenderutensils"], function(utl) {

var PAD_VERTICAL = 3;
var PAD_HORIZONTAL = 3;
var DEFAULT_INTER_ENTITY_SPACING = 160;
var INTER_ENTITY_SPACING = DEFAULT_INTER_ENTITY_SPACING;
var DEFAULT_ENTITY_WIDTH = 100;
var ENTITY_WIDTH = DEFAULT_ENTITY_WIDTH;
var ENTITY_HEIGHT = 30;
var DEFAULT_ARCROW_HEIGHT = 25;
var LINE_WIDTH = 2; // TODO: === to use in the css
var ARCROW_HEIGHT = DEFAULT_ARCROW_HEIGHT;
var DEFAULT_ARC_GRADIENT = 0;
var ARC_GRADIENT = DEFAULT_ARC_GRADIENT;

var DIR_LTR  = 2;
var DIR_RTL  = 3;
var DIR_BOTH = 5;
var DIR_NONE = 8;

var gEntityXHWM = 0;
var gArcRowYHWM = 0;
var gEntity2X = new Object();
var gArcRow2Y = new Object();
var gEntity2ArcColor = new Object();
var TEXT_HEIGHT = 12; /* TODO: should really be derived */


function _clean (pParentElementId) {
    lChildElement = document.getElementById("svg_output")
    if (lChildElement &&
            (lChildElement !== null) &&
            (lChildElement !== undefined)) {
        lParentElement = document.getElementById(pParentElementId);
        lParentElement.removeChild(lChildElement);
    }
}

function bootstrap(pParentElementId, pSvgElementId) {
    var SVGNS = new String ("http://www.w3.org/2000/svg");
    var XLINKNS = new String ("http://www.w3.org/1999/xlink");

    var lParent = document.getElementById(pParentElementId);
    var lSkeletonSvg = document.createElementNS(SVGNS, "svg");
    lSkeletonSvg.setAttribute("version", "1.1");
    lSkeletonSvg.setAttribute("id", pSvgElementId);
    lSkeletonSvg.setAttribute("xmlns", SVGNS);
    lSkeletonSvg.setAttribute("xmlns:xlink", XLINKNS);
    var lDesc = document.createElementNS(SVGNS, "desc");
    lDesc.setAttribute("id", "msc_source");
    var lDefs = document.createElementNS(SVGNS, "defs");

    var lStyle = document.createElement("style");
    lStyle.setAttribute("type", "text/css");
    lStyle.appendChild(document.createTextNode(gSvgStyleElementString));

    lDefs.appendChild(lStyle);
    // TODO : lDefs.appendChild( - zootje markers - );
    lDefs.appendChild(
            utl.createMarkerPath("signal", "arrow-marker", "auto",
            "M0,0 l-8,2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("signal-l", "arrow-marker", "auto",
            "M0,0 l8,2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPolygon("method", "arrow-marker", "auto",
            "-8,2 0,0, -8,-2", "filled arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPolygon("method-l", "arrow-marker", "auto",
            "8,2 0,0, 8,-2", "filled arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("returnvalue", "arrow-marker", "auto",
            "M0,0 l-8,2 M0,0 l-8,-2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("returnvalue-l", "arrow-marker", "auto",
            "M0,0 l8,2 M0,0 l8,-2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("callback", "arrow-marker", "auto",
            "M0,0 l-8,2 M0,0 l-8,-2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("callback-l", "arrow-marker", "auto",
            "M0,0 l8,2 M0,0 l8,-2", "arrow-style"));

    lDefs.appendChild(
            utl.createMarkerPath("lost", "arrow-marker", "auto",
            "M-2.5,-2.5 L2.5,2.5 M-2.5,2.5 L2.5,-2.5", "arrow-style"));
    lDefs.appendChild(utl.createGroup("defs"));

    lSkeletonSvg.appendChild(lDesc);
    lSkeletonSvg.appendChild(lDefs);
    var lBody = utl.createGroup("body");
    lBody.appendChild(utl.createGroup("sequence"));
    lBody.appendChild(utl.createGroup("notelayer"));
    lSkeletonSvg.appendChild(lBody);
    lParent.appendChild(lSkeletonSvg);
}

function _renderAST (pAST, pSource, pParentElementId) {

    bootstrap(pParentElementId, "svg_output");

    INTER_ENTITY_SPACING = DEFAULT_INTER_ENTITY_SPACING;
    ENTITY_WIDTH         = DEFAULT_ENTITY_WIDTH;
    ARCROW_HEIGHT        = DEFAULT_ARCROW_HEIGHT;
    ARC_GRADIENT         = DEFAULT_ARC_GRADIENT;

    if (pAST.options) {
        if (pAST.options.hscale) {
            INTER_ENTITY_SPACING =
                pAST.options.hscale * DEFAULT_INTER_ENTITY_SPACING;
            ENTITY_WIDTH =
                pAST.options.hscale * DEFAULT_ENTITY_WIDTH;
        }
        if (pAST.options.arcgradient) {
            ARCROW_HEIGHT =
                parseInt(pAST.options.arcgradient) + DEFAULT_ARCROW_HEIGHT;
            ARC_GRADIENT = 
                parseInt(pAST.options.arcgradient) + DEFAULT_ARC_GRADIENT;
        }
    }

    renderEntities(pAST.entities);
    renderArcs(pAST.arcs, pAST.entities);

    var body = document.getElementById("body");
    var lCanvasWidth = gEntityXHWM -  2*PAD_HORIZONTAL + INTER_ENTITY_SPACING/4;
    var lCanvasHeight = gArcRowYHWM - (ARCROW_HEIGHT/2) + 2*PAD_VERTICAL;
    var lSvgElement = document.getElementById("svg_output");

    // TODO: factor down
    if (pSource) {
        var lDescription = document.getElementById("msc_source");
        var lContent = document.createTextNode(pSource);
        lDescription.appendChild(lContent);
    }

    body.setAttribute("transform",
            "translate("+ (PAD_HORIZONTAL + (INTER_ENTITY_SPACING/4)) + ","+ PAD_VERTICAL +")");
    lSvgElement.setAttribute("width", lCanvasWidth.toString());
    lSvgElement.setAttribute("height", lCanvasHeight.toString());

    if (pAST.options && pAST.options.width) {
        var lTransform = body.getAttribute("transform");
        lTransform += " scale(" + (pAST.options.width/lCanvasWidth) + ",1)";
        body.setAttribute ("transform", lTransform);
    }
}

function renderEntities (pEntities) {
    var defs = document.getElementById("defs");
    var sequence = document.getElementById("sequence");
    var lEntityXPos = 0;
    var i;

    gEntity2X = new Object();
    gEntity2ArcColor = new Object();
    var arcColors = new Object();

    if (pEntities) {
        for (i=0;i<pEntities.length;i++){
            arcColors = {};
            defs.appendChild(renderEntity(pEntities[i].name, pEntities[i]));
            sequence.appendChild(
                utl.createUse(lEntityXPos,0,pEntities[i].name));
            gEntity2X[pEntities[i].name] = lEntityXPos + (ENTITY_WIDTH/2);
            lEntityXPos += INTER_ENTITY_SPACING;
            pEntities[i].arclinecolor ? 
                arcColors.arclinecolor = pEntities[i].arclinecolor : null;
            pEntities[i].arctextcolor ? 
                arcColors.arctextcolor = pEntities[i].arctextcolor : null;
            pEntities[i].arctextbgcolor ? 
                arcColors.arctextbgcolor = pEntities[i].arctextbgcolor : null;
            gEntity2ArcColor[pEntities[i].name] = arcColors;
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

    defs.appendChild(renderArcRow(pEntities, "arcrow"));
    defs.appendChild(renderArcRow(pEntities, "arcrowomit"));

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
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, "arcrowomit"));
                        defs.appendChild(
                                createEmptyArcText(lCurrentId,pArcs[i][j]));
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case ("|||"): {
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                                createEmptyArcText(lCurrentId,pArcs[i][j]));
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case ("---"): {
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                                createComment(lCurrentId,pArcs[i][j]));
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    case("box"): case("rbox"): case("abox") : case("note"): {
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, "arcrow"));
                        defs.appendChild(
                            createBox(lCurrentId,
                                        gEntity2X[pArcs[i][j].from],
                                        gEntity2X[pArcs[i][j].to],
                                        pArcs[i][j]));
                        notelayer.appendChild(
                                utl.createUse(0, lArcRowYPos, lCurrentId));
                        break;
                        }
                    default:{
                        sequence.appendChild(
                                utl.createUse(0, lArcRowYPos, "arcrow"));
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
                                        sequence.appendChild(
                                                utl.createUse(0, lArcRowYPos, lCurrentId + "bc" + k));
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

function renderEntity (pId, pEntity) {
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
    return lGroup;
}

function renderArcRow(pEntities, pClass) {
    var i = 0;
    var lGroup = utl.createGroup(pClass); // passing pClass as pId here
    var lEntityXPos = 0;

    for (i=0;i<pEntities.length;i++){
        var lLine = utl.createLine (
            lEntityXPos + (ENTITY_WIDTH/2), 0-(ARCROW_HEIGHT/2), 
            lEntityXPos + (ENTITY_WIDTH/2),   (ARCROW_HEIGHT/2),
            pClass);
        if (pEntities[i].linecolor) {
            lLine.setAttribute("style", "stroke : " + pEntities[i].linecolor + ";");
        }
        lGroup.appendChild(lLine);
        lEntityXPos += INTER_ENTITY_SPACING;
    }
    return lGroup;
}

function createSelfRefArc(pClass, pFrom, pYTo, pDouble) {
    var lHeight = 2*(ARCROW_HEIGHT/5);
    var lWidth  = INTER_ENTITY_SPACING/3;
    var lSign = (pYTo < 0) ? -1 : 1;

    var lGroup = utl.createGroup("selfie");
    if (pDouble){
        lGroup.appendChild(utl.createUTurn(pFrom, (lHeight-4)/2, (pYTo - 2 + lHeight) /*lSign*lHeight*/, lWidth-4, "none"));
        lGroup.appendChild(utl.createUTurn(pFrom, (lHeight+4)/2, (pYTo + 6 + lHeight) /*lSign*lHeight*/, lWidth, pClass));
    } else {
        lGroup.appendChild(utl.createUTurn(pFrom, lHeight/2, (pYTo + lHeight) /*lSign*lHeight*/, lWidth, pClass));
    }
    return lGroup;
}

function arcColorOverride (pArc) {
    if (pArc.direction && pArc.from && pArc.to) {
        var lFrom =
            (pArc.direction === DIR_RTL) ? pArc.to : pArc.from;

        if (gEntity2ArcColor[lFrom] ) {
            (!(pArc.linecolor) && gEntity2ArcColor[lFrom].arclinecolor) ?
                pArc.linecolor = gEntity2ArcColor[lFrom].arclinecolor : 0;
            (!(pArc.textcolor) && gEntity2ArcColor[lFrom].arctextcolor) ?
                pArc.textcolor = gEntity2ArcColor[lFrom].arctextcolor : 0;
            (!(pArc.textbgcolor) && gEntity2ArcColor[lFrom].arctextbgcolor) ?
                pArc.textbgcolor = gEntity2ArcColor[lFrom].arctextbgcolor : 0;
        }
    }
    return pArc;
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
            pArc.direction = DIR_LTR;
            break;
        } case ("<-"): {
            lClass = "signal";
            pArc.direction = DIR_RTL;
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<->"): {
            lClass = "signal-both";
            pArc.direction = DIR_BOTH;
            break;
        } case ("--"): {
            pArc.direction = DIR_NONE;
            break;
        } case ("=>"): {
            lClass = "method";
            pArc.direction = DIR_LTR;
            break;
        } case ("<="): {
            lClass = "method";
            pArc.direction = DIR_RTL;
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<=>"): {
            lClass = "method-both";
            pArc.direction = DIR_BOTH;
            break;
        } case ("=="): {
            pArc.direction = DIR_NONE;
            break;
        } case (">>"):{
            lClass = "returnvalue";
            pArc.direction = DIR_LTR;
            break;
        } case ("<<"): {
            lClass = "returnvalue";
            pArc.direction = DIR_RTL;
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<<>>"):{
            lClass = "returnvalue-both";
            pArc.direction = DIR_BOTH;
            break;
        } case (".."): {
            lClass = "dotted";
            pArc.direction = DIR_NONE;
            break;
        } case ("=>>"): {
            lClass = "callback";
            pArc.direction = DIR_LTR;
            break;
        } case ("<<="): {
            lClass = "callback";
            pArc.direction = DIR_RTL;
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<<=>>"): {
            lClass = "callback-both";
            pArc.direction = DIR_BOTH;
            break;
        } case (":>"): {
            lClass = "emphasised";
            pArc.direction = DIR_LTR;
            lDoubleLine = true;
            break;
        } case ("<:"): {
            lClass = "emphasised";
            pArc.direction = DIR_RTL;
            lDoubleLine = true;
            var pTmp = pTo; pTo = pFrom; pFrom = pTmp;
            break;
        } case ("<:>"): {
            lDoubleLine = true;
            pArc.direction = DIR_BOTH;
            lClass = "emphasised-both";
            break;
        } case ("::"): {
            lClass = "double";
            pArc.direction = DIR_NONE;
            lDoubleLine = true;
            break;
        } case ("-x"): case("-X"): {
            lClass = "lost";
            pArc.direction = DIR_LTR;
            pTo =  pFrom + (pTo - pFrom)*(3/4);
            break;
        } case ("x-"): case("X-"): {
            lClass = "lost";
            pArc.direction = DIR_RTL;
            var pTmp = pTo;
            pTo = pFrom;
            pFrom = pTmp;
            pTo =  pFrom + (pTo - pFrom)*(3/4);
            break;
        } default : {
            pArc.direction = DIR_NONE;
            break;
        }
    }
    pArc = arcColorOverride (pArc);

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


function unescapeString(pString) {
    var lLabel = pString.replace (/\\\"/g, '"');
    return lLabel.replace(/\\n/g, " ");
}

function createTextLabel (pId, pArc, pStartX, pStartY, pWidth, pClass, pCenter) {
    var lGroup = utl.createGroup(pId);

    if (pArc.label) {
        var lMiddle = pStartX + (pWidth/2);
        var lTextWidth = utl.getTextWidth(pArc.label);
        var lHeight = ARCROW_HEIGHT - 2*LINE_WIDTH;
        pArc.label = unescapeString(pArc.label);
        pArc.id = pArc.id ? unescapeString(pArc.id) : undefined;

        var lText = utl.createText(pArc.label, lMiddle, pStartY + TEXT_HEIGHT/4, pClass, pArc.url, pArc.id, pArc.idurl);
        if ( pCenter === undefined || pCenter === true) {
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
    if (pFrom > pTo) {
        var lTmp = pFrom; pFrom = pTo; pTo = lTmp;
    }

    var lWidth = ((pTo - pFrom) + INTER_ENTITY_SPACING - 2*LINE_WIDTH);
    var lHeight = ARCROW_HEIGHT - 2*LINE_WIDTH;

    var lStart = (pFrom - ((INTER_ENTITY_SPACING - 2*LINE_WIDTH)/2));
    var lGroup = utl.createGroup(pId);
    var lBox;

    switch (pArc.kind) {
          case ("rbox") : {
          lBox = utl.createRect(lWidth, lHeight, "box", lStart, (0-lHeight/2), 6, 6);
          break;
        } case ("abox") : {
          lBox = utl.createABox(lWidth, lHeight, "box", lStart, 0);// (0-lHeight/2));
          break;
        } case ("note") : {
          lBox = utl.createNote(lWidth, lHeight, "box", lStart, (0-lHeight/2));
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


gSvgStyleElementString = 
"svg { \
    font-family: Helvetica, sans-serif; \
    font-size: 9pt; \
    background-color: white; \
    stroke : black; \
    color  : black; \
} \
rect { \
    fill: none; \
    stroke: inherit; \
    stroke-width: 2; \
} \
rect.textbg { \
    fill:white; \
    stroke:white; \
    stroke-width:0; \
} \
line { \
    stroke: inherit; \
    stroke-width: 2; \
} \
.arcrowomit { \
    stroke-dasharray: 2,2; \
} \
text { \
    color: inherit; \
    stroke: inherit; \
    text-anchor: middle; \
    stroke-width:0.1; /* makes font seem more crisp */ \
} \
text.entity { \
    text-decoration : underline; \
} \
text.anchor-start { \
    text-anchor: start; \
} \
path { \
    stroke : inherit; \
    stroke-width : 2; \
    fill : none; \
} \
.dotted { \
    stroke-dasharray: 5,2; \
} \
.arrow-marker { \
    overflow:visible; \
} \
.arrow-style { \
    stroke-dasharray : 100,1; /* 'none' should work, but doesn't in webkit */ \
    stroke-width : 1; \
} \
.filled { \
    stroke:inherit; \
    fill:black; /* no-inherit */ \
} \
.signal { \
    marker-end : url(#signal); \
} \
.signal-both { \
    marker-end : url(#signal); \
    marker-start : url(#signal-l); \
} \
.method { \
    marker-end : url(#method); \
} \
.method-both { \
    marker-end : url(#method); \
    marker-start : url(#method-l); \
} \
.returnvalue { \
    stroke-dasharray: 5,2; \
    marker-end : url(#returnvalue); \
} \
.returnvalue-both { \
    stroke-dasharray: 5,2; \
    marker-end : url(#returnvalue); \
    marker-start : url(#returnvalue-l); \
} \
.callback { \
    marker-end : url(#callback); \
} \
.callback-both { \
    marker-end : url(#callback); \
    marker-start : url(#callback-l); \
} \
.emphasised { \
    marker-end : url(#method); \
} \
.emphasised-both { \
    marker-end : url(#method); \
    marker-start : url(#method-l); \
} \
.lost { \
    marker-end : url(#lost); \
} \
.arcrowomit { \
    stroke-dasharray: 2,2; \
} \
.box { \
    /* fill: #ffc;  no-inherit */ \
    fill : white; \
    opacity: 0.9; \
} \
.boxtext, .arctext { \
    font-size: 0.8em; \
    text-anchor: middle; \
} \
.comment { \
    stroke-dasharray: 5,2; \
}"; 
return {
    clean : function (pParentElementId) {
                _clean(pParentElementId);
            },
    renderAST : function (pAST, pSource, pParentElementId) {
                          _renderAST(pAST, pSource, pParentElementId);
                      }
};
}); // define
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
