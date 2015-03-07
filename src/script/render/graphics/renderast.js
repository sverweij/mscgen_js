/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint trailing:true */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./renderutensils", "./renderskeleton", "../text/textutensils", "../text/flatten", "../text/dotmap", "./rowmemory"], function(utl, skel, txt, flatten, map, rowmemory) {
    /**
     *
     * renders an abstract syntax tree of a sequence chart
     *
     * knows of:
     *  - the syntax tree
     *  - the target canvas
     *
     * Defines default sizes and distances for all objects.
     * @exports renderast
     * @author {@link https://github.com/sverweij | Sander Verweij}
     */
    "use strict";

    var PAD_VERTICAL = 3;
    var DEFAULT_INTER_ENTITY_SPACING = 160;
    var DEFAULT_ENTITY_WIDTH = 100;
    var DEFAULT_ENTITY_HEIGHT = 34;
    var DEFAULT_ARCROW_HEIGHT = 38;
    var LINE_WIDTH = 2;
    var DEFAULT_ARC_GRADIENT = 0;

    var INNERELEMENTPREFIX = "mscgen_js-svg-";

    var gEntityXHWM = 0;
    var gEntity2X = {};
    var gEntity2ArcColor = {};
    var gInnerElementId = INNERELEMENTPREFIX;
    /* sensible default - gets overwritten in bootstrap */

    var gChart = {
        "interEntitySpacing" : DEFAULT_INTER_ENTITY_SPACING,
        "entityWidth" : DEFAULT_ENTITY_WIDTH,
        "entityHeight" : DEFAULT_ENTITY_HEIGHT,
        "arcRowHeight" : DEFAULT_ARCROW_HEIGHT,
        "arcGradient" : DEFAULT_ARC_GRADIENT,
        "wordWrapArcs" : false,
        "maxDepth" : 0,
        "textHeight" : 12,
        "document" : {},
        "layer" : {
            "defs" : {},
            "lifeline": {},
            "sequence":{},
            "notes":{},
            "inline":{}
        }
    };

    function _clean(pParentElementId, pWindow) {
        gChart.document = skel.init(pWindow);
        var lChildElement = gChart.document.getElementById(INNERELEMENTPREFIX + pParentElementId);
        if (lChildElement && (lChildElement !== null) && (lChildElement !== undefined)) {
            var lParentElement = gChart.document.getElementById(pParentElementId);
            lParentElement.removeChild(lChildElement);
        }
    }

    /**
     * preProcessOptions() -
     * - resets the global variables governing entity width and height,
     *   row height to their default values
     * - modifies them if passed
     *   - hscale (influences the entity width and inter entity spacing defaults)
     *   - arcgradient (influences the arc row height, sets the global arc gradient)
     *   - wordwraparcs (sets the wordwraparcs global)
     *
     * Note that width is not processed here as this can only be done
     * reliably after most rendering calculations have been executed.
     *
     * @param <object> - pOptions - the option part of the AST
     */
    function preProcessOptions(pChart, pOptions) {
        pChart.interEntitySpacing = DEFAULT_INTER_ENTITY_SPACING;
        pChart.entityHeight = DEFAULT_ENTITY_HEIGHT;
        pChart.entityWidth = DEFAULT_ENTITY_WIDTH;
        pChart.arcRowHeight = DEFAULT_ARCROW_HEIGHT;
        pChart.arcGradient = DEFAULT_ARC_GRADIENT;
        pChart.wordWrapArcs = false;

        if (pOptions) {
            if (pOptions.hscale) {
                pChart.interEntitySpacing = pOptions.hscale * DEFAULT_INTER_ENTITY_SPACING;
                pChart.entityWidth = pOptions.hscale * DEFAULT_ENTITY_WIDTH;
            }
            if (pOptions.arcgradient) {
                pChart.arcRowHeight = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARCROW_HEIGHT;
                pChart.arcGradient = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARC_GRADIENT;
            }
            if (pOptions.wordwraparcs && pOptions.wordwraparcs === "true") {
                pChart.wordWrapArcs = true;
            }
        }
    }

    function renderWatermark(pWatermark, pCanvas) {
        var lWaterMarkLayer = gChart.document.getElementById(toId("__watermark"));
        var lWatermark = utl.createText(pWatermark, pCanvas.width / 2, pCanvas.height / 2, "watermark");
        var lAngle = 0 - (Math.atan(pCanvas.height / pCanvas.width) * 360 / (2 * Math.PI));
        lWatermark.setAttribute("transform", "rotate(" + lAngle.toString() + " " + ((pCanvas.width) / 2).toString() + " " + ((pCanvas.height) / 2).toString() + ")");
        lWaterMarkLayer.appendChild(lWatermark);
    }

    function adjustCanvasSize(pWidth, pCanvas) {
        pCanvas.scale = (pWidth / pCanvas.width);
        pCanvas.width *= pCanvas.scale;
        pCanvas.height *= pCanvas.scale;
        pCanvas.horizontaltransform *= pCanvas.scale;
        pCanvas.verticaltransform *= pCanvas.scale;
    }

    function postProcessOptions(pOptions, pCanvas) {
        if (pOptions) {
            if (pOptions.watermark) {
                renderWatermark(pOptions.watermark, pCanvas);
            }
            if (pOptions.width) {
                adjustCanvasSize(pOptions.width, pCanvas);
            }
        }
    }

    function toId(pElementIdentifierString) {
        return gInnerElementId + pElementIdentifierString;
    }

    function initializeChart(pChart, pWindow, pDepth){
        pChart.document = skel.init(pWindow);
        pChart.layer.defs = pChart.document.getElementById(toId("__defs"));
        pChart.layer.lifeline = pChart.document.getElementById(toId("__lifelinelayer"));
        pChart.layer.sequence = pChart.document.getElementById(toId("__sequencelayer"));
        pChart.layer.notes = pChart.document.getElementById(toId("__notelayer"));
        pChart.layer.inline = pChart.document.getElementById(toId("__arcspanlayer"));
        pChart.textHeight = utl.getBBox(utl.createText("ÁjyÎ9ƒ@", 0, 0)).height;

        if (pDepth) {
            pChart.maxDepth = pDepth;
        } else {
            pChart.maxDepth = 0;
        }

    }

    function determineDepthCorrection(pDepth){
        /* if there's nesting, make sure the rendering routines take the
         * extra width needed into account
         */
        if (pDepth) {
            return 2 * ((pDepth + 1) * 2 * LINE_WIDTH);
        }
        return 0;
    }

    function _renderAST(pAST, pSource, pParentElementId, pWindow) {
        /* process the AST so it is simpler to render */
        pAST = flatten.flatten(pAST);

        gInnerElementId = INNERELEMENTPREFIX + pParentElementId;

        skel.bootstrap(pParentElementId, gInnerElementId, pWindow);
        initializeChart(gChart, pWindow, pAST.depth);

        preProcessOptions(gChart, pAST.options);
        embedSource(gChart, pSource);

        /* render entities and arcs */
        renderEntities(pAST.entities);
        rowmemory.clear(gChart.entityHeight, gChart.arcRowHeight);
        renderArcRows(pAST.arcs, pAST.entities);


        var lMscDepthCorrection = determineDepthCorrection(pAST.depth);
        var lNoArcs = pAST.arcs ? pAST.arcs.length : 0;
        var lRowInfo = rowmemory.get(lNoArcs - 1);
        var lCanvas = {
            "width" : (pAST.entities.length * gChart.interEntitySpacing) + lMscDepthCorrection,
            "height" : lRowInfo.y + (lRowInfo.height / 2) + 2 * PAD_VERTICAL,
            "horizontaltransform" : (gChart.interEntitySpacing + lMscDepthCorrection - gChart.entityWidth) / 2,
            "verticaltransform" : PAD_VERTICAL,
            "scale" : 1
        };

        /* canvg ignores the background-color on svg level and makes the background
         * transparent in stead. To work around this insert a white rectangle the size
         * of the canvas in the background layer.
         *
         * We do this _before_ scaling is applied to the svg
         */
        renderBackground(gChart, lCanvas);
        postProcessOptions(pAST.options, lCanvas);
        renderSvgElement(lCanvas);
    }

    function embedSource(pChart, pSource) {
        if (pSource) {
            var lContent = pChart.document.createTextNode("\n\n# Generated by mscgen_js - http://sverweij.github.io/mscgen_js\n" + pSource);
            pChart.document.getElementById(toId("__msc_source")).appendChild(lContent);
        }
    }

    function renderBackground(pChart, pCanvas) {
        var lBgRect = utl.createRect({width: pCanvas.width, height: pCanvas.height, x: 0 - pCanvas.horizontaltransform, y: 0 - pCanvas.verticaltransform}, "bglayer");
        pChart.document.getElementById(toId("__background")).appendChild(lBgRect);
    }

    function renderSvgElement(pCanvas) {
        var lSvgElement = gChart.document.getElementById(gInnerElementId);
        var body = gChart.document.getElementById(toId("__body"));
        body.setAttribute("transform", "translate(" + pCanvas.horizontaltransform + "," + pCanvas.verticaltransform + ")" + " scale(" + pCanvas.scale + "," + pCanvas.scale + ")");
        lSvgElement.setAttribute("width", pCanvas.width.toString());
        lSvgElement.setAttribute("height", pCanvas.height.toString());
    }

    /**
     * getMaxEntityHeight() -
     * crude method for determining the max entity height; create all entities,
     * measure the max, and than re-render using the max thus gotten
     *
     * @param <object> - pEntities - the entities subtree of the AST
     * @return <int> - height - the height of the heighest entity
     */
    function getMaxEntityHeight(pEntities, pInititalEntityHeight) {
        var lHWM = pInititalEntityHeight;
        var lHeight = pInititalEntityHeight;
        pEntities.forEach(function(pEntity){
            lHeight = utl.getBBox(renderEntity(pEntity.name, pEntity)).height;
            if (lHeight > lHWM) {
                lHWM = lHeight;
            }
        });
        return lHWM;
    }

    function renderEntity(pId, pEntity) {
        var lGroup = utl.createGroup(pId);
        var lTextLabel = createTextLabel(pId + "_txt", pEntity, 0, gChart.entityHeight / 2, gChart.entityWidth, "entity");
        var lRect = utl.createRect({width: gChart.entityWidth, height: gChart.entityHeight});
        colorBox(lRect, pEntity);
        lGroup.appendChild(lRect);
        lGroup.appendChild(lTextLabel);
        return lGroup;
    }

    function _renderEntity(pEntity, pEntityXPos) {
        var arcColors = {};

        gChart.layer.defs.appendChild(renderEntity(toId(pEntity.name), pEntity));
        gChart.layer.sequence.appendChild(utl.createUse(pEntityXPos, 0, toId(pEntity.name)));
        gEntity2X[pEntity.name] = pEntityXPos + (gChart.entityWidth / 2);

        if (pEntity.arclinecolor) {
            arcColors.arclinecolor = pEntity.arclinecolor;
        }
        if (pEntity.arctextcolor) {
            arcColors.arctextcolor = pEntity.arctextcolor;
        }
        if (pEntity.arctextbgcolor) {
            arcColors.arctextbgcolor = pEntity.arctextbgcolor;
        }
        gEntity2ArcColor[pEntity.name] = arcColors;
    }

    /**
     * renderEntities() - renders the given pEntities (subtree of the AST) into
     * the gChart.layer.sequence layer
     *
     * @param <object> - pEntities - the entities to render
     */
    function renderEntities(pEntities) {
        var lEntityXPos = 0;

        gEntity2X = {};
        gEntity2ArcColor = {};

        if (pEntities) {
            gChart.entityHeight = getMaxEntityHeight(pEntities, gChart.entityHeight) + LINE_WIDTH * 2;
            pEntities.forEach(function(pEntity){
                 _renderEntity(pEntity, lEntityXPos);
                lEntityXPos += gChart.interEntitySpacing;
            });
        }
        gEntityXHWM = lEntityXPos;
    }

    /** renderArcRows() - renders the arcrows from an AST
     *
     * @param <object> - pArcRows - the arc rows to render
     * @param <object> - pEntities - the entities to consider
     */
    function renderArcRows(pArcRows, pEntities) {
        var lInlineExpressionMemory = [];

        var lLabel = "";
        var lArcEnd = gEntityXHWM - gChart.interEntitySpacing + gChart.entityWidth;

        gChart.layer.defs.appendChild(renderLifeLines(pEntities, toId("arcrow")));
        gChart.layer.lifeline.appendChild(utl.createUse(0, rowmemory.get(-1).y, toId("arcrow")));


        if (pArcRows) {
            pArcRows.forEach(function(pArcRow, pRowNumber){
                var lArcRowOmit = false;
                var lRowMemory = [];
                rowmemory.set(pRowNumber);
                pArcRow.forEach(function(pArc,pArcNumber){
                    var lCurrentId = toId(pRowNumber.toString() + "_" + pArcNumber.toString());
                    var lElement;
                    lLabel = "";
                    if (pArc.label) {
                        lLabel = pArc.label;
                    }
                    switch(map.getAggregate(pArc.kind)) {
                        case("emptyarc"):
                            lElement = renderEmptyArc(pArc, lCurrentId);
                            lArcRowOmit = ("..." === pArc.kind);
                            lRowMemory.push({
                                id : lCurrentId,
                                layer : gChart.layer.sequence
                            });
                            break;
                        case("box"):
                            lElement = createBox(lCurrentId, gEntity2X[pArc.from], gEntity2X[pArc.to], pArc);
                            lRowMemory.push({
                                id : lCurrentId,
                                layer : gChart.layer.notes
                            });
                            break;
                        case("inline_expression"):
                            lElement = renderInlineExpressionLabel(lCurrentId + "_label", pArc);
                            lRowMemory.push({
                                id : lCurrentId + "_label",
                                layer : gChart.layer.notes
                            });
                            lInlineExpressionMemory.push({
                                id : lCurrentId,
                                arc : pArc,
                                rownum : pRowNumber
                            });
                            break;
                        default:
                            if (pArc.from && pArc.to) {
                                var lFrom = pArc.from;
                                var lTo = pArc.to;
                                var xTo = 0;
                                var xFrom = 0;

                                if (lTo === "*") {// it's a broadcast arc
                                    xFrom = gEntity2X[lFrom];
                                    pEntities.forEach(function(pEntity, pEntityNumber){
                                        if (pEntity.name != lFrom) {
                                            xTo = gEntity2X[pEntity.name];
                                            pArc.label = "";
                                            gChart.layer.defs.appendChild(createArc(lCurrentId + "bc" + pEntityNumber, pArc, xFrom, xTo));
                                            lRowMemory.push({
                                                id : lCurrentId + "bc" + pEntityNumber,
                                                layer : gChart.layer.sequence
                                            });
                                        }
                                    });
                                    pArc.label = lLabel;

                                    lElement = createTextLabel(lCurrentId + "_txt", pArc, 0, 0 - (gChart.textHeight / 2) - LINE_WIDTH, lArcEnd);
                                    lRowMemory.push({
                                        id : lCurrentId + "_txt",
                                        layer : gChart.layer.sequence
                                    });
                                } else {// it's a regular arc
                                    xFrom = gEntity2X[lFrom];
                                    xTo = gEntity2X[lTo];
                                    lElement = createArc(lCurrentId, pArc, xFrom, xTo);
                                    lRowMemory.push({
                                        id : lCurrentId,
                                        layer : gChart.layer.sequence
                                    });
                                }  /// lTo or lFrom === "*"
                            }// if both a from and a to
                            break;
                    }// switch
                    if (lElement) {
                        rowmemory.set(pRowNumber, Math.max(rowmemory.get(pRowNumber).height, utl.getBBox(lElement).height + 2 * LINE_WIDTH));
                        gChart.layer.defs.appendChild(lElement);
                    }
                });// for all arcs in a row

                /*
                 *  only here we can determine the height of the row and the y position
                 */
                var lArcRowId = "arcrow_" + pRowNumber.toString();
                var lArcRowClass = "arcrow";
                if (lArcRowOmit) {
                    lArcRowClass = "arcrowomit";
                }
                gChart.layer.defs.appendChild(renderLifeLines(pEntities, lArcRowClass, rowmemory.get(pRowNumber).height, toId(lArcRowId)));
                gChart.layer.lifeline.appendChild(utl.createUse(0, rowmemory.get(pRowNumber).y, toId(lArcRowId)));

                lRowMemory.forEach(function(pRowMemoryLine){
                    pRowMemoryLine.layer.appendChild(utl.createUse(0, rowmemory.get(pRowNumber).y, pRowMemoryLine.id));
                });
            }); // for all rows
            renderInlineExpressions(lInlineExpressionMemory);
        } // if pArcRows
    }// function

    /**
     * renderInlineExpressionLabel() - renders the label of an inline expression
     * (/ arc spanning arc)
     *
     * @param <string> pId - the id to use for the rendered Element
     * @param <object> pArc - the arc spanning arc
     */
    function renderInlineExpressionLabel(pId, pArc) {
        var lFrom = gEntity2X[pArc.from];
        var lTo = gEntity2X[pArc.to];
        var FOLD_SIZE = 7;
        if (lFrom > lTo) {
            var lTmp = lFrom;
            lFrom = lTo;
            lTo = lTmp;
        }

        var lMaxWidth = (lTo - lFrom) + (gChart.interEntitySpacing - 2 * LINE_WIDTH) - FOLD_SIZE - LINE_WIDTH;

        var lStart = (lFrom - ((gChart.interEntitySpacing - 3 * LINE_WIDTH) / 2) - (gChart.maxDepth - pArc.depth) * 2 * LINE_WIDTH);
        var lGroup = utl.createGroup(pId);
        pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
        var lTextGroup = createTextLabel(pId + "_txt", pArc, lStart + LINE_WIDTH - (lMaxWidth / 2), gChart.arcRowHeight / 4, lMaxWidth, "anchor-start" /*, class */);
        var lBBox = utl.getBBox(lTextGroup);

        var lHeight = Math.max(lBBox.height + 2 * LINE_WIDTH, (gChart.arcRowHeight / 2) - 2 * LINE_WIDTH);
        var lWidth = Math.min(lBBox.width + 2 * LINE_WIDTH, lMaxWidth);

        var lBox = utl.createEdgeRemark({width: lWidth - LINE_WIDTH + FOLD_SIZE, height: lHeight, x: lStart, y: 0}, "box", FOLD_SIZE);
        colorBox(lBox, pArc);
        lGroup.appendChild(lBox);
        lGroup.appendChild(lTextGroup);

        return lGroup;
    }

    function renderInlineExpressions(pInlineExpressions) {
        pInlineExpressions.forEach(function(pInlineExpression){
            gChart.layer.defs.appendChild(renderInlineExpression(pInlineExpression));
            gChart.layer.inline.appendChild(utl.createUse(0, rowmemory.get(pInlineExpression.rownum).y, pInlineExpression.id));
        });
    }

    function renderInlineExpression(pArcMem) {
        var lFromY = rowmemory.get(pArcMem.rownum).y;
        var lToY = rowmemory.get(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
        var lHeight = lToY - lFromY;
        pArcMem.arc.label = "";

        return createBox(pArcMem.id, gEntity2X[pArcMem.arc.from], gEntity2X[pArcMem.arc.to], pArcMem.arc, lHeight);
    }

    function renderLifeLines(pEntities, pClass, pHeight, pId) {
        if ((pId === undefined) || (pId === null)) {
            pId = pClass;
        }
        if ((pHeight === undefined) || (pHeight === null) || pHeight < gChart.arcRowHeight) {
            pHeight = gChart.arcRowHeight;
        }
        var lGroup = utl.createGroup(pId);
        var lEntityXPos = 0;

        pEntities.forEach(function(pEntity) {
            var lLine = utl.createLine(lEntityXPos + (gChart.entityWidth / 2), 0 - (pHeight / 2), lEntityXPos + (gChart.entityWidth / 2), (pHeight / 2), pClass);
            // TODO #13: render associated marker(s) in <def>
            if (pEntity.linecolor) {
                lLine.setAttribute("style", "stroke : " + pEntity.linecolor + ";");
                // TODO #13: color the associated marker(s)
            }
            lGroup.appendChild(lLine);
            lEntityXPos += gChart.interEntitySpacing;
        });

        return lGroup;
    }

    function createSelfRefArc(pClass, pFrom, pYTo, pDouble, pLineColor) {
        var lHeight = 2 * (gChart.arcRowHeight / 5);
        var lWidth = gChart.interEntitySpacing / 3;

        var lGroup = utl.createGroup();
        if (pDouble) {
            // TODO #13: render associated marker(s) in <def>
            var lInnerTurn = utl.createUTurn(pFrom, (lHeight - 4) / 2, (pYTo - 2 + lHeight)/*lSign*lHeight*/, lWidth - 4, "none");
            var lOuterTurn = utl.createUTurn(pFrom, (lHeight + 4) / 2, (pYTo + 6 + lHeight)/*lSign*lHeight*/, lWidth, pClass);
            if (pLineColor) {
                lInnerTurn.setAttribute("style", "stroke: " + pLineColor + ";");
                lOuterTurn.setAttribute("style", "stroke: " + pLineColor + ";");
            }
            lGroup.appendChild(lInnerTurn);
            lGroup.appendChild(lOuterTurn);
        } else {
            var lUTurn = utl.createUTurn(pFrom, lHeight / 2, (pYTo + lHeight)/*lSign*lHeight*/, lWidth, pClass);
            if (pLineColor) {
                lUTurn.setAttribute("style", "stroke: " + pLineColor + ";");
            }
            lGroup.appendChild(lUTurn);
        }

        return lGroup;
    }

    function renderEmptyArc(pArc, pId) {
        var lElement;

        if (pArc.from && pArc.to) {
            if (gEntity2X[pArc.from] > gEntity2X[pArc.to]) {
                var lTmp = pArc.from;
                pArc.from = pArc.to;
                pArc.to = lTmp;
            }
        }

        switch(pArc.kind) {
            case ("..."):
            case ("|||"):
                lElement = createLifeLinesText(pId, pArc);
                break;
            case ("---"):
                lElement = createComment(pId, pArc);
                break;
        }
        return lElement;
    }

    function createArc(pId, pArc, pFrom, pTo) {
        var lGroup = utl.createGroup(pId);
        var lClass = "";
        var lArcGradient = gChart.arcGradient;
        var lDoubleLine = (":>" === pArc.kind ) || ("::" === pArc.kind ) || ("<:>" === pArc.kind );

        lClass = gInnerElementId + map.determineArcClass(pArc.kind, pFrom, pTo);

        if ("-x" === pArc.kind) {
            pTo = pFrom + (pTo - pFrom) * (3 / 4);
        }

        var lYTo = 0;
        if (pArc.arcskip) {
            /* TODO: derive from hashmap */
            lYTo = pArc.arcskip * gChart.arcRowHeight;
            lArcGradient = lYTo;
        }

        /* for one line labels add an end of line so it gets
         * rendered above the arc in stead of directly on it.
         * TODO: kludgy
         */
        if (pArc.label && (pArc.label.indexOf('\\n') === -1)) {
            pArc.label += "\\n";
        }

        if (pFrom === pTo) {
            lGroup.appendChild(createSelfRefArc(lClass, pFrom, lYTo, lDoubleLine, pArc.linecolor));
            lGroup.appendChild(createTextLabel(pId + "_txt", pArc, pFrom + 2 - (gChart.interEntitySpacing / 2), 0 - (gChart.arcRowHeight / 5), gChart.interEntitySpacing, "anchor-start"));
        } else {
            var lLine = utl.createLine(pFrom, 0, pTo, lArcGradient, lClass, lDoubleLine);
            if (pArc.linecolor) {
                lLine.setAttribute("style", "stroke:" + pArc.linecolor + "; fill: " + pArc.linecolor + ";");
            }
            lGroup.appendChild(lLine);
            lGroup.appendChild(createTextLabel(pId + "_txt", pArc, pFrom, 0, pTo - pFrom));
        }
        return lGroup;
    }

    function renderTextLabelLine(pGroup, pLine, pMiddle, pStartY, pClass, pArc, pPosition) {
        var lGroup = pGroup;
        var lText = {};
        if (pPosition === 0) {
            lText = utl.createText(pLine, pMiddle, pStartY + gChart.textHeight / 4 + (pPosition * gChart.textHeight), pClass, pArc.url, pArc.id, pArc.idurl);
        } else {
            lText = utl.createText(pLine, pMiddle, pStartY + gChart.textHeight / 4 + (pPosition * gChart.textHeight), pClass, pArc.url);
        }
        var lBBox = utl.getBBox(lText);

        var lRect = utl.createRect(lBBox, "textbg");
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
        return lGroup;
    }

    /**
     * createTextLabel() - renders the text (label, id, url) for a given pArc
     * with a bounding box starting at pStartX, pStartY and of a width of at
     * most pWidth (all in pixels)
     *
     * @param <string> - pId - the unique identification of the textlabe (group) within the svg
     * @param <objec> - pArc - the arc of which to render the text
     * @param <number> - pStartX
     * @param <number> - pStartY
     * @param <number> - pWidth
     * @param <string> - pClass - reference to a css class to influence text appearance
     */
    function createTextLabel(pId, pArc, pStartX, pStartY, pWidth, pClass) {
        var lGroup = utl.createGroup(pId);
        /* pArc:
         *   label & id
         *   url & idurl
         *   kind (boxes get auto wrapped)
         */

        if (pArc.label) {
            var lMiddle = pStartX + (pWidth / 2);
            pArc.label = txt.unescapeString(pArc.label);
            if (pArc.id) {
                pArc.id = txt.unescapeString(pArc.id);
            }
            var lLines = txt.splitLabel(pArc.label, pArc.kind, pWidth, gChart.wordWrapArcs);

            var lStartY = pStartY - (((lLines.length - 1) * gChart.textHeight) / 2) - ((lLines.length - 1) / 2);
            lLines.forEach(function(pLine, pLineNumber){
                lGroup = renderTextLabelLine(lGroup, pLine, lMiddle, lStartY, pClass, pArc, pLineNumber);
                lStartY++;
            });
        }
        return lGroup;
    }

    /**
     * createLifeLinesText() - creates centered text for the current (most
     *     possibly empty) arc. If the arc has a from and a to, the function
     *     centers between these, otherwise it does so from 0 to the width of
     *     the rendered chart
     *
     * @param <string> - pId - unique identification of the text in the svg
     * @param <object> - pArc - the arc to render
     */
    function createLifeLinesText(pId, pArc) {
        var lArcStart = 0;
        var lArcEnd = gEntityXHWM - gChart.interEntitySpacing + gChart.entityWidth;
        var lGroup = utl.createGroup(pId);

        if (pArc.from && pArc.to) {
            lArcStart = gEntity2X[pArc.from];
            lArcEnd = Math.abs(gEntity2X[pArc.to] - gEntity2X[pArc.from]);
        }
        lGroup.appendChild(createTextLabel(pId + "_lbl", pArc, lArcStart, 0, lArcEnd));
        return lGroup;
    }

    /**
     * createComment() - creates an element representing a comment ('---')
     *
     * @param <string> - pId - the unique identification of the comment within the svg
     * @param <object> - pArc - the (comment) arc to render
     */
    function createComment(pId, pArc) {
        var lStartX = 0;
        var lEndX = gEntityXHWM - gChart.interEntitySpacing + gChart.entityWidth;
        var lClass = "dotted";
        var lGroup = utl.createGroup(pId);

        if (pArc.from && pArc.to) {
            var lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * LINE_WIDTH;

            lStartX = (gEntity2X[pArc.from] - (gChart.interEntitySpacing + 2 * LINE_WIDTH) / 2) - lArcDepthCorrection;
            lEndX = (gEntity2X[pArc.to] + (gChart.interEntitySpacing + 2 * LINE_WIDTH) / 2) + lArcDepthCorrection;
            lClass = "striped";
        }
        var lLine = utl.createLine(lStartX, 0, lEndX, 0, lClass);

        lGroup.appendChild(lLine);
        lGroup.appendChild(createLifeLinesText(pId + "_txt", pArc));

        if (pArc.linecolor) {
            lLine.setAttribute("style", "stroke: " + pArc.linecolor + ";");
        }

        return lGroup;
    }

    /**
     * Sets the fill color of the passed pElement to the textcolor of
     * the given pArc
     *
     * @param <svgElement> pElement
     * @param <object> pArc
     */
    function colorText(pElement, pArc) {
        if (pArc.textcolor) {
            pElement.setAttribute("style", "fill:" + pArc.textcolor + ";");
        }
    }

    /**
     * colorBox() - sets the fill and stroke color of the element to the
     * textbgcolor and linecolor of the given arc
     *
     * @param <svg element> - pElemeent
     * @param <object> - pArc
     */
    function colorBox(pElement, pArc) {
        var lStyleString = "";
        if (pArc.textbgcolor) {
            lStyleString += "fill:" + pArc.textbgcolor + ";";
        }
        if (pArc.linecolor) {
            lStyleString += "stroke:" + pArc.linecolor + ";";
        }
        pElement.setAttribute("style", lStyleString);
    }

    /**
     * creates an element representing a box (box, abox, rbox, note)
     * also (mis?) used for rendering inline expressions/ arc spanning arcs
     *
     * @param <string> - pId - the unique identification of the box within the svg
     * @param <number> - pFrom - the x coordinate to render the box from
     * @param <number> - pTo - the x coordinate to render te box to
     * @param <object> - pArc - the (box/ arc spanning) arc to render
     * @param <number> - pHeight - the height of the box to render. If not passed
     * takes the bounding box of the (rendered) label of the arc, taking care not
     * to get smaller than the default arc row height
     */
    function createBox(pId, pFrom, pTo, pArc, pHeight) {
        if (pFrom > pTo) {
            var lTmp = pFrom;
            pFrom = pTo;
            pTo = lTmp;
        }
        var lWidth = ((pTo - pFrom) + gChart.interEntitySpacing - 2 * LINE_WIDTH);
        var NOTE_FOLD_SIZE = 9;
        // px
        var RBOX_CORNER_RADIUS = 6;
        // px

        var lStart = pFrom - ((gChart.interEntitySpacing - 2 * LINE_WIDTH) / 2);
        var lGroup = utl.createGroup(pId);
        var lBox;
        var lTextGroup = createTextLabel(pId + "_txt", pArc, lStart, 0, lWidth);
        var lTextBBox = utl.getBBox(lTextGroup);

        var lHeight = pHeight ? pHeight : Math.max(lTextBBox.height + 2 * LINE_WIDTH, gChart.arcRowHeight - 2 * LINE_WIDTH);
        var lBBox = {width: lWidth, height: lHeight, x: lStart, y: (0 - lHeight / 2)};

        switch (pArc.kind) {
            case ("box") :
                lBox = utl.createRect(lBBox, "box");
                break;
            case ("rbox") :
                lBox = utl.createRect(lBBox, "box", RBOX_CORNER_RADIUS, RBOX_CORNER_RADIUS);
                break;
            case ("abox") :
                lBBox.y = 0;
                lBox = utl.createABox(lBBox, "box");
                break;
            case ("note") :
                lBox = utl.createNote(lBBox, "box", NOTE_FOLD_SIZE);
                break;
            default :
                var lArcDepthCorrection = (gChart.maxDepth - pArc.depth ) * 2 * LINE_WIDTH;
                lBox = utl.createRect({width: lWidth + lArcDepthCorrection * 2, height: lHeight, x: lStart - lArcDepthCorrection, y: 0}, "box");
        }
        colorBox(lBox, pArc);
        lGroup.appendChild(lBox);
        lGroup.appendChild(lTextGroup);

        return lGroup;
    }

    return {

        /**
         * removes the element with id pParentElementId from the DOM
         *
         * @param - {string} pParentElementId - the element the element with
         * the id mentioned above is supposed to be residing in
         * @param - {window} pWindow - the browser window object
         *
         */
        clean : _clean,

        /**
         * renders the given abstract syntax tree pAST as svg
         * in the element with id pParentELementId in the window pWindow
         *
         * @param {object} pAST - the abstrac syntax tree
         * @param {string} pSource - the source msc to embed in the svg
         * @param {string} pParentElementId - the id of the parent element in which
         * to put the __svg_output element
         * @param {window} pWindow - the browser window to put the svg in
         */
        renderAST : _renderAST
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
