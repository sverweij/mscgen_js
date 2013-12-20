/*
 * renders an abstract syntax tree of a sequence chart
 *
 * knows of:
 *  - the syntax tree
 *  - the target canvas
 *
 * Defines default sizes and distances for all objects.

issue #13
To get markers to work in canvg and to color them the same color as 
the associate line, we'll need to do something like this:

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
<g transform="translate(10,20)">
<defs>
<marker viewBox="0 0 10 10" id="end" refX="9" refY="3" markerUnits="strokeWidth" markerWidth="10" markerHeight="10" orient="auto">
<path d="M 1 1 l 8 2 l -8 2 " fill="none" stroke="#ABCDEF" stroke-width="1"/>
</marker>
</defs>
  <line x1="50" y1="20" x2="210" y2="20" stroke-width="2" stroke="#ABCDEF" marker-end="url(#end)"/>
</g>
</svg>

@author Sander Verweij 
 */

/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint trailing:true */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./renderutensils", "./node/textutensils", "./node/flatten", "./node/dotmap"], function(utl, txt, flatten, map) {

var PAD_VERTICAL = 3;
var PAD_HORIZONTAL = 3;
var DEFAULT_INTER_ENTITY_SPACING = 160;
var INTER_ENTITY_SPACING = DEFAULT_INTER_ENTITY_SPACING;
var DEFAULT_ENTITY_WIDTH = 100;
var ENTITY_WIDTH = DEFAULT_ENTITY_WIDTH;
var DEFAULT_ENTITY_HEIGHT = 34;
var ENTITY_HEIGHT = DEFAULT_ENTITY_HEIGHT;
var DEFAULT_ARCROW_HEIGHT = 38;
var LINE_WIDTH = 2; // TODO: === to use in the css
var ARCROW_HEIGHT = DEFAULT_ARCROW_HEIGHT;
var DEFAULT_ARC_GRADIENT = 0;
var ARC_GRADIENT = DEFAULT_ARC_GRADIENT;
var WORDWRAPARCS = false;

var gEntityXHWM = 0;
var gEntity2X = {};
var gEntity2ArcColor = {};
var gTextHeight = 12; /* sensible default - gets overwritten in bootstrap */
var gRowInfo = [];
var gDocument;

function clearRowInfo(){
    gRowInfo = [];
}

function getRowInfo (pRowNumber){
    if (gRowInfo[pRowNumber]) {
        return gRowInfo[pRowNumber];
    } else {
        return {
                y: (ENTITY_HEIGHT + (1.5*ARCROW_HEIGHT)) + pRowNumber*ARCROW_HEIGHT,
                height: ARCROW_HEIGHT
        };
    }
}

function setRowInfo (pRowNumber, pHeight, pY){
    if (pHeight === undefined || pHeight < ARCROW_HEIGHT){
        pHeight = ARCROW_HEIGHT;
    }
    if (pY === undefined){
        var lPreviousRowInfo = getRowInfo(pRowNumber - 1);
        if (lPreviousRowInfo && lPreviousRowInfo.y > 0){
            pY = lPreviousRowInfo.y + (lPreviousRowInfo.height + pHeight)/2;
        } else { // TODO: this might be overkill
            pY = (ENTITY_HEIGHT + (1.5*ARCROW_HEIGHT)) + pRowNumber*ARCROW_HEIGHT;
        }
    }
    gRowInfo[pRowNumber] = {y:pY, height: pHeight};
}

function init (pWindow){
    if ("object" !== typeof (document)) {
        gDocument = pWindow.document;
    } else {
        gDocument = window.document;
    }
    utl.init(gDocument);
}

function _clean (pParentElementId, pWindow) {
    init(pWindow);
    var lChildElement = gDocument.getElementById("__svg_output");
    if (lChildElement &&
            (lChildElement !== null) &&
            (lChildElement !== undefined)) {
        var lParentElement = gDocument.getElementById(pParentElementId);
        lParentElement.removeChild(lChildElement);
    }
}

function bootstrap(pParentElementId, pSvgElementId, pWindow) {
    var SVGNS = "http://www.w3.org/2000/svg";
    var XLINKNS = "http://www.w3.org/1999/xlink";
    
    init(pWindow);

    var lParent = gDocument.getElementById(pParentElementId);
    if (lParent === null){
        lParent = gDocument.body;
    }

    var lSkeletonSvg = gDocument.createElementNS(SVGNS, "svg");
    lSkeletonSvg.setAttribute("version", "1.1");
    lSkeletonSvg.setAttribute("id", pSvgElementId);
    lSkeletonSvg.setAttribute("xmlns", SVGNS);
    lSkeletonSvg.setAttribute("xmlns:xlink", XLINKNS);
    var lDesc = gDocument.createElementNS(SVGNS, "desc");
    lDesc.setAttribute("id", "__msc_source");
    var lDefs = gDocument.createElementNS(SVGNS, "defs");

    var lStyle = gDocument.createElement("style");
    lStyle.setAttribute("type", "text/css");
    lStyle.appendChild(gDocument.createTextNode(gSvgStyleElementString));

    lDefs.appendChild(lStyle);
    lDefs.appendChild(
            utl.createMarkerPath("signal", "arrow-marker", "auto",
            "M 9 3 l -8 2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("signal-u", "arrow-marker", "auto",
            "M 9 3 l -8 -2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("signal-l", "arrow-marker", "auto",
            "M 9 3 l 8 2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("signal-lu", "arrow-marker", "auto",
            "M 9 3 l 8 -2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPolygon("method", "arrow-marker", "auto",
            "1,1 9,3 1,5", "filled arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPolygon("method-l", "arrow-marker", "auto",
            "17,1 9,3 17,5", "filled arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("callback", "arrow-marker", "auto",
            "M 1 1 l 8 2 l -8 2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("callback-l", "arrow-marker", "auto",
            "M 17 1 l -8 2 l 8 2", "arrow-style"));
    lDefs.appendChild(
            utl.createMarkerPath("lost", "arrow-marker", "auto",
            "M6.5,-0.5 L11.5,5.5 M6.5,5.5 L11.5,-0.5", "arrow-style"));

    lDefs.appendChild(utl.createGroup("__defs"));

    lSkeletonSvg.appendChild(lDesc);
    lSkeletonSvg.appendChild(lDefs);
    var lBody = utl.createGroup("__body");
    
    lBody.appendChild(utl.createGroup("__background"));
    
    lBody.appendChild(utl.createGroup("__arcspanlayer"));
    lBody.appendChild(utl.createGroup("__lifelinelayer"));
    lBody.appendChild(utl.createGroup("__sequencelayer"));
    lBody.appendChild(utl.createGroup("__notelayer"));
    lSkeletonSvg.appendChild(lBody);
    lParent.appendChild(lSkeletonSvg);

    gTextHeight = utl.getBBox(utl.createText("ÁjyÎ9ƒ@", 0,0)).height;
}

function _renderAST (pAST, pSource, pParentElementId, pWindow) {

    bootstrap(pParentElementId, "__svg_output", pWindow);

    INTER_ENTITY_SPACING = DEFAULT_INTER_ENTITY_SPACING;
    ENTITY_HEIGHT        = DEFAULT_ENTITY_HEIGHT;
    ENTITY_WIDTH         = DEFAULT_ENTITY_WIDTH;
    ARCROW_HEIGHT        = DEFAULT_ARCROW_HEIGHT;
    ARC_GRADIENT         = DEFAULT_ARC_GRADIENT;
    WORDWRAPARCS         = false;

    if (pAST.options) {
        if (pAST.options.hscale) {
            INTER_ENTITY_SPACING =
                pAST.options.hscale * DEFAULT_INTER_ENTITY_SPACING;
            ENTITY_WIDTH =
                pAST.options.hscale * DEFAULT_ENTITY_WIDTH;
        }
        if (pAST.options.arcgradient) {
            ARCROW_HEIGHT =
                parseInt(pAST.options.arcgradient, 10) + DEFAULT_ARCROW_HEIGHT;
            ARC_GRADIENT =
                parseInt(pAST.options.arcgradient, 10) + DEFAULT_ARC_GRADIENT;
        }
        if (pAST.options.wordwraparcs && pAST.options.wordwraparcs === "true"){
            WORDWRAPARCS = true;
        }
    }
    pAST = flatten.flatten(pAST);
    renderEntities(pAST.entities);
    renderArcs(pAST.arcs, pAST.entities);

    var body = gDocument.getElementById("__body");
    var lCanvasWidth = gEntityXHWM -  2*PAD_HORIZONTAL + INTER_ENTITY_SPACING/4;
    
    var lNoArcs = pAST.arcs ? pAST.arcs.length: 0;
    var lRowInfo = getRowInfo(lNoArcs - 1);
    
    var lCanvasHeight = lRowInfo.y + (lRowInfo.height/2) + 2*PAD_VERTICAL;
    var lHorizontalTransform = (PAD_HORIZONTAL + (INTER_ENTITY_SPACING/4));
    var lVerticalTransform = PAD_VERTICAL;
    var lScale = 1;
    var lSvgElement = gDocument.getElementById("__svg_output");

    // TODO: factor down
    if (pSource) {
        var lDescription = gDocument.getElementById("__msc_source");
        var lContent = gDocument.createTextNode("\n\n# Generated by mscgen_js - http://sverweij.github.io/mscgen_js\n" + pSource);
        lDescription.appendChild(lContent);
    }
    
    /* canvg ignores the background-color on svg level and makes the background 
     * transparent in stead. To work around this insert a white rectangle the size
     * of the canvas in the background layer.
     * 
     * We do this _before_ scaling is applied to the svg
     */
    var lBgGroup = gDocument.getElementById("__background");
    var lBgRect = utl.createRect(lCanvasWidth , lCanvasHeight, "bglayer", 0 - lHorizontalTransform, 0 - lVerticalTransform);
    lBgGroup.appendChild(lBgRect);

    if (pAST.options && pAST.options.width) {
        lScale =  (pAST.options.width/lCanvasWidth);
        lCanvasWidth *= lScale;
        lCanvasHeight *= lScale;
        lHorizontalTransform *= lScale;
        lVerticalTransform *= lScale;
    }

    body.setAttribute("transform",
        "translate("+ lHorizontalTransform + ","+ lVerticalTransform +")" +
        " scale(" + lScale + "," + lScale + ")");
    lSvgElement.setAttribute("width", lCanvasWidth.toString());
    lSvgElement.setAttribute("height", lCanvasHeight.toString());

}


function getMaxEntityHeight(pEntities) {
    /* crude method for determining the max entity height; create all entities,
     * measure the max, and than re-render using the max thus gotten
     */
    var lHWM = ENTITY_HEIGHT;
    var lEntityMemory = [];
    var i = 0;
    
    for ( i = 0; i < pEntities.length; i++) {
        lEntityMemory[i] = renderEntity(pEntities[i].name, pEntities[i]);
        var lHeight = utl.getBBox(lEntityMemory[i]).height;
        if (lHeight > lHWM) {
            lHWM = lHeight;
        }
    }
    return lHWM;
}


function renderEntities (pEntities) {
    var defs = gDocument.getElementById("__defs");
    var sequence = gDocument.getElementById("__sequencelayer");
    var lEntityXPos = 0;
    var i;

    gEntity2X = {};
    gEntity2ArcColor = {};
    var arcColors = {};
    
    if (pEntities) {
        ENTITY_HEIGHT = getMaxEntityHeight(pEntities) + LINE_WIDTH*2;
        for (i=0;i<pEntities.length;i++){
            arcColors = {};
            defs.appendChild(renderEntity(pEntities[i].name, pEntities[i]));
            sequence.appendChild(
                utl.createUse(lEntityXPos,0,pEntities[i].name));
            gEntity2X[pEntities[i].name] = lEntityXPos + (ENTITY_WIDTH/2);
            lEntityXPos += INTER_ENTITY_SPACING;
            if (pEntities[i].arclinecolor) {
                arcColors.arclinecolor = pEntities[i].arclinecolor;
            }
            if (pEntities[i].arctextcolor) {
                arcColors.arctextcolor = pEntities[i].arctextcolor;
            }
            if (pEntities[i].arctextbgcolor) {
                arcColors.arctextbgcolor = pEntities[i].arctextbgcolor;
            }
            gEntity2ArcColor[pEntities[i].name] = arcColors;
        }
    }
    gEntityXHWM = lEntityXPos;
}

function renderArcs(pArcs, pEntities) {
    var defs = gDocument.getElementById("__defs");
    var lifelinelayer = gDocument.getElementById("__lifelinelayer");
    var sequence = gDocument.getElementById("__sequencelayer");
    var notelayer = gDocument.getElementById("__notelayer");
    var lArcSpannerMemory = [];

    var lLabel = "";
    var lArcEnd = gEntityXHWM - INTER_ENTITY_SPACING + ENTITY_WIDTH;

    var i, j, k = 0;

    defs.appendChild(renderArcRow(pEntities, "arcrow"));
    lifelinelayer.appendChild(utl.createUse(0, getRowInfo(-1).y, "arcrow"));

    clearRowInfo();
    if (pArcs) {
        for ( i = 0; i < pArcs.length; i++) {
            var lArcRowOmit = false;
            var lRowMemory = [];
            setRowInfo(i);
            for ( j = 0; j < pArcs[i].length; j++) {
                var lCurrentId = i.toString() + "_" + j.toString();
                var lElement;
                lLabel = "";
                if (pArcs[i][j].label) {
                    lLabel = pArcs[i][j].label;
                }
                switch(map.getAggregate(pArcs[i][j].kind)) {
                    case("emptyarc"):
                        lElement = renderEmptyArc(pArcs[i][j], lCurrentId);
                        lArcRowOmit = ("..." === pArcs[i][j].kind);
                        lRowMemory.push({
                            id : lCurrentId,
                            layer : sequence
                        });
                        break;
                    case("box"):
                        lElement = createBox(lCurrentId, gEntity2X[pArcs[i][j].from], gEntity2X[pArcs[i][j].to], pArcs[i][j]);
                        lRowMemory.push({
                            id : lCurrentId,
                            layer : notelayer
                        });
                        break;
                    case("arcspanning"):
                        lElement = renderArcSpanningArcLabel(lCurrentId + "_label", pArcs[i][j]);
                        lRowMemory.push({
                            id : lCurrentId + "_label",
                            layer : notelayer
                        });
                        lArcSpannerMemory.push({
                            id : lCurrentId,
                            arc : pArcs[i][j],
                            rownum : i
                        });
                        break;
                    default:
                        if (pArcs[i][j].from && pArcs[i][j].to) {
                            var lFrom = pArcs[i][j].from;
                            var lTo = pArcs[i][j].to;
                            var xTo = 0;
                            var xFrom = 0;

                            if (lTo === "*") {// it's a broadcast arc
                                xFrom = gEntity2X[lFrom];
                                for ( k = 0; k < pEntities.length; k++) {
                                    if (pEntities[k].name != lFrom) {
                                        xTo = gEntity2X[pEntities[k].name];
                                        pArcs[i][j].label = "";
                                        defs.appendChild(createArc(lCurrentId + "bc" + k, pArcs[i][j], xFrom, xTo));
                                        lRowMemory.push({
                                            id : lCurrentId + "bc" + k,
                                            layer : sequence
                                        });
                                    }
                                }
                                pArcs[i][j].label = lLabel;

                                lElement = createTextLabel(lCurrentId + "_txt", pArcs[i][j], 0, 0 - (gTextHeight / 2) - LINE_WIDTH, lArcEnd);
                                lRowMemory.push({
                                    id : lCurrentId + "_txt",
                                    layer : sequence
                                });
                            } else {// it's a regular arc
                                xFrom = gEntity2X[lFrom];
                                xTo = gEntity2X[lTo];
                                lElement = createArc(lCurrentId, pArcs[i][j], xFrom, xTo);
                                lRowMemory.push({
                                    id : lCurrentId,
                                    layer : sequence
                                });
                            }  /// lTo or lFrom === "*"
                        }// if both a from and a to
                        break;
                }// switch
                if (lElement) {
                    setRowInfo(i, Math.max(getRowInfo(i).height, utl.getBBox(lElement).height + 2 * LINE_WIDTH));
                    defs.appendChild(lElement);
                }
            }// for all arcs in a row
            
            /* 
             *  only here we can determine the height of the row and the y position
             */
            var lArcRowId = "arcrow_" + i.toString();
            var lArcRowClass = "arcrow";
            if (lArcRowOmit) {
                lArcRowClass = "arcrowomit";
            }
            var lRow = renderArcRow(pEntities, lArcRowClass, getRowInfo(i).height, lArcRowId);
            defs.appendChild(lRow);
            lifelinelayer.appendChild(utl.createUse(0, getRowInfo(i).y, lArcRowId));

            for (var m = 0; m < lRowMemory.length; m++) {
                lRowMemory[m].layer.appendChild(utl.createUse(0, getRowInfo(i).y, lRowMemory[m].id));
            }
        } // for all rows
        renderArcSpanningArcs(lArcSpannerMemory);

    } // if pArcs
} // function

function renderArcSpanningArcLabel (pId, pArc){
    var lFrom = gEntity2X[pArc.from];
    var lTo = gEntity2X[pArc.to];
    if (lFrom > lTo){
        var lTmp = lFrom; lFrom = lTo; lTo = lTmp;
    }
    var lMaxWidth = lTo - lFrom - 2*LINE_WIDTH;
    
    var lStart = (lFrom - ((INTER_ENTITY_SPACING - 2*LINE_WIDTH)/2));
    var lGroup = utl.createGroup(pId);
    pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
    var lTextGroup = createTextLabel(pId + "_txt", pArc, lStart + LINE_WIDTH - (lMaxWidth/2), ARCROW_HEIGHT/4, lMaxWidth, "anchor-start" /*, class */);
    var lBBox = utl.getBBox(lTextGroup);
    
    var lHeight = Math.max(lBBox.height + 2*LINE_WIDTH, ARCROW_HEIGHT/2 - 2*LINE_WIDTH);
    var lWidth = Math.min(lBBox.width + 2*LINE_WIDTH, lMaxWidth);
    
    var lBox = utl.createRect(lWidth, lHeight, "box", lStart, 0);
    colorBox (lBox, pArc);
    lGroup.appendChild(lBox);
    lGroup.appendChild(lTextGroup);

    return lGroup;

    // return createBox(pId, gEntity2X[pArc.from], gEntity2X[pArc.from], pArc, DEFAULT_ENTITY_HEIGHT/2);
}

function renderArcSpanningArcs(pArcSpanningArcs){
    var defs = gDocument.getElementById("__defs");
    var arcspanlayer = gDocument.getElementById("__arcspanlayer");

    for (var n = 0; n < pArcSpanningArcs.length; n++){
        defs.appendChild(renderArcSpanningArc(pArcSpanningArcs[n]));
        arcspanlayer.appendChild(utl.createUse(0,getRowInfo(pArcSpanningArcs[n].rownum).y, pArcSpanningArcs[n].id));
    }
}

function renderArcSpanningArc(pArcMem) {
    var lFromY = getRowInfo(pArcMem.rownum).y;
    var lToY = getRowInfo(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
    var lHeight = lToY - lFromY;
    pArcMem.arc.label = "";
    
    return createBox(pArcMem.id, gEntity2X[pArcMem.arc.from], gEntity2X[pArcMem.arc.to], pArcMem.arc, lHeight);
}

function renderEntity (pId, pEntity) {
    var lGroup = utl.createGroup(pId);
    var lTextLabel = createTextLabel(pId + "_txt", pEntity,
                0, ENTITY_HEIGHT/2, ENTITY_WIDTH, "entity");
    // var lBBox = utl.getBBox(lTextLabel);
    var lRect = utl.createRect(ENTITY_WIDTH, ENTITY_HEIGHT);
    
    // var lRect = utl.createRect(ENTITY_WIDTH, Math.max(lBBox.height, ENTITY_HEIGHT));
    
    colorBox(lRect, pEntity);
    lGroup.appendChild(lRect);
    lGroup.appendChild(lTextLabel);
    return lGroup;
}

function renderArcRow(pEntities, pClass, pHeight, pId) {
    var i = 0;
    if ((pId === undefined)||(pId === null)) {
        pId = pClass;
    }
    if ((pHeight === undefined) || (pHeight === null) || pHeight < ARCROW_HEIGHT) {
        pHeight = ARCROW_HEIGHT;
    }
    var lGroup = utl.createGroup(pId);
    var lEntityXPos = 0;

    for (i=0;i<pEntities.length;i++){
        var lLine = utl.createLine (
            lEntityXPos + (ENTITY_WIDTH/2), 0-(pHeight/2),
            lEntityXPos + (ENTITY_WIDTH/2),   (pHeight/2),
            pClass);
        // TODO #13: render associated marker(s) in <def>
        if (pEntities[i].linecolor) {
            lLine.setAttribute("style", "stroke : " + pEntities[i].linecolor + ";");
            // TODO #13: color the associated marker(s)
        }
        lGroup.appendChild(lLine);
        lEntityXPos += INTER_ENTITY_SPACING;
    }
    return lGroup;
}

function createSelfRefArc(pClass, pFrom, pYTo, pDouble, pLineColor) {
    var lHeight = 2*(ARCROW_HEIGHT/5);
    var lWidth  = INTER_ENTITY_SPACING/3;

    var lGroup = utl.createGroup("selfie");
    if (pDouble){
        // TODO #13: render associated marker(s) in <def>
        var lInnerTurn = utl.createUTurn(pFrom, (lHeight-4)/2, (pYTo - 2 + lHeight) /*lSign*lHeight*/, lWidth-4, "none");
        var lOuterTurn = utl.createUTurn(pFrom, (lHeight+4)/2, (pYTo + 6 + lHeight) /*lSign*lHeight*/, lWidth, pClass);
        if (pLineColor) {
            lInnerTurn.setAttribute("style", "stroke: " + pLineColor + ";");
            lOuterTurn.setAttribute("style", "stroke: " + pLineColor + ";");
        }
        lGroup.appendChild(lInnerTurn);
        lGroup.appendChild(lOuterTurn);
    } else {
        var lUTurn = utl.createUTurn(pFrom, lHeight/2, (pYTo + lHeight) /*lSign*lHeight*/, lWidth, pClass);
        if (pLineColor) {
            lUTurn.setAttribute("style", "stroke: " + pLineColor + ";");
        }
        lGroup.appendChild(lUTurn);
    }

    return lGroup;
}



function renderEmptyArc(pArc, pId) {
    var lElement;
    switch(pArc.kind) {
        case ("..."):
        case ("|||"):
            lElement = createEmptyArcText(pId, pArc);
            break;
        case ("---"):
            lElement = createComment(pId, pArc);
            break;
    }
    return lElement;
}

function createArc (pId, pArc, pFrom, pTo) {
    var lGroup = utl.createGroup(pId);
    var lClass = "";
    var lArcGradient = ARC_GRADIENT;
    var lDoubleLine = false;
    
    lClass = map.determineArcClass(pArc.kind, pFrom, pTo);
    
    if (( ":>"=== pArc.kind )||
        ( "::"=== pArc.kind )||
        ( "<:>"=== pArc.kind )){
            lDoubleLine = true;
    }
    
    if ("-x" === pArc.kind ) {
        pTo =  pFrom + (pTo - pFrom)*(3/4);
    }

    var lYTo = 0;
    if (pArc.arcskip) {
        lYTo = pArc.arcskip*ARCROW_HEIGHT; /* TODO: derive from hashmap */
        lArcGradient = lYTo;
    }

    /* for one line labels add an end of line so it gets 
     * rendered above the arc in stead of directly on it.
     * TODO: kludgy?
     */
    if (pArc.label && (pArc.label.indexOf('\\n') === -1)){
        pArc.label += "\\n";
    }
     
    if (pFrom === pTo) {
        lGroup.appendChild(createSelfRefArc(lClass, pFrom, lYTo, lDoubleLine, pArc.linecolor));
        lGroup.appendChild(
            createTextLabel(pId + "_txt", pArc, pFrom +2 - (INTER_ENTITY_SPACING/2), 0-(ARCROW_HEIGHT/5), INTER_ENTITY_SPACING, "anchor-start")
        );
    } else {
        var lLine = utl.createLine(pFrom, 0, pTo, lArcGradient, lClass, lDoubleLine);
        // var lLine = utl.createArrow(pId, pFrom, 0, pTo, lArcGradient, pArc.kind);
        if (pArc.linecolor) {
           lLine.setAttribute("style", "stroke:" + pArc.linecolor + "; fill: " + pArc.linecolor + ";" );
        }
        lGroup.appendChild (lLine);
        // lGroup = lLine;
        lGroup.appendChild(
            createTextLabel(pId + "_txt", pArc, pFrom, 0, pTo - pFrom)
        );
    }

    // lGroup.appendChild(lLine);
    return lGroup;
}

function createTextLabel (pId, pArc, pStartX, pStartY, pWidth, pClass) {
    var lGroup = utl.createGroup(pId);
/* pArc:
 *   label & id
 *   url & idurl
 *   kind (boxes get auto wrapped)
 */

    if (pArc.label) {
        var lMiddle = pStartX + (pWidth/2);
        pArc.label = txt.unescapeString(pArc.label);
        if (pArc.id){
            pArc.id = txt.unescapeString(pArc.id);
        }

        var lLines = pArc.label.split('\\n');
        var lMaxTextWidthInChars = txt.determineMaxTextWidth(pWidth);
        switch(pArc.kind){
            case("box"): case("rbox"): case("abox"): case("note"): case(undefined):
                lLines = txt.wrap(pArc.label, lMaxTextWidthInChars);
                break;
            default:
                if (WORDWRAPARCS){
                    lLines = txt.wrap(pArc.label, lMaxTextWidthInChars);
                }
        }
        
        pStartY = pStartY - (((lLines.length-1)*gTextHeight)/2) - ((lLines.length-1)/2);
        for (var i = 0; i < lLines.length; i++) {
            var lText = {};
            if (i===0){
                lText = utl.createText(lLines[i], lMiddle, pStartY + gTextHeight/4 + (i*gTextHeight), pClass, pArc.url, pArc.id, pArc.idurl);
            } else {
                pStartY += 1;
                lText = utl.createText(lLines[i], lMiddle, pStartY + gTextHeight/4 + (i*gTextHeight), pClass, pArc.url);
            }
            var lBBox = utl.getBBox(lText);
            
            var lRect = utl.createRect(lBBox.width, lBBox.height, "textbg", lBBox.x, lBBox.y);
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
    }
    return lGroup;
}

function createEmptyArcText (pId, pArc) {
    var lArcStart = 0;
    var lArcEnd = gEntityXHWM - INTER_ENTITY_SPACING + ENTITY_WIDTH;
    var lGroup = utl.createGroup(pId);

    if (pArc.from && pArc.to){
        lArcStart = gEntity2X[pArc.from];
        lArcEnd = Math.abs (gEntity2X[pArc.to] - gEntity2X[pArc.from]);
    }
    lGroup.appendChild(createTextLabel(pId, pArc, lArcStart, 0, lArcEnd));
    return lGroup;
}

function createComment (pId, pArc) {
    var lStartX = 0;
    var lEndX = gEntityXHWM - INTER_ENTITY_SPACING + ENTITY_WIDTH;
    var lClass = "dotted";
    var lGroup = utl.createGroup(pId);
    
    if (pArc.from && pArc.to){
        lStartX = gEntity2X[pArc.from] - (INTER_ENTITY_SPACING - 2*LINE_WIDTH)/2;
        lEndX = gEntity2X[pArc.to] + (INTER_ENTITY_SPACING - 2*LINE_WIDTH)/2;
        lClass = "";
    }
    var lLine = utl.createLine(lStartX, 0, lEndX, 0, lClass);
    
    lGroup.appendChild(lLine);
    lGroup.appendChild(createEmptyArcText(pId + "_txt", pArc));

    if (pArc.linecolor) {
        lLine.setAttribute("style", "stroke: " + pArc.linecolor + ";");
    }

    return lGroup;
}

function colorText (pElement, pArc){
    if (pArc.textcolor) {
        var lStyleString = "";
        lStyleString += "fill:" + pArc.textcolor + ";";
        pElement.setAttribute("style", lStyleString);
    }
}

function colorBox (pElement, pArc) {
    var lStyleString = "";
    if (pArc.textbgcolor) {
        lStyleString += "fill:" + pArc.textbgcolor + ";";
    }
    if (pArc.linecolor) {
        lStyleString += "stroke:" + pArc.linecolor + ";";
    }
    pElement.setAttribute("style", lStyleString);
}

function createBox (pId, pFrom, pTo, pArc, pHeight) {
    if (pFrom > pTo) {
        var lTmp = pFrom; pFrom = pTo; pTo = lTmp;
    }
    var lWidth = ((pTo - pFrom) + INTER_ENTITY_SPACING - 2*LINE_WIDTH);
    
    var lStart = (pFrom - ((INTER_ENTITY_SPACING - 2*LINE_WIDTH)/2));
    var lGroup = utl.createGroup(pId);
    var lBox;
    var lTextGroup = createTextLabel(pId + "_txt", pArc, lStart, 0, lWidth);
    var lBBox = utl.getBBox(lTextGroup);
    
    var lHeight = pHeight ? pHeight : Math.max(lBBox.height + 2*LINE_WIDTH, ARCROW_HEIGHT - 2*LINE_WIDTH);
    
    switch (pArc.kind) {
         case ("box") :
            lBox = utl.createRect(lWidth, lHeight, "box", lStart, (0-lHeight/2));
            break;
        case ("rbox") :
            lBox = utl.createRect(lWidth, lHeight, "box", lStart, (0-lHeight/2), 6, 6);
            break;
        case ("abox") :
            lBox = utl.createABox(lWidth, lHeight, "box", lStart, 0);
            break;
        case ("note") :
            lBox = utl.createNote(lWidth, lHeight, "box", lStart, (0-lHeight/2));
            break;
        default :
            lBox = utl.createRect(lWidth, lHeight, "box", lStart, 0);
    }
    colorBox (lBox, pArc);
    lGroup.appendChild(lBox);
    lGroup.appendChild(lTextGroup);

    return lGroup;
}


var gSvgStyleElementString =
/*jshint multistr:true */
"svg { \
    font-family: Helvetica, sans-serif; \
    font-size: 9pt; \
    background-color: white; \
    stroke : black; \
    color  : black; \
} \
rect { \
    fill: none; \
    stroke: black; \
    stroke-width: 2; \
} \
.bglayer { \
    fill:white; \
    stroke: white; \
    stroke-width: 0; \
} \
rect.textbg { \
    fill:white; \
    stroke:white; \
    stroke-width:0; \
    opacity: 0.9; \
} \
line { \
    stroke: black; \
    stroke-width: 2; \
} \
.arcrowomit { \
    stroke-dasharray: 2,2; \
} \
text { \
    color: inherit; \
    stroke: none; \
    text-anchor: middle; \
} \
text.entity { \
    text-decoration : underline; \
} \
text.anchor-start { \
    text-anchor: start; \
} \
path { \
    stroke : black; \
    color : black; \
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
    stroke : black; \
    stroke-dasharray : 100,1; /* 'none' should work, but doesn't in webkit */ \
    stroke-width : 1; \
} \
.filled { \
    stroke:inherit; \
    fill:black; /* no-inherit */ \
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
} \
.signal { \
    marker-end : url(#signal); \
} \
.signal-u { \
    marker-end : url(#signal-u); \
} \
.signal-both { \
    marker-end : url(#signal); \
    marker-start : url(#signal-l); \
} \
.signal-both-u { \
    marker-end : url(#signal-u); \
    marker-start : url(#signal-lu); \
} \
.signal-both-self { \
    marker-end : url(#signal-u); \
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
    marker-end : url(#callback); \
    stroke : inherit ; \
} \
.returnvalue-both { \
    stroke-dasharray: 5,2; \
    marker-end : url(#callback); \
    marker-start : url(#callback-l); \
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
.inherit { \
    stroke : inherit; \
    color : inherit; \
} \
.inherit-fill { \
    fill : inherit; \
}";
return {
    clean : function (pParentElementId, pWindow) {
        _clean(pParentElementId, pWindow);
    },
    renderAST : function (pAST, pSource, pParentElementId, pWindow) {
        _renderAST(pAST, pSource, pParentElementId, pWindow);
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