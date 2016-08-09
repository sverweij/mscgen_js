/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./svgelementfactory",
        "./svglowlevelfactory",
        "./svgutensils",
        "./renderutensils",
        "./renderskeleton",
        "../text/flatten",
        "../text/arcmappings",
        "./rowmemory",
        "./idmanager",
        "./markermanager",
        "./entities",
        "./renderlabels",
        "./constants",
        "../../lib/lodash/lodash.custom"],
    /* eslint max-params: 0 */
function(fact, llfact, svgutl, utl, skel, flatten, map, rowmemory, id, mark, entities, labels, C, _) {
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
        "maxDepth"               : 0,
        "document"               : {},
        "layer"                  : {
            "defs"         : {},
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
            mirrorEntitiesOnBottom : false
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
            return svgutl.webkitNamespaceBugWorkaround(lElement.innerHTML);
        } else {
            return svgutl.webkitNamespaceBugWorkaround(pWindow.document.body.innerHTML);
        }
    }

    function renderASTPre(pAST, pWindow, pParentElementId, pOptions){
        id.setPrefix(pParentElementId);

        gChart.document = skel.bootstrap(
            pWindow,
            pParentElementId,
            id.get(),
            mark.getMarkerDefs(id.get(), pAST),
            pOptions
        );
        gChart.mirrorEntitiesOnBottom = Boolean(pOptions.mirrorEntitiesOnBottom);
        svgutl.init(gChart.document);

        gChart.layer = createLayerShortcuts(gChart.document);
        gChart.maxDepth = pAST.depth;

        preProcessOptions(gChart, pAST.options);
    }

    function renderASTMain(pAST){
        renderEntities(pAST.entities);
        rowmemory.clear(entities.getDims().height, gChart.arcRowHeight);
        renderArcRows(pAST.arcs, pAST.entities);
        if (gChart.mirrorEntitiesOnBottom){
            renderEntitiesOnBottom();
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
        postProcessOptions(pAST.options, lCanvas);
        renderSvgElement(lCanvas);
    }

    function createLayerShortcuts (pDocument){
        return {
            defs      : pDocument.getElementById(id.get("__defs")),
            lifeline  : pDocument.getElementById(id.get("__lifelinelayer")),
            sequence  : pDocument.getElementById(id.get("__sequencelayer")),
            notes     : pDocument.getElementById(id.get("__notelayer")),
            inline    : pDocument.getElementById(id.get("__arcspanlayer")),
            watermark : pDocument.getElementById(id.get("__watermark"))
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
        var lDepthCorrection = utl.determineDepthCorrection(pAST.depth, C.LINE_WIDTH);
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
        gChart.document.getElementById(id.get("__background")).appendChild(
            fact.createRect(pCanvas, "bglayer")
        );
    }

    function renderWatermark(pWatermark, pCanvas) {
        gChart.layer.watermark.appendChild(
            fact.createDiagonalText(pWatermark, pCanvas, "watermark")
        );
    }

    function postProcessOptions(pOptions, pCanvas) {
        if (pOptions) {
            if (pOptions.watermark) {
                renderWatermark(pOptions.watermark, pCanvas);
            }
            if (pOptions.width && pOptions.width !== "auto") {
                utl.scaleCanvasToWidth(pOptions.width, pCanvas);
            }
        }
    }

    function renderSvgElement(pCanvas) {
        var lSvgElement = gChart.document.getElementById(id.get());
        var body = gChart.document.getElementById(id.get("__body"));
        body.setAttribute(
            "transform",
            "translate(" + pCanvas.horizontaltransform + "," + pCanvas.verticaltransform +
                ") scale(" + pCanvas.scale + "," + pCanvas.scale + ")"
        );
        if (!!pCanvas.autoscale && pCanvas.autoscale === true){
            llfact.setAttributes(lSvgElement, {
                width: "100%",
                height: "100%",
                viewBox: "0 0 " + pCanvas.width.toString() + " " + pCanvas.height.toString()
            });
        } else {
            llfact.setAttributes(lSvgElement, {
                width: pCanvas.width.toString(),
                height: pCanvas.height.toString()
            });
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
            var lNoEntityLines = entities.getNoEntityLines(pEntity.label);
            if (lNoEntityLines > lHWM){
                lHWM = lNoEntityLines;
                lHighestEntity = pEntity;
            }
        });

        if (lHWM > 2){
            return Math.max(
                entities.getDims().height,
                svgutl.getBBox(
                    renderEntity(lHighestEntity)
                ).height
            );
        }
        return entities.getDims().height;
    }

    function renderEntity(pEntity, pX) {
        var lGroup = fact.createGroup(id.get(pEntity.name));
        var lBBox = entities.getDims();
        lBBox.x = pX ? pX : 0;
        lGroup.appendChild(
            fact.createRect(
                lBBox,
                "entity",
                pEntity.linecolor,
                pEntity.textbgcolor
            )
        );
        lGroup.appendChild(
            labels.createLabel(
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

    function renderEntitiesOnBottom() {
        var lLifeLineSpacerY = rowmemory.getLast().y + (rowmemory.getLast().height + gChart.arcRowHeight) / 2;

        gChart.layer.lifeline.appendChild(
            fact.createUse(
                {
                    x:0,
                    y:lLifeLineSpacerY
                },
                id.get("arcrow")
            )
        );
        gChart.layer.sequence.appendChild(
            fact.createUse(
                {
                    x:0,
                    y:lLifeLineSpacerY + gChart.arcRowHeight / 2
                },
                id.get("entities")
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
        var lEntityGroup = fact.createGroup(id.get("entities"));

        if (pEntities) {
            entities.setHeight(getMaxEntityHeight(pEntities) + C.LINE_WIDTH * 2);

            pEntities.forEach(function(pEntity){
                lEntityGroup.appendChild(renderEntity(pEntity, lEntityXPos));
                entities.setX(pEntity, lEntityXPos);
                lEntityXPos += entities.getDims().interEntitySpacing;
            });
            gChart.layer.defs.appendChild(lEntityGroup);
            gChart.layer.sequence.appendChild(
                fact.createUse({x:0, y:0}, id.get("entities"))
            );
        }
        gChart.arcEndX =
            lEntityXPos -
            entities.getDims().interEntitySpacing + entities.getDims().width;

    }

    /* ------------------------END entity shizzle-------------------------------- */

    function renderBroadcastArc(pArc, pEntities, pCurrentId, lRowMemory) {
        var xTo    = 0;
        var lLabel = pArc.label;
        var xFrom  = entities.getX(pArc.from);

        pArc.label = "";

        pEntities.forEach(function(pEntity, pEntityNumber){
            if (pEntity.name !== pArc.from) {
                xTo = entities.getX(pEntity.name);
                gChart.layer.defs.appendChild(
                    createArc(pCurrentId + "bc" + pEntityNumber, pArc, xFrom, xTo)
                );
                lRowMemory.push({
                    id    : pCurrentId + "bc" + pEntityNumber,
                    layer : gChart.layer.sequence
                });
            }
        });

        pArc.label = lLabel;
    }

    function renderRegularArc(pArc, pEntities, pCurrentId, pRowMemory){
        var lElement = {};

        if (pArc.from && pArc.to) {
            if (pArc.to === "*") { // it's a broadcast arc
                renderBroadcastArc(pArc, pEntities, pCurrentId, pRowMemory);
                /* creates a label on the current line, smack in the middle */
                lElement =
                    labels.createLabel(
                        pArc,
                        {
                            x     : 0,
                            y     : 0,
                            width : gChart.arcEndX
                        },
                        {
                            alignAround   : true,
                            ownBackground : true,
                            wordWrapArcs  : gChart.wordWrapArcs
                        },
                        pCurrentId + "_lbl"
                    );
                pRowMemory.push({
                    id    : pCurrentId + "_lbl",
                    layer : gChart.layer.sequence
                });
            } else { // it's a regular arc
                lElement =
                    createArc(
                        pCurrentId,
                        pArc,
                        entities.getX(pArc.from),
                        entities.getX(pArc.to)
                    );
                pRowMemory.push({
                    id    : pCurrentId,
                    layer : gChart.layer.sequence
                });
            }  // / lTo or pArc.from === "*"
        }// if both a from and a to
        return lElement;
    }

    function renderArcRow (pArcRow, pRowNumber, pEntities){
        var lArcRowClass = "arcrow";
        var lRowMemory = [];

        pArcRow.forEach(function(pArc, pArcNumber){
            var lCurrentId = id.get(pRowNumber.toString() + "_" + pArcNumber.toString());
            var lElement = {};

            switch (map.getAggregate(pArc.kind)) {
            case ("emptyarc"):
                lElement = renderEmptyArc(pArc, lCurrentId);
                if ("..." === pArc.kind) {
                    lArcRowClass = "arcrowomit";
                }
                lRowMemory.push({
                    id    : lCurrentId,
                    layer : gChart.layer.sequence
                });
                break;
            case ("box"):
                lElement = createBox(lCurrentId, entities.getOAndD(pArc.from, pArc.to), pArc);
                lRowMemory.push({
                    id    : lCurrentId,
                    layer : gChart.layer.notes
                });
                break;
            case ("inline_expression"):
                lElement = renderInlineExpressionLabel(lCurrentId + "_label", pArc);
                lRowMemory.push({
                    id    : lCurrentId + "_label",
                    layer : gChart.layer.notes
                });
                gInlineExpressionMemory.push({
                    id     : lCurrentId,
                    arc    : pArc,
                    rownum : pRowNumber
                });
                break;
            default:
                lElement = renderRegularArc(pArc, pEntities, lCurrentId, lRowMemory);
            }// switch

            rowmemory.set(
                pRowNumber,
                Math.max(
                    rowmemory.get(pRowNumber).height,
                    svgutl.getBBox(lElement).height + 2 * C.LINE_WIDTH
                )
             );
            gChart.layer.defs.appendChild(lElement);
        });// for all arcs in a row

        /*
         *  only here we can determine the height of the row and the y position
         */
        var lArcRowId = "arcrow_" + pRowNumber.toString();

        gChart.layer.defs.appendChild(
            renderLifeLines(
                pEntities,
                lArcRowClass,
                rowmemory.get(pRowNumber).height,
                id.get(lArcRowId)
            )
        );
        gChart.layer.lifeline.appendChild(
            fact.createUse({x:0, y:rowmemory.get(pRowNumber).y}, id.get(lArcRowId))
        );

        lRowMemory.forEach(function(pRowMemoryLine){
            pRowMemoryLine.layer.appendChild(
                fact.createUse(
                    {
                        x:0,
                        y:rowmemory.get(pRowNumber).y
                    },
                    pRowMemoryLine.id
                )
            );
        });
    }

    /** renderArcRows() - renders the arcrows from an AST
     *
     * @param <object> - pArcRows - the arc rows to render
     * @param <object> - pEntities - the entities to consider
     */
    function renderArcRows(pArcRows, pEntities) {
        gInlineExpressionMemory = [];
        gChart.layer.defs.appendChild(renderLifeLines(pEntities, "arcrow", null, id.get("arcrow")));

        /* put some space between the entities and the arcs */
        gChart.layer.lifeline.appendChild(
            fact.createUse(
                {
                    x:0,
                    y:rowmemory.get(-1).y},
                    id.get("arcrow")
                )
        );

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
     * @param <string> pId - the id to use for the rendered Element
     * @param <object> pArc - the arc spanning arc
     */
    function renderInlineExpressionLabel(pId, pArc) {
        var lOnD = entities.getOAndD(pArc.from, pArc.to);
        var FOLD_SIZE = 7;

        var lMaxDepthCorrection = gChart.maxDepth * 2 * C.LINE_WIDTH;

        var lMaxWidth =
            (lOnD.to - lOnD.from) +
            (entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH) -
            FOLD_SIZE -
            C.LINE_WIDTH;

        var lStart =
            (lOnD.from - ((entities.getDims().interEntitySpacing - 3 * C.LINE_WIDTH - lMaxDepthCorrection) / 2) -
            (gChart.maxDepth - pArc.depth) * 2 * C.LINE_WIDTH);

        var lGroup = fact.createGroup(pId);
        pArc.label = pArc.kind + (pArc.label ? ": " + pArc.label : "");
        var lTextGroup = labels.createLabel(
            pArc,
            {
                x: lStart + C.LINE_WIDTH - (lMaxWidth / 2),
                y: gChart.arcRowHeight / 4, width:lMaxWidth
            },
            {
                alignLeft: true,
                ownBackground: false,
                wordWrapArcs: gChart.wordWrapArcs
            }
        );

        var lBBox = svgutl.getBBox(lTextGroup);

        var lHeight =
            Math.max(
                lBBox.height + 2 * C.LINE_WIDTH,
                (gChart.arcRowHeight / 2) - 2 * C.LINE_WIDTH
            );
        var lWidth =
            Math.min(
                lBBox.width + 2 * C.LINE_WIDTH,
                lMaxWidth
            );

        var lBox =
            fact.createEdgeRemark(
                {
                    width: lWidth - C.LINE_WIDTH + FOLD_SIZE,
                    height: lHeight,
                    x: lStart,
                    y: 0
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
                gChart.layer.defs.appendChild(
                    renderInlineExpression(pInlineExpression)
                );
                gChart.layer.inline.appendChild(
                    fact.createUse(
                        {
                            x:0,
                            y:rowmemory.get(pInlineExpression.rownum).y
                        },
                        pInlineExpression.id
                    )
                );
            }
        );
    }

    function renderInlineExpression(pArcMem) {
        var lFromY = rowmemory.get(pArcMem.rownum).y;
        var lToY = rowmemory.get(pArcMem.rownum + pArcMem.arc.numberofrows + 1).y;
        var lHeight = lToY - lFromY;
        pArcMem.arc.label = "";

        return createInlineExpressionBox(
            pArcMem.id,
            entities.getOAndD(pArcMem.arc.from, pArcMem.arc.to),
            pArcMem.arc,
            lHeight
        );
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
            var lLine = fact.createLine(
                {
                    xFrom: entities.getX(pEntity.name),
                    yFrom: 0 - (pHeight / 2),
                    xTo: entities.getX(pEntity.name),
                    yTo: (pHeight / 2)
                },
                {
                    class: pClass
                }
            );
            if (pEntity.linecolor) {
                lLine.setAttribute("style", "stroke:" + pEntity.linecolor + ";");
            }
            lGroup.appendChild(lLine);
        });

        return lGroup;
    }

    function createSelfRefArc(pKind, pFrom, pYTo, pDouble, pLineColor) {
        // globals: (gChart ->) arcRowHeight, (entities ->) interEntitySpacing

        var lHeight = 2 * (gChart.arcRowHeight / 5);
        var lWidth = entities.getDims().interEntitySpacing / 2;
        var lRetval = {};
        var lClass = "arc " + map.getAggregateClass(pKind) + " " + map.getClass(pKind);

        if (pDouble) {
            lRetval = fact.createGroup();
            var lInnerTurn  = fact.createUTurn(
                {x:pFrom, y:lHeight / 2},
                (pYTo + lHeight - 2 * C.LINE_WIDTH),
                lWidth - 2 * C.LINE_WIDTH,
                lClass,
                pKind !== "::"
            );
            /* we need a middle turn to attach the arrow to */
            var lMiddleTurn = fact.createUTurn(
                {x:pFrom, y:lHeight / 2},
                (pYTo + lHeight - C.LINE_WIDTH),
                lWidth
            );
            var lOuterTurn  = fact.createUTurn(
                {x:pFrom, y:lHeight / 2},
                (pYTo + lHeight),
                lWidth,
                lClass,
                pKind !== "::"
            );
            if (Boolean(pLineColor)){
                lInnerTurn.setAttribute("style", "stroke:" + pLineColor);
            }
            mark.getAttributes(id.get(), pKind, pLineColor, pFrom, pFrom).forEach(function(pAttribute){
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
            lRetval = fact.createUTurn(
                {
                    x:pFrom,
                    y:lHeight / 2
                },
                (pYTo + lHeight),
                lWidth,
                lClass,
                pKind === "-x"
            );
            mark.getAttributes(id.get(), pKind, pLineColor, pFrom, pFrom).forEach(
                function(pAttribute){
                    lRetval.setAttribute(pAttribute.name, pAttribute.value);
                }
            );
        }

        return lRetval;
    }

    function renderEmptyArc(pArc, pId) {
        if (pArc.kind === "---"){
            return createComment(pId, pArc, entities.getOAndD(pArc.from, pArc.to));
        } else { /* "..." / "|||" */
            return createLifeLinesText(pId, pArc, entities.getOAndD(pArc.from, pArc.to));
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

    function createArc(pId, pArc, pFrom, pTo) {
        var lGroup = fact.createGroup(pId);
        var lClass = "arc ";
        lClass += determineDirectionClass(pArc.kind);
        lClass += map.getAggregateClass(pArc.kind) + " " + map.getClass(pArc.kind);
        var lDoubleLine = [":>", "::", "<:>"].indexOf(pArc.kind) > -1;
        var lYTo = determineArcYTo(pArc);
        var lArcGradient = (lYTo === 0) ? gChart.arcGradient : lYTo;

        pTo = utl.determineArcXTo(pArc.kind, pFrom, pTo);

        if (pFrom === pTo) {
            lGroup.appendChild(
                createSelfRefArc(pArc.kind, pFrom, lYTo, lDoubleLine, pArc.linecolor)
            );

            /* creates a label left aligned, a little above the arc*/
            var lTextWidth = 2 * entities.getDims().interEntitySpacing / 3;
            lGroup.appendChild(
                labels.createLabel(
                    pArc,
                    {
                        x:pFrom + 1.5 * C.LINE_WIDTH - (lTextWidth / 2),
                        y:0 - (gChart.arcRowHeight / 5) - C.LINE_WIDTH / 2,
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
            var lLine = fact.createLine(
                {xFrom: pFrom, yFrom: 0, xTo: pTo, yTo: lArcGradient},
                {
                    class: lClass,
                    doubleLine: lDoubleLine
                }
            );
            mark.getAttributes(
                id.get(), pArc.kind, pArc.linecolor, pFrom, pTo
            ).forEach(function(pAttribute){
                lLine.setAttribute(pAttribute.name, pAttribute.value);
            });
            lGroup.appendChild(lLine);

            /* create a label centered on the arc */
            lGroup.appendChild(
                labels.createLabel(
                    pArc,
                    {x: pFrom, y: 0, width: pTo - pFrom},
                    {
                        alignAround: true,
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
    function createLifeLinesText(pId, pArc, pOAndD) {
        var lArcStart = 0;
        var lArcEnd   = gChart.arcEndX;
        var lGroup    = fact.createGroup(pId);

        if (pArc.from && pArc.to) {
            lArcStart = pOAndD.from;
            lArcEnd   = pOAndD.to - pOAndD.from;
        }
        lGroup.appendChild(
            labels.createLabel(
                pArc,
                {x:lArcStart, y:0, width:lArcEnd},
                {ownBackground:true, wordWrapArcs: gChart.wordWrapArcs},
                pId + "_lbl"
            )
        );
        return lGroup;
    }

    /**
     * createComment() - creates an element representing a comment ('---')
     *
     * @param <string> - pId - the unique identification of the comment within the svg
     * @param <object> - pArc - the (comment) arc to render
     */
    function createComment(pId, pArc, pOAndD) {
        var lStartX = 0;
        var lEndX = gChart.arcEndX;
        var lClass = "comment";
        var lGroup = fact.createGroup(pId);

        if (pArc.from && pArc.to) {
            var lMaxDepthCorrection = gChart.maxDepth * 1 * C.LINE_WIDTH;
            var lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * C.LINE_WIDTH;

            lStartX =
                (pOAndD.from -
                  (entities.getDims().interEntitySpacing + 2 * C.LINE_WIDTH) / 2) -
                (lArcDepthCorrection - lMaxDepthCorrection);
            lEndX   =
                (pOAndD.to +
                  (entities.getDims().interEntitySpacing + 2 * C.LINE_WIDTH) / 2) +
                (lArcDepthCorrection - lMaxDepthCorrection);
            lClass  = "inline_expression_divider";
        }
        var lLine =
            fact.createLine(
                {
                    xFrom: lStartX,
                    yFrom: 0,
                    xTo: lEndX,
                    yTo: 0
                },
                {
                    class: lClass
                }
            );

        lGroup.appendChild(lLine);
        lGroup.appendChild(createLifeLinesText(pId + "_txt", pArc, pOAndD));

        if (pArc.linecolor) {
            lLine.setAttribute("style", "stroke:" + pArc.linecolor + ";");
        }

        return lGroup;
    }

    function createInlineExpressionBox(pId, pOAndD, pArc, pHeight) {
        /* begin: same as createBox */
        var lMaxDepthCorrection = gChart.maxDepth * 2 * C.LINE_WIDTH;
        var lWidth =
            (pOAndD.to - pOAndD.from) +
            entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH - lMaxDepthCorrection; // px
        var lStart =
            pOAndD.from -
            ((entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH - lMaxDepthCorrection) / 2);

        var lGroup = fact.createGroup(pId);
        /* end: same as createBox */

        var lArcDepthCorrection = (gChart.maxDepth - pArc.depth) * 2 * C.LINE_WIDTH;

        lGroup.appendChild(
            fact.createRect(
                {
                    width: lWidth + lArcDepthCorrection * 2,
                    height: pHeight ? pHeight : gChart.arcRowHeight - 2 * C.LINE_WIDTH,
                    x: lStart - lArcDepthCorrection,
                    y: 0
                },
                "box inline_expression " + pArc.kind,
                pArc.linecolor,
                pArc.textbgcolor
            )
        );

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
    function createBox(pId, pOAndD, pArc) {
        /* begin: same as createInlineExpressionBox */
        var lMaxDepthCorrection = gChart.maxDepth * 2 * C.LINE_WIDTH;
        var lWidth =
            (pOAndD.to - pOAndD.from) +
            entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH - lMaxDepthCorrection; // px
        var lStart =
            pOAndD.from -
            ((entities.getDims().interEntitySpacing - 2 * C.LINE_WIDTH - lMaxDepthCorrection) / 2);
        /* end: same as createInlineExpressionBox */

        var lGroup = fact.createGroup(pId);
        var lBox = {};
        var lTextGroup = labels.createLabel(pArc, {x:lStart, y:0, width:lWidth});
        var lTextBBox = svgutl.getBBox(lTextGroup);
        var lHeight = Math.max(lTextBBox.height + 2 * C.LINE_WIDTH, gChart.arcRowHeight - 2 * C.LINE_WIDTH);
        var lBBox = {width: lWidth, height: lHeight, x: lStart, y: (0 - lHeight / 2)};

        switch (pArc.kind) {
        case ("rbox"):
            lBox = fact.createRBox(lBBox, "box rbox", pArc.linecolor, pArc.textbgcolor);
            break;
        case ("abox"):
            lBox = fact.createABox(lBBox, "box abox", pArc.linecolor, pArc.textbgcolor);
            break;
        case ("note"):
            lBox = fact.createNote(lBBox, "box note", pArc.linecolor, pArc.textbgcolor);
            break;
        default:  // "box"
            lBox = fact.createRect(lBBox, "box", pArc.linecolor, pArc.textbgcolor);
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
            gChart.document = skel.init(pWindow);
            svgutl.init(gChart.document);
            svgutl.removeRenderedSVGFromElement(pParentElementId);
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
