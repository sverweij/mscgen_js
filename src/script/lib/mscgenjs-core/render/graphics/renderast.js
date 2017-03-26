/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
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

    var svgelementfactory  = require("./svgelementfactory/index");
    var svgutensils        = require("./svgutensils");
    var renderutensils     = require("./renderutensils");
    var renderskeleton     = require("./renderskeleton");
    var flatten            = require("../astmassage/flatten");
    var kind2class         = require("./kind2class");
    var aggregatekind      = require("../astmassage/aggregatekind");
    var rowmemory          = require("./rowmemory");
    var idmanager          = require("./idmanager");
    var markermanager      = require("./markermanager");
    var entities           = require("./entities");
    var renderlabels       = require("./renderlabels");
    var constants          = require("./constants");
    var _                  = require("../../lib/lodash/lodash.custom");

    var PAD_VERTICAL          = 3;
    var DEFAULT_ARCROW_HEIGHT = 38; // chart only
    var DEFAULT_ARC_GRADIENT  = 0; // chart only

    /* sensible default - get overwritten in bootstrap */
    var gChart = Object.seal({
        "arcRowHeight"           : DEFAULT_ARCROW_HEIGHT,
        "arcGradient"            : DEFAULT_ARC_GRADIENT,
        "arcEndX"                : 0,
        "wordWrapArcs"           : false,
        "mirrorEntitiesOnBottom" : false,
        "regularArcTextVerticalAlignment": "middle",
        "maxDepth"               : 0,
        "document"               : {},
        "layer"                  : {
            "lifeline"     : {},
            "sequence"     : {},
            "notes"        : {},
            "inline"       : {},
            "watermark"    : {}
        }
    });
    var gInlineExpressionMemory = [];

    function _renderASTNew(pAST, pWindow, pParentElementId, pOptions) {
        var lAST = Object.seal(flatten.flatten(pAST));
        var lOptions = pOptions || {};

        lOptions = _.defaults(lOptions, {
            source                 : null,
            styleAdditions         : null,
            mirrorEntitiesOnBottom : false,
            regularArcTextVerticalAlignment: "middle"
        });

        renderASTPre(
            lAST,
            pWindow,
            pParentElementId,
            lOptions
        );
        renderASTMain(lAST);
        renderASTPost(lAST);
        var lElement = pWindow.document.getElementById(pParentElementId);
        if (lElement) {
            return svgutensils.webkitNamespaceBugWorkaround(lElement.innerHTML);
        } else {
            return svgutensils.webkitNamespaceBugWorkaround(pWindow.document.body.innerHTML);
        }
    }

    function normalizeVerticalAlignment(pVerticalAlignment) {
        var lRetval = "middle";
        var VALID_ALIGNMENT_VALUES = ["above", "middle", "below"];

        if (VALID_ALIGNMENT_VALUES.some(
            function(pValue){
                return pValue === pVerticalAlignment;
            }
        )){
            lRetval = pVerticalAlignment;
        }

        return lRetval;
    }

    function renderASTPre(pAST, pWindow, pParentElementId, pOptions){
        idmanager.setPrefix(pParentElementId);

        gChart.document = renderskeleton.bootstrap(
            pWindow,
            pParentElementId,
            idmanager.get(),
            markermanager.getMarkerDefs(idmanager.get(), pAST),
            pOptions
        );
        gChart.mirrorEntitiesOnBottom = Boolean(pOptions.mirrorEntitiesOnBottom);
        gChart.regularArcTextVerticalAlignment = normalizeVerticalAlignment(pOptions.regularArcTextVerticalAlignment);
        svgutensils.init(gChart.document);

        gChart.layer = createLayerShortcuts(gChart.document);
        gChart.maxDepth = pAST.depth;

        preProcessOptions(gChart, pAST.options);
    }

    function renderASTMain(pAST){
        renderEntities(pAST.entities);
        rowmemory.clear(entities.getDims().height, gChart.arcRowHeight);
        renderArcRows(pAST.arcs, pAST.entities);
        if (gChart.mirrorEntitiesOnBottom){
            renderEntitiesOnBottom(pAST.entities);
        }
    }

    function renderASTPost(pAST){
        var lCanvas = calculateCanvasDimensions(pAST);

        /* canvg ignores the background-color on svg level and makes the background
         * transparent in stead. To work around this insert a white rectangle the size
         * of the canvas in the background layer.
         *
         * We do this _before_ scaling is applied to the svg
         */
        renderBackground(lCanvas);
        lCanvas = postProcessOptions(pAST.options, lCanvas);
        renderSvgElement(lCanvas);
    }

    function createLayerShortcuts (pDocument){
        return {
            lifeline  : pDocument.getElementById(idmanager.get("__lifelinelayer")),
            sequence  : pDocument.getElementById(idmanager.get("__sequencelayer")),
            notes     : pDocument.getElementById(idmanager.get("__notelayer")),
            inline    : pDocument.getElementById(idmanager.get("__arcspanlayer")),
            watermark : pDocument.getElementById(idmanager.get("__watermark"))
        };
    }

    function preProcessOptionsArcs(pChart, pOptions){
        pChart.arcRowHeight = DEFAULT_ARCROW_HEIGHT;
        pChart.arcGradient  = DEFAULT_ARC_GRADIENT;
        pChart.wordWrapArcs = false;

        if (pOptions) {
            if (pOptions.arcgradient) {
                pChart.arcRowHeight = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARCROW_HEIGHT;
                pChart.arcGradient  = parseInt(pOptions.arcgradient, 10) + DEFAULT_ARC_GRADIENT;
            }
            pChart.wordWrapArcs = Boolean(pOptions.wordwraparcs);
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
        entities.init(pOptions && pOptions.hscale);
        preProcessOptionsArcs(pChart, pOptions);
    }

    function calculateCanvasDimensions(pAST){
        var lDepthCorrection = renderutensils.determineDepthCorrection(pAST.depth, constants.LINE_WIDTH);
        var lRowInfo = rowmemory.getLast();
        var lCanvas = {
            "width" :
                (pAST.entities.length * entities.getDims().interEntitySpacing) + lDepthCorrection,
            "height" :
                Boolean(gChart.mirrorEntitiesOnBottom)
                ? (2 * entities.getDims().height) + lRowInfo.y + lRowInfo.height + 2 * PAD_VERTICAL
                : lRowInfo.y + (lRowInfo.height / 2) + 2 * PAD_VERTICAL,
            "horizontaltransform" :
                (entities.getDims().interEntitySpacing + lDepthCorrection - entities.getDims().width) / 2,
            "autoscale" :
                !!pAST.options && !!pAST.options.width && pAST.options.width === "auto",
            "verticaltransform" :
                PAD_VERTICAL,
            "scale" : 1
        };
        lCanvas.x = 0 - lCanvas.horizontaltransform;
        lCanvas.y = 0 - lCanvas.verticaltransform;
        return lCanvas;
    }

    function renderBackground(pCanvas) {
        gChart.document.getElementById(idmanager.get("__background")).appendChild(
            svgelementfactory.createRect(pCanvas, "bglayer")
        );
    }

    function renderWatermark(pWatermark, pCanvas) {
        gChart.layer.watermark.appendChild(
            svgelementfactory.createDiagonalText(pWatermark, pCanvas, "watermark")
        );
    }

    function postProcessOptions(pOptions, pCanvas) {
        if (pOptions) {
            if (pOptions.watermark) {
                renderWatermark(pOptions.watermark, pCanvas);
            }
            if (pOptions.width && pOptions.width !== "auto") {
                pCanvas = renderutensils.scaleCanvasToWidth(pOptions.width, pCanvas);
            }
        }
        return pCanvas;
    }

    function renderSvgElement(pCanvas) {
        var lSvgElement = gChart.document.getElementById(idmanager.get());
        var lBody = gChart.document.getElementById(idmanager.get("__body"));
        lBody.setAttribute(
            "transform",
            "translate(" + pCanvas.horizontaltransform + "," + pCanvas.verticaltransform +
                ") scale(" + pCanvas.scale + "," + pCanvas.scale + ")"
        );
        if (!!pCanvas.autoscale && pCanvas.autoscale === true){
            svgelementfactory.updateSVG(
                lSvgElement,
                {
                    width: "100%",
                    height: "100%",
                    viewBox: "0 0 " + pCanvas.width.toString() + " " + pCanvas.height.toString()
                }
            );
        } else {
            svgelementfactory.updateSVG(
                lSvgElement,
                {
                    width: pCanvas.width.toString(),
                    height: pCanvas.height.toString(),
                    viewBox: "0 0 " + pCanvas.width.toString() + " " + pCanvas.height.toString()
                }
            );
        }
    }

    /* ----------------------START entity shizzle-------------------------------- */
    /**
     * getMaxEntityHeight() -
     * crude method for determining the max entity height;
     * - take the entity with the most number of lines
     * - if that number > 2 (default entity hight easily fits 2 lines of text)
     *   - render that entity
     *   - return the height of its bbox
     *
     * @param <object> - pEntities - the entities subtree of the AST
     * @return <int> - height - the height of the heighest entity
     */
    function getMaxEntityHeight(pEntities){
        var lHighestEntity = pEntities[0];
        var lHWM = 2;
        pEntities.forEach(function(pEntity){
            var lNoEntityLines = entities.getNoEntityLines(pEntity.label, constants.FONT_SIZE);
            if (lNoEntityLines > lHWM){
                lHWM = lNoEntityLines;
                lHighestEntity = pEntity;
            }
        });

        if (lHWM > 2){
            return Math.max(
                entities.getDims().height,
                svgutensils.getBBox(
                    renderEntity(lHighestEntity)
                ).height
            );
        }
        return entities.getDims().height;
    }

    function renderEntity(pEntity, pX) {
        var lGroup = svgelementfactory.createGroup();
        var lBBox = entities.getDims();
        lBBox.x = pX ? pX : 0;
        lGroup.appendChild(
            svgelementfactory.createRect(
                lBBox,
                "entity",
                pEntity.linecolor,
                pEntity.textbgcolor
            )
        );
        lGroup.appendChild(
            renderlabels.createLabel(
                pEntity,
                {
                    x:lBBox.x,
                    y:lBBox.height / 2,
                    width:lBBox.width
                },
                {
                    kind: "entity"
                }
            )
        );
        return lGroup;
    }

    function renderEntitiesOnBottom(pEntities) {
        var lLifeLineSpacerY = rowmemory.getLast().y + (rowmemory.getLast().height + gChart.arcRowHeight) / 2;

        /*
            insert a life line between the last arc and the entities so there's
            some visual breathing room
         */

        createLifeLines(
            pEntities,
            "arcrow",
            null,
            lLifeLineSpacerY
        ).forEach(function(pLifeLine){
            gChart.layer.lifeline.appendChild(pLifeLine);
        });

        gChart.layer.sequence.appendChild(
            svgelementfactory.createUse(
                {
                    x:0,
                    y:lLifeLineSpacerY + gChart.arcRowHeight / 2
                },
                idmanager.get("entities")
            )
        );
    }

    /**
     * renderEntities() - renders the given pEntities (subtree of the AST) into
     * the gChart.layer.sequence layer
     *
     * @param <object> - pEntities - the entities to render
     */
    function renderEntities(pEntities) {
        var lEntityXPos = 0;
        var lEntityGroup = svgelementfactory.createGroup(idmanager.get("entities"));

        if (pEntities) {
            entities.setHeight(getMaxEntityHeight(pEntities) + constants.LINE_WIDTH * 2);

            pEntities.forEach(function(pEntity){
                lEntityGroup.appendChild(renderEntity(pEntity, lEntityXPos));
                entities.setX(pEntity, lEntityXPos);
                lEntityXPos += entities.getDims().interEntitySpacing;
            });
            gChart.layer.sequence.appendChild(
                lEntityGroup
            );
        }
        gChart.arcEndX =
            lEntityXPos -
            entities.getDims().interEntitySpacing + entities.getDims().width;

    }

    /* ------------------------END entity shizzle-------------------------------- */

    function renderBroadcastArc(pArc, pEntities, lRowMemory, pY) {
        var xTo    = 0;
        var lLabel = pArc.label;
        var xFrom  = entities.getX(pArc.from);

        pArc.label = "";

        pEntities.forEach(function(pEntity){
            var lElement = {};

            if (pEntity.name !== pArc.from) {
                xTo = entities.getX(pEntity.name);
                lElement = createArc(pArc, xFrom, xTo, pY);
                lRowMemory.push({
                    layer : gChart.layer.sequence,
                    element: lElement
                });
            }
        });

        pArc.label = lLabel;
    }

    function renderRegularArc(pArc, pEntities, pRowMemory, pY){
        var lElement = {};

        if (pArc.from && pArc.to) {
            if (pArc.to === "*") { // it's a broadcast arc
                renderBroadcastArc(pArc, pEntities, pRowMemory, pY);
                /* creates a label on the current line, smack in the middle */
                lElement =
                    renderlabels.createLabel(
                        pArc,
                        {
                            x     : 0,
                            y     : pY,
                            width : gChart.arcEndX
                        },
                        {
                            alignAround   : true,
                            ownBackground : true,
                            wordWrapArcs  : gChart.wordWrapArcs
                        }
                    );
                pRowMemory.push({
                    title : pArc.title,
                    layer : gChart.layer.sequence,
                    element: lElement
                });
            } else { // it's a regular arc
                lElement =
                    createArc(
                        pArc,
                        entities.getX(pArc.from),
                        entities.getX(pArc.to),
                        pY
                    );
                pRowMemory.push({
                    title : pArc.title,
                    layer : gChart.layer.sequence,
                    element: lElement
                });
            }  // / lTo or pArc.from === "*"
        }// if both a from and a to
        return lElement;
    }

    function getArcRowHeight (pArcRow, pRowNumber, pEntities) {
        var lRetval = 0;

        pArcRow.forEach(function(pArc){
            var lElement = {};

            switch (aggregatekind.getAggregate(pArc.kind)) {
            case ("emptyarc"):
                lElement = renderEmptyArc(pArc, 0);
                break;
            case ("box"):
                lElement = createBox(entities.getOAndD(pArc.from, pArc.to), pArc, 0);
                break;
            case ("inline_expression"):
                lElement = renderInlineExpressionLabel(pArc, 0);
                break;
            default:
                lElement = renderRegularArc(pArc, pEntities, [], 0);
            }// switch

            lRetval = Math.max(
                lRetval,
                svgutensils.getBBox(lElement).height + 2 * constants.LINE_WIDTH
            );
        });// for all arcs in a row

        return lRetval;
    }

    function renderArcRow (pArcRow, pRowNumber, pEntities){
        var lArcRowClass = "arcrow";
        var lRowMemory = [];

        rowmemory.set(
            pRowNumber,
            Math.max(
                rowmemory.get(pRowNumber).height,
                getArcRowHeight(pArcRow, pRowNumber, pEntities)
            )
        );

        pArcRow.forEach(function(pArc){
            var lElement = {};

            switch (aggregatekind.getAggregate(pArc.kind)) {
            case ("emptyarc"):
                lElement = renderEmptyArc(pArc, rowmemory.get(pRowNumber).y);
                if ("..." === pArc.kind) {
                    lArcRowClass = "arcrowomit";
                }
                lRowMemory.push({
                    layer : gChart.layer.sequence,
                    element: lElement
                });
                break;
            case ("box"):
                lElement = createBox(
                    entities.getOAndD(pArc.from, pArc.to),
                    pArc,
                    rowmemory.get(pRowNumber).y
                );
                lRowMemory.push({
                    title : pArc.title,
                    layer : gChart.layer.notes,
                    element: lElement
                });
                break;
            case ("inline_expression"):
                lElement = renderInlineExpressionLabel(pArc, rowmemory.get(pRowNumber).y);
                lRowMemory.push({
                    layer : gChart.layer.notes,
                    element: lElement
                });
                gInlineExpressionMemory.push({
                    arc    : pArc,
                    rownum : pRowNumber
                });
                break;
            default:
                lElement = renderRegularArc(
                    pArc,
                    pEntities,
                    lRowMemory,
                    rowmemory.get(pRowNumber).y
                );
            }// switch

        });// for all arcs in a row

        /*
         *  only here we can determine the height of the row and the y position
         */
        createLifeLines(
            pEntities,
            lArcRowClass,
            rowmemory.get(pRowNumber).height,
            rowmemory.get(pRowNumber).y
        ).forEach(function(pLifeLine){
            gChart.layer.lifeline.appendChild(pLifeLine);
        });

        lRowMemory.forEach(function(pRowMemoryLine){
            if (pRowMemoryLine.element){
                if (pRowMemoryLine.title) {
                    pRowMemoryLine.element.appendChild(svgelementfactory.createTitle(pRowMemoryLine.title));
                }
                pRowMemoryLine.layer.appendChild(pRowMemoryLine.element);
            }
        });
    }

    /** renderArcRows() - renders the arcrows from an AST
     *
     * @param <object> - pArcRows - the arc rows to render
     * @param <object> - pEntities - the entities to consider
     */
    function renderArcRows(pArcRows, pEntities) {
        gInlineExpressionMemory = [];

        /* put some space between the entities and the arcs */
        createLifeLines(
            pEntities,
            "arcrow",
            null,
            rowmemory.get(-1).y
        ).forEach(function(pLifeLine){
            gChart.layer.lifeline.appendChild(pLifeLine);
        });

        if (pArcRows) {
            for (var i = 0; i < pArcRows.length; i++){
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
     * @param <object> pArc - the arc spanning arc
     * @param <number pY - where to start
     */
    function renderInlineExpressionLabel(pArc, pY) {
        var lOnD = entities.getOAndD(pArc.from, pArc.to);
        var FOLD_SIZE = 7;
        var lLabelContentAlreadyDetermined = pY > 0;

        var lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;

        var lMaxWidth =
            (lOnD.to - lOnD.from) +
            (entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH) -
            FOLD_SIZE -
            constants.LINE_WIDTH;

        var lStart =
            (lOnD.from - ((entities.getDims().interEntitySpacing - 3 * constants.LINE_WIDTH - lMaxDepthCorrection) / 2) -
            (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH);

        var lGroup = svgelementfactory.createGroup();
        if (!lLabelContentAlreadyDetermined){
            pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
        }

        var lTextGroup = renderlabels.createLabel(
            pArc,
            {
                x: lStart + constants.LINE_WIDTH - (lMaxWidth / 2),
                y: pY + gChart.arcRowHeight / 4,
                width:lMaxWidth
            },
            {
                alignLeft: true,
                ownBackground: false,
                wordWrapArcs: gChart.wordWrapArcs
            }
        );

        var lBBox = svgutensils.getBBox(lTextGroup);

        var lHeight =
            Math.max(
                lBBox.height + 2 * constants.LINE_WIDTH,
                (gChart.arcRowHeight / 2) - 2 * constants.LINE_WIDTH
            );
        var lWidth =
            Math.min(
                lBBox.width + 2 * constants.LINE_WIDTH,
                lMaxWidth
            );

        var lBox =
            svgelementfactory.createEdgeRemark(
                {
                    width: lWidth - constants.LINE_WIDTH + FOLD_SIZE,
                    height: lHeight,
                    x: lStart,
                    y: pY
                },
                "box inline_expression_label",
                pArc.linecolor,
                pArc.textbgcolor,
                FOLD_SIZE
            );
        lGroup.appendChild(lBox);
        lGroup.appendChild(lTextGroup);

        return lGroup;
    }

    function renderInlineExpressions(pInlineExpressions) {
        pInlineExpressions.forEach(
            function(pInlineExpression){
                gChart.layer.inline.appendChild(
                    renderInlineExpression(pInlineExpression, rowmemory.get(pInlineExpression.rownum).y)
                );
            }
        );
    }

    function renderInlineExpression(pArcMem, pY) {
        var lFromY = rowmemory.get(pArcMem.rownum).y;
        var lToY = rowmemory.get(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
        var lHeight = lToY - lFromY;
        pArcMem.arc.label = "";

        return createInlineExpressionBox(
            entities.getOAndD(pArcMem.arc.from, pArcMem.arc.to),
            pArcMem.arc,
            lHeight,
            pY
        );
    }

    function createLifeLines(pEntities, pClass, pHeight, pY) {
        if (!pHeight || pHeight < gChart.arcRowHeight) {
            pHeight = gChart.arcRowHeight;
        }

        return pEntities.map(function(pEntity) {
            var lLine = svgelementfactory.createLine(
                {
                    xFrom: entities.getX(pEntity.name),
                    yFrom: 0 - (pHeight / 2) + (pY ? pY : 0),
                    xTo: entities.getX(pEntity.name),
                    yTo: (pHeight / 2) + (pY ? pY : 0)
                },
                {
                    class: pClass
                }
            );
            if (pEntity.linecolor) {
                lLine.setAttribute("style", "stroke:" + pEntity.linecolor + ";");
            }
            return lLine;
        });
    }

    function createSelfRefArc(pKind, pFrom, pYTo, pDouble, pLineColor, pY) {
        // globals: (gChart ->) arcRowHeight, (entities ->) interEntitySpacing

        var lHeight = 2 * (gChart.arcRowHeight / 5);
        var lWidth = entities.getDims().interEntitySpacing / 2;
        var lRetval = {};
        var lClass = "arc " + kind2class.getAggregateClass(pKind) + " " + kind2class.getClass(pKind);

        if (pDouble) {
            lRetval = svgelementfactory.createGroup();
            var lInnerTurn  = svgelementfactory.createUTurn(
                {x:pFrom, y: pY},
                (pY + pYTo + lHeight - 2 * constants.LINE_WIDTH),
                lWidth - 2 * constants.LINE_WIDTH,
                lClass,
                pKind !== "::",
                lHeight
            );
            /* we need a middle turn to attach the arrow to */
            var lMiddleTurn = svgelementfactory.createUTurn(
                {x:pFrom, y:pY},
                (pY + pYTo + lHeight - constants.LINE_WIDTH),
                lWidth,
                null,
                null,
                lHeight
            );
            var lOuterTurn  = svgelementfactory.createUTurn(
                {x:pFrom, y:pY},
                (pY + pYTo + lHeight),
                lWidth,
                lClass,
                pKind !== "::",
                lHeight
            );
            if (Boolean(pLineColor)){
                lInnerTurn.setAttribute("style", "stroke:" + pLineColor);
            }
            markermanager.getAttributes(idmanager.get(), pKind, pLineColor, pFrom, pFrom).forEach(function(pAttribute){
                lMiddleTurn.setAttribute(pAttribute.name, pAttribute.value);
            });
            lMiddleTurn.setAttribute("style", "stroke:transparent;");
            if (Boolean(pLineColor)){
                lOuterTurn.setAttribute("style", "stroke:" + pLineColor);
            }
            lRetval.appendChild(lInnerTurn);
            lRetval.appendChild(lOuterTurn);
            lRetval.appendChild(lMiddleTurn);
            lRetval.setAttribute("class", lClass);
        } else {
            lRetval = svgelementfactory.createUTurn(
                {
                    x:pFrom,
                    y:pY
                },
                (pY + pYTo + lHeight),
                lWidth,
                lClass,
                pKind === "-x",
                lHeight
            );
            markermanager.getAttributes(idmanager.get(), pKind, pLineColor, pFrom, pFrom).forEach(
                function(pAttribute){
                    lRetval.setAttribute(pAttribute.name, pAttribute.value);
                }
            );
        }

        return lRetval;
    }

    function renderEmptyArc(pArc, pY) {
        if (pArc.kind === "---"){
            return createComment(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
        } else { /* "..." / "|||" */
            return createLifeLinesText(pArc, entities.getOAndD(pArc.from, pArc.to), pY);
        }
    }

    function determineArcYTo(pArc){
        return pArc.arcskip ? pArc.arcskip * gChart.arcRowHeight : 0;
    }

    function determineDirectionClass(pArcKind) {
        if (pArcKind === "<:>"){
            return "bidi ";
        } else if (pArcKind === "::"){
            return "nodi ";
        }
        return "";
    }

    function createArc(pArc, pFrom, pTo, pY) {
        var lGroup = svgelementfactory.createGroup();
        var lClass = "arc ";
        lClass += determineDirectionClass(pArc.kind);
        lClass += kind2class.getAggregateClass(pArc.kind) + " " + kind2class.getClass(pArc.kind);
        var lDoubleLine = [":>", "::", "<:>"].indexOf(pArc.kind) > -1;
        var lYTo = determineArcYTo(pArc, pY);
        var lArcGradient = (lYTo === 0) ? gChart.arcGradient : lYTo;

        pTo = renderutensils.determineArcXTo(pArc.kind, pFrom, pTo);

        if (pFrom === pTo) {
            lGroup.appendChild(
                createSelfRefArc(pArc.kind, pFrom, lYTo, lDoubleLine, pArc.linecolor, pY)
            );

            /* creates a label left aligned, a little above the arc*/
            var lTextWidth = 2 * entities.getDims().interEntitySpacing / 3;
            lGroup.appendChild(
                renderlabels.createLabel(
                    pArc,
                    {
                        x:pFrom + 1.5 * constants.LINE_WIDTH - (lTextWidth / 2),
                        y:pY - (gChart.arcRowHeight / 5) - constants.LINE_WIDTH / 2,
                        width:lTextWidth
                    },
                    {
                        alignLeft: true,
                        alignAbove: true,
                        ownBackground: true,
                        wordWrapArcs: gChart.wordWrapArcs
                    }
                )
            );
        } else {
            var lLine = svgelementfactory.createLine(
                {xFrom: pFrom, yFrom: pY, xTo: pTo, yTo: pY + lArcGradient},
                {
                    class: lClass,
                    doubleLine: lDoubleLine
                }
            );
            markermanager.getAttributes(
                idmanager.get(), pArc.kind, pArc.linecolor, pFrom, pTo
            ).forEach(function(pAttribute){
                lLine.setAttribute(pAttribute.name, pAttribute.value);
            });
            lGroup.appendChild(lLine);

            /* create a label centered on the arc */
            lGroup.appendChild(
                renderlabels.createLabel(
                    pArc,
                    {x: pFrom, y: pY, width: pTo - pFrom},
                    {
                        alignAround: true,
                        alignAbove: (gChart.regularArcTextVerticalAlignment === "above"),
                        ownBackground: true,
                        wordWrapArcs: gChart.wordWrapArcs
                    }
                )
            );
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
    function createLifeLinesText(pArc, pOAndD, pY) {
        var lArcStart = 0;
        var lArcEnd   = gChart.arcEndX;

        if (pArc.from && pArc.to) {
            lArcStart = pOAndD.from;
            lArcEnd   = pOAndD.to - pOAndD.from;
        }
        return renderlabels.createLabel(
            pArc,
            {x:lArcStart, y:pY, width:lArcEnd},
            {ownBackground:true, wordWrapArcs: gChart.wordWrapArcs}
        );
    }

    /**
     * createComment() - creates an element representing a comment ('---')
     *
     * @param <string> - pId - the unique identification of the comment within the svg
     * @param <object> - pArc - the (comment) arc to render
     */
    function createComment(pArc, pOAndD, pY) {
        var lStartX = 0;
        var lEndX = gChart.arcEndX;
        var lClass = "comment";
        var lGroup = svgelementfactory.createGroup();

        if (pArc.from && pArc.to) {
            var lMaxDepthCorrection = gChart.maxDepth * 1 * constants.LINE_WIDTH;
            var lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH;

            lStartX =
                (pOAndD.from -
                  (entities.getDims().interEntitySpacing + 2 * constants.LINE_WIDTH) / 2) -
                (lArcDepthCorrection - lMaxDepthCorrection);
            lEndX   =
                (pOAndD.to +
                  (entities.getDims().interEntitySpacing + 2 * constants.LINE_WIDTH) / 2) +
                (lArcDepthCorrection - lMaxDepthCorrection);
            lClass  = "inline_expression_divider";
        }
        var lLine =
            svgelementfactory.createLine(
                {
                    xFrom: lStartX,
                    yFrom: pY,
                    xTo: lEndX,
                    yTo: pY
                },
                {
                    class: lClass
                }
            );

        lGroup.appendChild(lLine);
        lGroup.appendChild(createLifeLinesText(pArc, pOAndD, pY));

        if (pArc.linecolor) {
            lLine.setAttribute("style", "stroke:" + pArc.linecolor + ";");
        }

        return lGroup;
    }

    function createInlineExpressionBox(pOAndD, pArc, pHeight, pY) {
        /* begin: same as createBox */
        var lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;
        var lWidth =
            (pOAndD.to - pOAndD.from) +
            entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection; // px
        var lStart =
            pOAndD.from -
            ((entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection) / 2);

        /* end: same as createBox */

        var lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * constants.LINE_WIDTH;

        return svgelementfactory.createRect(
            {
                width: lWidth + lArcDepthCorrection * 2,
                height: pHeight ? pHeight : gChart.arcRowHeight - 2 * constants.LINE_WIDTH,
                x: lStart - lArcDepthCorrection,
                y: pY
            },
            "box inline_expression " + pArc.kind,
            pArc.linecolor,
            pArc.textbgcolor
        );
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
    function createBox(pOAndD, pArc, pY) {
        /* begin: same as createInlineExpressionBox */
        var lMaxDepthCorrection = gChart.maxDepth * 2 * constants.LINE_WIDTH;
        var lWidth =
            (pOAndD.to - pOAndD.from) +
            entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection; // px
        var lStart =
            pOAndD.from -
            ((entities.getDims().interEntitySpacing - 2 * constants.LINE_WIDTH - lMaxDepthCorrection) / 2);
        /* end: same as createInlineExpressionBox */

        var lGroup = svgelementfactory.createGroup();
        var lBox = {};
        var lTextGroup = renderlabels.createLabel(pArc, {x:lStart, y:pY, width:lWidth});
        var lTextBBox = svgutensils.getBBox(lTextGroup);
        var lHeight = Math.max(lTextBBox.height + 2 * constants.LINE_WIDTH, gChart.arcRowHeight - 2 * constants.LINE_WIDTH);
        var lBBox = {width: lWidth, height: lHeight, x: lStart, y: (pY - lHeight / 2)};

        switch (pArc.kind) {
        case ("rbox"):
            lBox = svgelementfactory.createRBox(lBBox, "box rbox", pArc.linecolor, pArc.textbgcolor);
            break;
        case ("abox"):
            lBox = svgelementfactory.createABox(lBBox, "box abox", pArc.linecolor, pArc.textbgcolor);
            break;
        case ("note"):
            lBox = svgelementfactory.createNote(lBBox, "box note", pArc.linecolor, pArc.textbgcolor);
            break;
        default:  // "box"
            lBox = svgelementfactory.createRect(lBBox, "box", pArc.linecolor, pArc.textbgcolor);
            break;
        }

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
        clean : function (pParentElementId, pWindow) {
            gChart.document = renderskeleton.init(pWindow);
            svgutensils.init(gChart.document);
            svgutensils.removeRenderedSVGFromElement(pParentElementId);
        },

        /**
         * renders the given abstract syntax tree pAST as svg
         * in the element with id pParentELementId in the window pWindow
         *
         * @param {object} pAST - the abstract syntax tree
         * @param {string} pSource - the source msc to embed in the svg
         * @param {string} pParentElementId - the id of the parent element in which
         * to put the __svg_output element
         * @param {window} pWindow - the browser window to put the svg in
         * @param {string} pStyleAdditions - valid css that augments the default style
         */
        renderAST : function (pAST, pSource, pParentElementId, pWindow, pStyleAdditions) {
            return _renderASTNew(
                pAST,
                pWindow,
                pParentElementId,
                {
                    source: pSource,
                    styleAdditions: pStyleAdditions
                }
            );
        },

        /**
        * renders the given abstract syntax tree pAST as svg
        * in the element with id pParentELementId in the window pWindow
        *
         * @param {object} pAST - the abstract syntax tree
         * @param {window} pWindow - the browser window to put the svg in
         * @param {string} pParentElementId - the id of the parent element in which
         * to put the __svg_output element
         * @param  {object} pOptions
         * - styleAdditions:  valid css that augments the default style
         * - additionalTemplate: a named (baked in) template. Current values:
         *  "inverted", "grayscaled"
         * - source: the source msc to embed in the svg
         * - mirrorEntitiesOnBottom: (boolean) whether or not to repeat entities
         *   on the bottom of the chart
         */
        renderASTNew : _renderASTNew
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
