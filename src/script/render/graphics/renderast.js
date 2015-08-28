/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./svgelementfactory", 
        "./svgutensils", 
        "./renderutensils", 
        "./renderskeleton", 
        "../text/textutensils", 
        "../text/flatten", 
        "../text/dotmap",
        "./rowmemory", 
        "./idmanager", 
        "./markermanager", 
        "./entities",
        "./constants"],
    function(fact, svgutl, utl, skel, txt, flatten, map, rowmemory, id, mark, entities, C) {
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
        
    var DEFAULT_ARCROW_HEIGHT = 38; // chart only
    var DEFAULT_ARC_GRADIENT = 0; // chart only

    /* sensible default - gets overwritten in bootstrap */

    var gChart = {
        "arcRowHeight" : DEFAULT_ARCROW_HEIGHT,
        "arcGradient"  : DEFAULT_ARC_GRADIENT,
        "arcEndX"      : 0,
        "wordWrapArcs" : false,
        "maxDepth"     : 0,
        "document"     : {},
        "layer"        : {
            "defs"         : {},
            "lifeline"     : {},
            "sequence"     : {},
            "notes"        : {},
            "inline"       : {}
        }
    };
    var gInlineExpressionMemory = [];

    function _renderAST(pAST, pSource, pParentElementId, pWindow) {
        var lAST = flatten.flatten(pAST);

        renderASTPre(lAST, pSource, pParentElementId, pWindow);
        renderASTMain(lAST);
        renderASTPost(lAST);
    }

    function renderASTPre(pAST, pSource, pParentElementId, pWindow){
        id.setPrefix(pParentElementId);

        gChart.document = skel.bootstrap(pParentElementId, id.get(), mark.getMarkerDefs(id.get(), pAST), pWindow);
        svgutl.init(gChart.document);
        initializeChart(gChart, pAST.depth);

        preProcessOptions(gChart, pAST.options);
        embedSource(gChart, pSource);
    }

    function renderASTMain(pAST){
        renderEntities(pAST.entities);
        rowmemory.clear(entities.getDims().height, gChart.arcRowHeight);
        renderArcRows(pAST.arcs, pAST.entities);
    }

    function renderASTPost(pAST){
        var lCanvas = calculateCanvasDimensions(pAST);

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

    function initializeChart(pChart, pDepth){
        createLayerShortcuts(pChart.layer, pChart.document);
        pChart.maxDepth = pDepth ? pDepth : 0;
    }

    function createLayerShortcuts (pLayer, pDocument){
        pLayer.defs = pDocument.getElementById(id.get("__defs"));
        pLayer.lifeline = pDocument.getElementById(id.get("__lifelinelayer"));
        pLayer.sequence = pDocument.getElementById(id.get("__sequencelayer"));
        pLayer.notes = pDocument.getElementById(id.get("__notelayer"));
        pLayer.inline = pDocument.getElementById(id.get("__arcspanlayer"));
        pLayer.watermark = pDocument.getElementById(id.get("__watermark"));
    }

    function preProcessOptionsArcs(pChart, pOptions){
        pChart.arcRowHeight = DEFAULT_ARCROW_HEIGHT;
        pChart.arcGradient = DEFAULT_ARC_GRADIENT;
        pChart.wordWrapArcs = false;
        
        if (pOptions) {
            if (pOptions.arcgradient) {
                pChart.arcRowHeight = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARCROW_HEIGHT;
                pChart.arcGradient = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARC_GRADIENT;
            }
            if (pOptions.wordwraparcs && pOptions.wordwraparcs === "true") {
                pChart.wordWrapArcs = true;
            }
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
        entities.init(pOptions);
        preProcessOptionsArcs(pChart, pOptions);
    }

    function embedSource(pChart, pSource) {
        if (pSource) {
            var lContent = fact.createTextNode("\n\n# Generated by mscgen_js - http://sverweij.github.io/mscgen_js\n" + pSource);
            pChart.document.getElementById(id.get("__msc_source")).appendChild(lContent);
        }
    }
    function calculateCanvasDimensions(pAST){
        var lDepthCorrection = utl.determineDepthCorrection(pAST.depth, C.LINE_WIDTH);
        var lRowInfo = rowmemory.getLast();
        var lCanvas = {
            "width" : (pAST.entities.length * entities.getDims().interEntitySpacing) + lDepthCorrection,
            "height" : lRowInfo.y + (lRowInfo.height / 2) + 2 * PAD_VERTICAL,
            "horizontaltransform" : (entities.getDims().interEntitySpacing + lDepthCorrection - entities.getDims().width) / 2,
            "verticaltransform" : PAD_VERTICAL,
            "scale" : 1
        };
        lCanvas.x = 0 - lCanvas.horizontaltransform;
        lCanvas.y = 0 - lCanvas.verticaltransform;
        return lCanvas;
    }

    function renderBackground(pChart, pCanvas) {
        var lBgRect = fact.createRect(pCanvas, "bglayer");
        pChart.document.getElementById(id.get("__background")).appendChild(lBgRect);
    }

    function renderWatermark(pWatermark, pCanvas) {
        gChart.layer.watermark.appendChild(fact.createDiagonalText(pWatermark, pCanvas));
    }

    function postProcessOptions(pOptions, pCanvas) {
        if (pOptions) {
            if (pOptions.watermark) {
                renderWatermark(pOptions.watermark, pCanvas);
            }
            if (pOptions.width) {
                utl.scaleCanvasToWidth(pOptions.width, pCanvas);
            }
        }
    }

    function renderSvgElement(pCanvas) {
        var lSvgElement = gChart.document.getElementById(id.get());
        var body = gChart.document.getElementById(id.get("__body"));
        body.setAttribute("transform", "translate(" + pCanvas.horizontaltransform + "," + pCanvas.verticaltransform + ")" + " scale(" + pCanvas.scale + "," + pCanvas.scale + ")");
        lSvgElement.setAttribute("width", pCanvas.width.toString());
        lSvgElement.setAttribute("height", pCanvas.height.toString());
    }

/* ----------------------START entity shizzle-------------------------------- */
    /**
     * getMaxEntityHeight() -
     * crude method for determining the max entity height; create all entities,
     * measure the max, and than re-render using the max thus gotten
     *
     * @param <object> - pEntities - the entities subtree of the AST
     * @return <int> - height - the height of the heighest entity
     */
    function getMaxEntityHeight(pEntities) {
        var lHWM = entities.getDims().height;
        var lHeight = 0;
        pEntities.forEach(function(pEntity){
            lHeight = svgutl.getBBox(renderEntity(pEntity, entities.getDims())).height;
            if (lHeight > lHWM) {
                lHWM = lHeight;
            }
        });
        return lHWM;
    }

    function renderEntity(pEntity, pBBox) {
        var lGroup = fact.createGroup(id.get(pEntity.name));
        var lTextLabel = createBoxLabel(id.get(pEntity.name) + "_txt", pEntity, 0, pBBox.height / 2, pBBox.width, "entity");
        var lRect = fact.createRect(pBBox);
        utl.colorBox(lRect, pEntity);
        lGroup.appendChild(lRect);
        lGroup.appendChild(lTextLabel);
        return lGroup;
    }

    function _renderEntity(pEntity, pEntityXPos) {
        gChart.layer.defs.appendChild(renderEntity(pEntity, entities.getDims()));
        gChart.layer.sequence.appendChild(fact.createUse(pEntityXPos, 0, id.get(pEntity.name)));
    }

    /**
     * renderEntities() - renders the given pEntities (subtree of the AST) into
     * the gChart.layer.sequence layer
     *
     * @param <object> - pEntities - the entities to render
     */
    function renderEntities(pEntities) {
        var lEntityXPos = 0;

        if (pEntities) {
            entities.setHeight (getMaxEntityHeight(pEntities) + C.LINE_WIDTH * 2);

            pEntities.forEach(function(pEntity){
                 _renderEntity(pEntity, lEntityXPos);
                 entities.setX(pEntity, lEntityXPos);
                 lEntityXPos += entities.getDims().interEntitySpacing;
            });
        }
        gChart.arcEndX = lEntityXPos - entities.getDims().interEntitySpacing + entities.getDims().width;
    }

/* ------------------------END entity shizzle-------------------------------- */

    function renderArcRow (pArcRow, pRowNumber, pEntities){
        var lArcRowOmit = false;
        var lRowMemory = [];

        rowmemory.set(pRowNumber);
        pArcRow.forEach(function(pArc,pArcNumber){
            var lCurrentId = id.get(pRowNumber.toString() + "_" + pArcNumber.toString());
            var lElement;
            var lLabel = "";
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
                    lElement = createBox(lCurrentId, entities.getOAndD(pArc.from, pArc.to), pArc);
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
                    gInlineExpressionMemory.push({
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
                            xFrom = entities.getX(lFrom);
                            pEntities.forEach(function(pEntity, pEntityNumber){
                                if (pEntity.name !== lFrom) {
                                    xTo = entities.getX(pEntity.name);
                                    pArc.label = "";
                                    gChart.layer.defs.appendChild(createArc(lCurrentId + "bc" + pEntityNumber, pArc, xFrom, xTo));
                                    lRowMemory.push({
                                        id : lCurrentId + "bc" + pEntityNumber,
                                        layer : gChart.layer.sequence
                                    });
                                }
                            });
                            pArc.label = lLabel;

                            lElement = createTextLabel(lCurrentId + "_txt", 
                                                        pArc,
                                                        0,
                                                        0 - (svgutl.calculateTextHeight() / 2) - C.LINE_WIDTH,
                                                        gChart.arcEndX);
                            lRowMemory.push({
                                id : lCurrentId + "_txt",
                                layer : gChart.layer.sequence
                            });
                        } else {// it's a regular arc
                            lElement = createArc(lCurrentId, pArc, entities.getX(lFrom), entities.getX(lTo));
                            lRowMemory.push({
                                id : lCurrentId,
                                layer : gChart.layer.sequence
                            });
                        }  /// lTo or lFrom === "*"
                    }// if both a from and a to
                    break;
            }// switch
            if (lElement) {
                rowmemory.set(pRowNumber, Math.max(rowmemory.get(pRowNumber).height, svgutl.getBBox(lElement).height + 2 * C.LINE_WIDTH));
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
        gChart.layer.defs.appendChild(renderLifeLines(pEntities, lArcRowClass, rowmemory.get(pRowNumber).height, id.get(lArcRowId)));
        gChart.layer.lifeline.appendChild(fact.createUse(0, rowmemory.get(pRowNumber).y, id.get(lArcRowId)));

        lRowMemory.forEach(function(pRowMemoryLine){
            pRowMemoryLine.layer.appendChild(fact.createUse(0, rowmemory.get(pRowNumber).y, pRowMemoryLine.id));
        });
    }

    /** renderArcRows() - renders the arcrows from an AST
     *
     * @param <object> - pArcRows - the arc rows to render
     * @param <object> - pEntities - the entities to consider
     */
    function renderArcRows(pArcRows, pEntities) {
        gInlineExpressionMemory = [];
        gChart.layer.defs.appendChild(renderLifeLines(pEntities, id.get("arcrow")));
        gChart.layer.lifeline.appendChild(fact.createUse(0, rowmemory.get(-1).y, id.get("arcrow")));

        if (pArcRows) {
            for (var i =0; i< pArcRows.length; i++){
                renderArcRow(pArcRows[i], i, pEntities);
            }
            // pArcRows.forEach(renderArcRow);
            renderInlineExpressions(gInlineExpressionMemory);
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
        var lOnD = {
            from: entities.getX(pArc.from),
            to: entities.getX(pArc.to)
        };

        var FOLD_SIZE = 7;
        if (lOnD.from > lOnD.to) {
            utl.swapfromto(lOnD);
        }

        var lMaxWidth = (lOnD.to - lOnD.from) + (entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH) - FOLD_SIZE - C.LINE_WIDTH;

        var lStart = (lOnD.from - ((entities.getDims().interEntitySpacing - 3 * C.LINE_WIDTH) / 2) - (gChart.maxDepth - pArc.depth) * 2 * C.LINE_WIDTH);
        var lGroup = fact.createGroup(pId);
        pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
        var lTextGroup = createTextLabel(pId + "_txt", pArc, lStart + C.LINE_WIDTH - (lMaxWidth / 2), gChart.arcRowHeight / 4, lMaxWidth, "anchor-start" /*, class */);
        var lBBox = svgutl.getBBox(lTextGroup);

        var lHeight = Math.max(lBBox.height + 2 * C.LINE_WIDTH, (gChart.arcRowHeight / 2) - 2 * C.LINE_WIDTH);
        var lWidth = Math.min(lBBox.width + 2 * C.LINE_WIDTH, lMaxWidth);

        var lBox = fact.createEdgeRemark({width: lWidth - C.LINE_WIDTH + FOLD_SIZE, height: lHeight, x: lStart, y: 0}, "box", FOLD_SIZE);
        utl.colorBox(lBox, pArc);
        lGroup.appendChild(lBox);
        lGroup.appendChild(lTextGroup);

        return lGroup;
    }

    function renderInlineExpressions(pInlineExpressions) {
        pInlineExpressions.forEach(function(pInlineExpression){
            gChart.layer.defs.appendChild(renderInlineExpression(pInlineExpression));
            gChart.layer.inline.appendChild(fact.createUse(0, rowmemory.get(pInlineExpression.rownum).y, pInlineExpression.id));
        });
    }

    function renderInlineExpression(pArcMem) {
        var lFromY = rowmemory.get(pArcMem.rownum).y;
        var lToY = rowmemory.get(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
        var lHeight = lToY - lFromY;
        pArcMem.arc.label = "";

        return createBox(pArcMem.id, entities.getOAndD(pArcMem.arc.from, pArcMem.arc.to), pArcMem.arc, lHeight);
    }

    function renderLifeLines(pEntities, pClass, pHeight, pId) {
        if (!pId) {
            pId = pClass;
        }
        if (!pHeight || pHeight < gChart.arcRowHeight) {
            pHeight = gChart.arcRowHeight;
        }
        var lGroup = fact.createGroup(pId);

        pEntities.forEach(function(pEntity) {
            var lLine = fact.createLine({
                                    xFrom: entities.getX(pEntity.name),
                                    yFrom: 0 - (pHeight / 2),
                                    xTo: entities.getX(pEntity.name),
                                    yTo: (pHeight / 2)
                                },
                                pClass);
            if (pEntity.linecolor) {
                lLine.setAttribute("style", "stroke : " + pEntity.linecolor + ";");
            }
            lGroup.appendChild(lLine);
        });

        return lGroup;
    }

    function createSelfRefArc(pKind, pFrom, pYTo, pDouble, pLineColor) {
        // globals: (gChart ->) arcRowHeight, (entities ->) interEntitySpacing
        
        var lHeight = 2 * (gChart.arcRowHeight / 5);
        var lWidth = entities.getDims().interEntitySpacing / 2;

        var lGroup = fact.createGroup();
        if (pDouble) {
            /* we need a middle turn to attach the arrow to */
            var lInnerTurn  = fact.createUTurn({x:pFrom, y:lHeight/ 2}, (pYTo + lHeight - 4), lWidth - 4, "double");
            var lMiddleTurn = fact.createUTurn({x:pFrom, y:lHeight/ 2}, (pYTo + lHeight - 2), lWidth);
            var lOuterTurn  = fact.createUTurn({x:pFrom, y:lHeight/ 2},     (pYTo + lHeight ), lWidth, "double");
            lInnerTurn.setAttribute("style", "stroke:" + pLineColor);
            lMiddleTurn.setAttribute("style", mark.getLineStyle(id.get(), pKind, pLineColor, pFrom, pFrom) + "stroke:transparent;");
            lOuterTurn.setAttribute("style", "stroke:" + pLineColor);
            lGroup.appendChild(lInnerTurn);
            lGroup.appendChild(lOuterTurn);
            lGroup.appendChild(lMiddleTurn);
        } else {
            var lUTurn = fact.createUTurn({x:pFrom, y:lHeight / 2}, (pYTo + lHeight), lWidth);
            lUTurn.setAttribute("style", mark.getLineStyle(id.get(), pKind, pLineColor, pFrom, pFrom));
            lGroup.appendChild(lUTurn);
        }

        return lGroup;
    }

    function renderEmptyArc(pArc, pId) {
        var lElement;

        if (pArc.from && pArc.to) {
            if (entities.getX(pArc.from) > entities.getX(pArc.to)) {
                utl.swapfromto(pArc);
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

    function determineArcYTo(pArc){
        if (pArc.arcskip) {
            /* TODO: derive from hashmap */
            return pArc.arcskip * gChart.arcRowHeight;
        } else {
            return 0;
        }
    }

    function createArc(pId, pArc, pFrom, pTo) {
        var lGroup = fact.createGroup(pId);
        // var lClass = id.get(map.determineArcClass(pArc.kind, pFrom, pTo));
        var lClass = (pArc.kind === "<:>") ? "bidi" : ((pArc.kind === "::") ? "nodi" : "" );
        var lDoubleLine = [":>", "::", "<:>"].indexOf(pArc.kind) > -1;
        var lYTo = determineArcYTo(pArc);
        var lArcGradient = (lYTo === 0) ? gChart.arcGradient: lYTo;

        pTo = utl.determineArcXTo(pArc.kind, pFrom, pTo);

        pArc.label = utl.oneLineLabelsFix(pArc.label);

        if (pFrom === pTo) {
            lGroup.appendChild(createSelfRefArc(pArc.kind, pFrom, lYTo, lDoubleLine, pArc.linecolor));
            lGroup.appendChild(createTextLabel(pId + "_txt", pArc, pFrom + 2 - (entities.getDims().interEntitySpacing / 2), 0 - (gChart.arcRowHeight / 5), entities.getDims().interEntitySpacing, "anchor-start"));
        } else {
            var lLine = fact.createLine({xFrom: pFrom, yFrom: 0, xTo: pTo, yTo: lArcGradient}, lClass, lDoubleLine);
            lLine.setAttribute("style", mark.getLineStyle(id.get(), pArc.kind, pArc.linecolor, pFrom, pTo));
            lGroup.appendChild(lLine);
            lGroup.appendChild(createTextLabel(pId + "_txt", pArc, pFrom, 0, pTo - pFrom));
        }
        return lGroup;
    }

    function renderTextLabelLine(pGroup, pLine, pMiddle, pStartY, pClass, pArc, pPosition) {
        var lText = {};
        var lY = pStartY + svgutl.calculateTextHeight() / 4 + (pPosition * svgutl.calculateTextHeight());
        if (pPosition === 0) {
            lText = fact.createText(pLine, pMiddle, lY, pClass, pArc.url, pArc.id, pArc.idurl);
        } else {
            lText = fact.createText(pLine, pMiddle, lY, pClass, pArc.url);
        }

        var lRect = fact.createRect(svgutl.getBBox(lText), "textbg");
        utl.colorText(lText, pArc.textcolor);
        if (pArc.textbgcolor) {
            lRect.setAttribute("style", "fill: " + pArc.textbgcolor + "; stroke:" + pArc.textbgcolor + ";");
        }
        utl.colorLink(lText, pArc.url, pArc.textcolor);
        
        pGroup.appendChild(lRect);
        pGroup.appendChild(lText);
        return pGroup;
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
        var lGroup = fact.createGroup(pId);
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

            var lStartY = pStartY - (((lLines.length - 1) * svgutl.calculateTextHeight()) / 2) - ((lLines.length - 1) / 2);
            lLines.forEach(function(pLine, pLineNumber){
                lGroup = renderTextLabelLine(lGroup, pLine, lMiddle, lStartY, pClass, pArc, pLineNumber);
                lStartY++;
            });
        }
        return lGroup;
    }
    
    function renderBoxLabelLine(pGroup, pLine, pMiddle, pStartY, pArc, pPosition, pClass) {
        var lText = {};
        var lY = pStartY + svgutl.calculateTextHeight() / 4 + (pPosition * svgutl.calculateTextHeight());
        if (pPosition === 0) {
            lText = fact.createText(pLine, pMiddle, lY, pClass, pArc.url, pArc.id, pArc.idurl);
        } else {
            lText = fact.createText(pLine, pMiddle, lY, pClass, pArc.url);
        }

        utl.colorText(lText, pArc.textcolor);
        utl.colorLink(lText, pArc.url, pArc.textcolor);

        pGroup.appendChild(lText);
        return pGroup;
    }
        
    /**
     * createBoxLabel() - renders the text (label, id, url) for a given pArc
     * with a bounding box starting at pStartX, pStartY and of a width of at
     * most pWidth (all in pixels)
     *
     * @param <string> - pId - the unique identification of the textlabe (group) within the svg
     * @param <objec> - pArc - the arc of which to render the text
     * @param <number> - pStartX
     * @param <number> - pStartY
     * @param <number> - pWidth
     */
    function createBoxLabel(pId, pArc, pStartX, pStartY, pWidth, pClass) {
        var lGroup = fact.createGroup(pId);
        /* pArc:
         *   label & id
         *   url & idurl
         */

        if (pArc.label) {
            var lMiddle = pStartX + (pWidth / 2);
            pArc.label = txt.unescapeString(pArc.label);
            var lLines = txt.splitLabel(pArc.label, pArc.kind, pWidth);

            var lStartY = pStartY - (((lLines.length - 1) * svgutl.calculateTextHeight()) / 2) - ((lLines.length - 1) / 2);
            lLines.forEach(function(pLine, pLineNumber){
                lGroup = renderBoxLabelLine(lGroup, pLine, lMiddle, lStartY, pArc, pLineNumber, pClass);
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
        var lArcEnd = gChart.arcEndX;
        var lGroup = fact.createGroup(pId);

        if (pArc.from && pArc.to) {
            lArcStart = entities.getX(pArc.from);
            lArcEnd = Math.abs(entities.getX(pArc.to) - entities.getX(pArc.from));
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
        var lEndX = gChart.arcEndX;
        var lClass = "dotted";
        var lGroup = fact.createGroup(pId);

        if (pArc.from && pArc.to) {
            var lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * C.LINE_WIDTH;

            lStartX = (entities.getX(pArc.from) - (entities.getDims().interEntitySpacing + 2 * C.LINE_WIDTH) / 2) - lArcDepthCorrection;
            lEndX = (entities.getX(pArc.to) + (entities.getDims().interEntitySpacing + 2 * C.LINE_WIDTH) / 2) + lArcDepthCorrection;
            lClass = "striped";
        }
        var lLine = fact.createLine({xFrom: lStartX, yFrom: 0, xTo: lEndX, yTo: 0}, lClass);

        lGroup.appendChild(lLine);
        lGroup.appendChild(createLifeLinesText(pId + "_txt", pArc));

        if (pArc.linecolor) {
            lLine.setAttribute("style", "stroke: " + pArc.linecolor + ";");
        }

        return lGroup;
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
    function createBox(pId, pOAndD, pArc, pHeight) {
        if (pOAndD.from > pOAndD.to) {
            utl.swapfromto(pOAndD);
        }
        var lWidth = ((pOAndD.to - pOAndD.from) + entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH);
        var NOTE_FOLD_SIZE = 9;
        // px
        var RBOX_CORNER_RADIUS = 6;
        // px

        var lStart = pOAndD.from - ((entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH) / 2);
        var lGroup = fact.createGroup(pId);
        var lBox;
        var lTextGroup = createBoxLabel(pId + "_txt", pArc, lStart, 0, lWidth);
        var lTextBBox = svgutl.getBBox(lTextGroup);

        var lHeight = pHeight ? pHeight : Math.max(lTextBBox.height + 2 * C.LINE_WIDTH, gChart.arcRowHeight - 2 * C.LINE_WIDTH);
        var lBBox = {width: lWidth, height: lHeight, x: lStart, y: (0 - lHeight / 2)};

        switch (pArc.kind) {
            case ("box") :
                lBox = fact.createRect(lBBox, "box");
                break;
            case ("rbox") :
                lBox = fact.createRect(lBBox, "box", RBOX_CORNER_RADIUS, RBOX_CORNER_RADIUS);
                break;
            case ("abox") :
                lBBox.y = 0;
                lBox = fact.createABox(lBBox, "box");
                break;
            case ("note") :
                lBox = fact.createNote(lBBox, "box", NOTE_FOLD_SIZE);
                break;
            default :
                var lArcDepthCorrection = (gChart.maxDepth - pArc.depth ) * 2 * C.LINE_WIDTH;
                lBox = fact.createRect({width: lWidth + lArcDepthCorrection * 2, height: lHeight, x: lStart - lArcDepthCorrection, y: 0}, "box");
        }
        utl.colorBox(lBox, pArc);
        lGroup.appendChild(lBox);
        lGroup.appendChild(lTextGroup);

        return lGroup;
    }

    function _clean(pParentElementId, pWindow) {
        gChart.document = skel.init(pWindow);
        svgutl.init(gChart.document);
        svgutl.removeRenderedSVGFromElement(pParentElementId);
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
