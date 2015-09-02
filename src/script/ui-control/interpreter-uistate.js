/*
msc {
  hscale="1.2";

  html [label="index.html", textbgcolor="#ddf"]
, ui [label="mscgenui.js"]
, msc [label="mscparser.js"]

, render [label="mscrender.js"]
, utls [label="mscrenderutensils.js"]
, doc [label="window.document", textbgcolor="#ddf"];


  html => ui [label="render"];
  ui =>> doc [label="get input from textarea"];
  doc >> ui [label="text"];
  ui =>> msc [label="parse(text)"];

  --- [label="[hunky dory]", linecolor="green"];
  ui << msc [label="AST"];
  ui => render [label="renderAST(AST, text)"];
  render => utls [label="low level helpers"];
  utls => doc [label="all kinds of dom manipulation"];
  render => doc [label="all kinds of dom manipulation"];
  render note render [label="move dom manipulation down?"];

  --- [label="[parse error]", linecolor="red"];
  ui << msc [label="exception"];
  ui =>> ui [label="show error"];

  ui =>> html [label="show error"];

  |||;
  ui note msc [label="There's a parser for mscgen and a separate one for ms genny.\nFor simplicity only showning one.", textbgcolor="#ffe"];
}
*/

/* jshint browser:true */
/* jshint unused:true */
/* global define */

define(["../parse/xuparser", "../parse/msgennyparser", "../render/graphics/renderast",
        "../render/text/ast2msgenny", "../render/text/ast2xu",
        "../utl/gaga", "../utl/maps",
        "../utl/domquery",
        "./controller-exporter"
        ],
        function(mscparser, msgennyparser, msc_render,
            tomsgenny, tomscgen,
            gaga, txt,
            dq,
            xport
        ) {
"use strict";

var gAutoRender = true;
var gLanguage = "mscgen";
var gDebug = false;
var gLinkToInterpreter = false;

var gCodeMirror = {};
var gErrorCoordinates = {
    line : 0,
    column : 0
  };

function initializeUI(pCodeMirror) {
    gCodeMirror = pCodeMirror;
    showAutorenderState (gAutoRender);
    showLanguageState (getSource(), getLanguage(), gAutoRender);
    render(getSource(), getLanguage());
    if (window.__loading) {
        window.__loading.outerHTML = "";
    }
}

function msc_inputKeyup () {
    if (gAutoRender) {
        render(getSource(), getLanguage());
    }
}

function getASTBare (pSource, pLanguage){
    if ("msgenny" === pLanguage) {
        return msgennyparser.parse(pSource);
    } else if ("json" === pLanguage) {
        return JSON.parse(pSource);
    } // we use the xu parser for both mscgen and xu:
    return mscparser.parse(pSource);
}

function getAST(pLanguage, pSource) {
    var lLanguage = pLanguage ? pLanguage: getLanguage();
    var lSource = pSource ? pSource: getSource();
    return getASTBare(lSource, lLanguage);
}

function switchLanguage (pLanguage) {
    var lAST = {};
    
    try {
        lAST = getAST();
        if (lAST !== {}){
            setSource(renderSource(lAST, pLanguage));
        }
    } catch(e) {
        // do nothing
    }
    setLanguage(pLanguage);
}

function clear(){
    if(["mscgen", "xu"].indexOf(getLanguage()) > -1){
        setSource("msc{\n  \n}");
        setCursorInSource(1,3);        
    } else {
        setSource("");
    }
}

function manipulateSource(pFunction){
    var lAST = {};

    try {
        lAST = getAST();
        if (lAST !== {}){
            lAST = pFunction(lAST);
            setSource(renderSource(lAST, getLanguage()));
        }
    } catch(e) {
        // do nothing
    }
}

function renderSource(pAST, pLanguage){
    var lTargetSource = "";

    if ("msgenny" === pLanguage){
        lTargetSource = tomsgenny.render(pAST);
    } else if ("json" === pLanguage){
        lTargetSource = JSON.stringify(pAST, null, "  ");
    } else { // for rendering mscgen we use the xu renderer
        lTargetSource = tomscgen.render(pAST);
    }
    return lTargetSource;
}

function getSource(){
    return gCodeMirror.getValue();
}

function setSource(pSource){
    gCodeMirror.setValue(pSource);
}

function setCursorInSource(pLine, pColumn){
    gCodeMirror.setCursor(pLine, pColumn);
    gCodeMirror.focus();
}

function getLanguage(){
    return gLanguage;
}

function setLanguage (pLanguage){
    gLanguage = pLanguage;
    gCodeMirror.setOption("mode", txt.language2Mode(pLanguage));
    showLanguageState(getSource(), pLanguage, gAutoRender);
}

function setSample(pURL) {
    if ("none" === pURL || !pURL){
        clear();
    } else {
        dq.ajax (pURL, function(pEvent){
            setLanguage(txt.classifyExtension(pURL));
            setSource(pEvent.target.response);
        });
    }
}

function handleRenderException (pException, pSource){
    if (!!pException.location) {
        gErrorCoordinates.line = pException.location.start.line;
        gErrorCoordinates.column = pException.location.start.column;
        displayError(
         "Line " + pException.location.start.line + ", column " + pException.location.start.column + ": " + pException.message,
          ">>> " + pSource.split('\n')[pException.location.start.line - 1] + " <<<");
    } else {
        gErrorCoordinates.line = 0;
        gErrorCoordinates.column = 0;
        displayError(pException.message);
    }
}

function render(pSource, pLanguage) {
    preRenderReset();
    try {
        var lAST = getASTBare(pSource, pLanguage);
        if (gDebug) {
            try {
                window.history.replaceState({},"", 
                        xport.toLocationString(window.location, 
                            pSource, 
                            txt.correctLanguage(lAST.meta.extendedFeatures, 
                                pLanguage
                            )
                        )
                );
            } catch (e) {
                // on chrome window.history.replaceState barfs when
                // the interpreter runs from a file:// instead of 
                // from a server. This try/ catch is a crude way 
                // to handle that without breaking the rest of the flow
            }
        }
        msc_render.renderAST(lAST, pSource, "__svg", window);
        if (lAST.entities.length > 0) {
            showRenderSuccess(lAST.meta);
        }
    } catch (e) {
        handleRenderException(e, pSource);
    }
}

function preRenderReset(){
    hideError();
    dq.SS(window.__output_controls_area).hide();
    dq.SS(window.__placeholder).show("flex");
    dq.SS(window.__svg).hide();
    msc_render.clean("__svg", window);
}

function showRenderSuccess(pMeta){
    dq.SS(window.__output_controls_area).show();
    dq.SS(window.__placeholder).hide();
    dq.SS(window.__svg).show();
    showExtendedArcTypeFeatures(pMeta);
    showExtendedFeatures(pMeta);
    gLanguage = txt.correctLanguage(pMeta.extendedFeatures, getLanguage());
}

function showExtendedArcTypeFeatures(pMeta){
    if (pMeta && true === pMeta.extendedArcTypes) {
        dq.SS(window.__show_anim).hide();
    } else {
        dq.SS(window.__show_anim).show();
    }
}

function showExtendedFeatures(pMeta){
    if( pMeta && true === pMeta.extendedFeatures){
        dq.SS(window.__xu_notify).show();
    } else {
        dq.SS(window.__xu_notify).hide();
    }
}

function showAutorenderState (pAutoRender) {
    if (pAutoRender) {
        window.__autorender.checked = true;
        dq.SS(window.__btn_render).hide();
    } else {
        window.__autorender.checked = false;
        dq.SS(window.__btn_render).show();
    }
}

function showLanguageState (pSource, pLanguage, pAutoRender) {
    if ("msgenny" === pLanguage) {
        window.__language_mscgen.checked = false;
        window.__language_msgenny.checked = true;
        window.__language_json.checked = false;
        dq.SS(window.__btn_more_color_schemes).hide();
        window.__color_panel.style.height = '0';
    } else if ("json" === pLanguage){
        window.__language_mscgen.checked = false;
        window.__language_msgenny.checked = false;
        window.__language_json.checked = true;
        dq.SS(window.__btn_more_color_schemes).show();
    } else /* "mscgen" === pLanguage || "xu" === pLanguage */{
        window.__language_mscgen.checked = true;
        window.__language_msgenny.checked = false;
        window.__language_json.checked = false;
        dq.SS(window.__btn_more_color_schemes).show();
    }
    if (pAutoRender) {
        render (pSource, pLanguage);
    }
}

function hideError () {
    dq.SS(window.__error).hide();
    window.__error_output.textContent = "";
    window.__error_context.textContent = "";
}

function displayError (pError, pContext) {
    dq.SS(window.__error).show();
    dq.SS(window.__placeholder).hide();
    window.__error_output.textContent = pError;
    window.__error_context.textContent = pContext;
}

    return {
        init: initializeUI,
        
        switchLanguage: switchLanguage,
        manipulateSource: manipulateSource,
        setSample: setSample,

        errorOnClick: function(){
            setCursorInSource(gErrorCoordinates.line -1, gErrorCoordinates.column -1);
        },

        msc_inputKeyup: msc_inputKeyup,
        render: render,
        getAutoRender: function(){ return gAutoRender; },
        setAutoRender: function(pBoolean){ gAutoRender = pBoolean; },
        getSource: getSource,
        setSource: setSource,
        getLanguage: getLanguage,
        setLanguage: setLanguage,
        getDebug: function(){ return gDebug; },
        setDebug: function(pBoolean){ gDebug = pBoolean; },
        getAST: getAST,
        getLinkToInterpeter: function(){ return gLinkToInterpreter; },
        setLinkToInterpeter: function(pBoolean) { 
            gLinkToInterpreter = pBoolean;
            window.__link_to_interpreter.checked = pBoolean;
        },

        showAutorenderState: showAutorenderState
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
