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

/* jshint undef:true */
/* jshint unused:false */
/* jshint browser:true */
/* jshint jquery:true */
/* jshint nonstandard:true */
/* global define, canvg */

define(["jquery", "xuparser", "msgennyparser", "renderast",
        "node/ast2msgenny", "node/ast2xu", "node/ast2dot", "node/ast2mscgen", /*"node/ast2dagre",*/
        "gaga", "node/textutensils", "node/colorize",
        "node/paramslikker",
        "../lib/codemirror/lib/codemirror",
		"../lib/codemirror/addon/edit/closebrackets",
		"../lib/codemirror/addon/edit/matchbrackets",
        "../lib/codemirror/addon/display/placeholder",
        "../lib/canvg/canvg",
        "../lib/canvg/StackBlur",
        "../lib/canvg/rgbcolor"/*,
        "../lib/dagre/d3",
        "../lib/dagre/dagred3"*/
        ],
        function($, mscparser, msgennyparser, msc_render,
            tomsgenny, tomscgen, todot, tovanilla, /*todagre,*/
            gaga, txt, colorize,
            params,
            codemirror,
            cm_closebrackets,
            cm_matchbrackets,
            cm_placeholder,
            cv,
            cv_stackblur,
            cv_rgbcolor/*,
            dthree,
            dagred3*/) {

var gAutoRender = true;
var gLanguage = "mscgen";
var gGaKeyCount = 0;
var ESC_KEY   = 27; 
var gCodeMirror =
    codemirror.fromTextArea(document.getElementById("__msc_input"), {
        lineNumbers       : true,
        autoCloseBrackets : true,
        matchBrackets     : true,
        theme             : "midnight", 
        placeholder       : "Type your text (mscgen syntax or ms genny). Or drag a file to this area....",
        lineWrapping      : true
    });

$(document).ready(function(){

    var lParams = params.getParams (window.location.search); 
    
    gaga.gaSetup("false" === lParams.donottrack || undefined === lParams.donottrack );
    gaga.g('create', 'UA-42701906-1', 'sverweij.github.io');
    gaga.g('send', 'pageview');
    
    setupEvents();
    processParams(lParams);
        
    $("#__pngcanvas").hide();
    showAutorenderState ();
    showLanguageState ();
    render();
    if (undefined === lParams.msc) {
        samplesOnChange();
    }
    
}); // document ready

function setupEvents () {
    $("#__autorender").bind({
        click : function(e) {
                    autorenderOnClick();
                    gaga.g('send', 'event', 'toggle_autorender', 'checkbox');
                }
    });
    $("#__language_msgenny").bind ({
        click : function(e) {
                    switchLanguageOnClick("msgenny");
                    gaga.g('send', 'event', 'toggle_ms_genny', 'msgenny');
                }     
    });
    $("#__language_mscgen").bind ({
        click : function(e) {
                    switchLanguageOnClick("mscgen");
                    gaga.g('send', 'event', 'toggle_ms_genny', 'mscgen');
                }     
    });
    $("#__language_json").bind ({
        click : function(e) {
                    switchLanguageOnClick("json");
                    gaga.g('send', 'event', 'toggle_ms_genny', 'json');
                }     
    });
    $("#__btn_colorize").bind({
        click : function(e) {
                    colorizeOnClick(false);
                    gaga.g('send', 'event', 'colorize', 'button');
                }
    });
    $("#__btn_uncolorize").bind({
        click : function(e) {
                    unColorizeOnClick(false);
                    gaga.g('send', 'event', 'uncolorize', 'button');
                }
    });
    $("#__btn_colorize_hard").bind({
        click : function(e) {
                    colorizeOnClick(true);
                    gaga.g('send', 'event', 'colorize_hard', 'button');
                }
    });
    $("#__svg").bind({
        dblclick : function(e) {
                    show_svgOnClick();
                    gaga.g('send', 'event', 'show_svg_base64', 'svg dblcick');
                }
    });
    $("#__show_svg").bind({
        click : function(e) {
                    show_svgOnClick();
                    gaga.g('send', 'event', 'show_svg_base64', 'button');
                }
    });
    $("#__show_png").bind({
        click : function(e) {
                    show_rasterOnClick("image/png");
                    gaga.g('send', 'event', 'show_png_base64', 'button');
                }
    });
    $("#__show_jpeg").bind({
        click : function(e) {
                    show_rasterOnClick("image/jpeg");
                    gaga.g('send', 'event', 'show_jpeg_base64', 'button');
                }
    });
    $("#__show_html").bind({
        click : function(e) {
                    show_htmlOnClick();
                    gaga.g('send', 'event', 'show_html', 'button');
                }
    });
    $("#__show_dot").bind({
        click : function(e) {
                    show_dotOnClick();
                    gaga.g('send', 'event', 'show_dot', 'button');
                }
    });
    $("#__show_vanilla").bind({
        click : function(e) {
                    show_vanillaOnClick();
                    gaga.g('send', 'event', 'show_vanilla', 'button');
                }
    });
    $("#__show_communications_diagram").bind({
        click : function(e) {
                    show_communications_diagramOnClick();
                    gaga.g('send', 'event', 'show_communications_diagram', 'button');
                }
    });
    $("#__show_url").bind({
        click : function(e) {
                    show_urlOnClick();
                    gaga.g('send', 'event', 'show_url', 'button');
                }
    });
    $("#__close_lightbox").bind({
        click : function(e) {
                    close_lightboxOnClick();
                    gaga.g('send', 'event', 'close_source_lightbox', 'button');
                }
    });
    $("#__close_embedsheet").bind({
        click : function(e) {
                    close_embedsheetOnClick();
                    gaga.g('send', 'event', 'close_embedsheet', 'button');
                }
    });
    $("#__btn_render").bind({
        click : function(e) {
                    renderOnClick();
                    gaga.g('send', 'event', 'render', 'button');
                }
    });
    $("#__samples").bind("change", function (e) {
                    samplesOnChange();
                    gaga.g('send', 'event', 'selectexample', $("#__samples").val() );
    });

    gCodeMirror.on ("change", function() {
                    msc_inputKeyup();
                    if (gGaKeyCount > 17) {
                        gGaKeyCount = 0;
                        gaga.g('send', 'event', '17 characters typed', gLanguage);
                    } else {
                        gGaKeyCount++;
                    }
    });
    gCodeMirror.on ("drop", function(pThing, pEvent) {
                    /* if there is a file in the drop event clear the textarea, 
                     * otherwise do default handling for drop events (whatever it is)
                     */
                    if (pEvent.dataTransfer.files.length > 0) {
                        gLanguage = txt.classifyExtension(pEvent.dataTransfer.files[0].name);
                        showLanguageState ();
                        gCodeMirror.setValue("");
                        gaga.g('send', 'event', 'drop', gLanguage);    
                    } 
    });
    $("a[href]").bind({
        click : function(e) {
            var lTarget = "unknown";
            
            if (e.currentTarget && e.currentTarget.href){
                lTarget = e.currentTarget.href;
            }
            
            gaga.g('send', 'event', 'link', lTarget);
        }
    });
    $("#__helpme").bind ({
        click : function(e) {
                    helpmeOnClick();
                    gaga.g('send', 'event', 'link', "helpme");
                }
    });
    $("#__embedme").bind ({
        click : function(e) {
                    embedmeOnClick();
                    gaga.g('send', 'event', 'link', "embedme");
                }
    });

    $("body").bind({
        keydown : function (e) {
           var lKey = e.keyCode;               
           var lTarget = $(e.currentTarget);   
                                 
           switch(lKey) {                      
               case (ESC_KEY) : {
                   closeAllLightBoxes();
                    // gaga.g('send', 'event', 'close_source_lightbox', 'ESC_KEY');
               } 
               break;
               default: {
                   break;
               }
           }
        }
    });
    
}

function processParams(pParams){
    if ("true" === pParams.debug) {
        $(".debug").show();
        gaga.g('send', 'event', 'debug', 'true');
    }
    
    if (pParams.msc) {
        gCodeMirror.setValue(pParams.msc);
        gaga.g('send', 'event', 'params.msc');
    }
    if (pParams.lang){
        gLanguage = pParams.lang;
        gaga.g('send', 'event', 'params.lang', pParams.lang);
    }
    if (pParams.outputformat){
        gaga.g('send', 'event', 'params.outputformat', pParams.outputformat);
    }
}

function msc_inputKeyup () {
    if (gAutoRender) {
        render();
    }
}

function renderOnClick () {
    render();
}

function autorenderOnClick () {
    gAutoRender = !gAutoRender;
    if (gAutoRender) {
        render ();
    }
    showAutorenderState ();
}

function getAST(pInput, pLanguage) {
    var lAST = {};
    if ("msgenny" === pLanguage) {
        lAST = msgennyparser.parse(pInput);
    } else if ("json" === pLanguage) {
        lAST = JSON.parse(pInput);
    } else if ("xu" === pLanguage) {
        lAST = mscparser.parse(pInput);
    } else {
        lAST = mscparser.parse(pInput);
    }
    return lAST;
}

function switchLanguageOnClick (pValue) {
    var lPreviousLanguage = gLanguage;
    var lAST = {};
    
    try {
        lAST = getAST(gCodeMirror.getValue(), lPreviousLanguage);
    
        if (lAST !== {}){
            if ("msgenny" === pValue){
                gCodeMirror.setValue(tomsgenny.render(lAST));
            } else if ("json" === pValue){
                gCodeMirror.setValue(JSON.stringify(lAST, null, "  "));
            } else if ("xu" === pValue){
                gCodeMirror.setValue(tomscgen.render(lAST));
            } else {
                gCodeMirror.setValue(tomscgen.render(lAST));
            }
        }
    } catch(e) {
        // do nothing
    }
    
    gLanguage = pValue;
    showLanguageState ();
}

function clearOnClick(){
    if ("msgenny" === gLanguage){
        gCodeMirror.setValue("");
    } else if ("json" === gLanguage){
        gCodeMirror.setValue("");   
    } else /* "mscgen" === gLanguage || "xu" === gLanguage */{
        gCodeMirror.setValue("msc{\n  \n}");
        gCodeMirror.setCursor(1,3);
    }
}

function colorizeOnClick(pHardOverride){
    var lAST = {};
    
    try {
        lAST = getAST(gCodeMirror.getValue(), gLanguage);
    
        if (lAST !== {}){
            lAST = colorize.colorize(lAST, pHardOverride);
            reRenderSource(lAST);
        }
    } catch(e) {
        // do nothing
    }
}

function unColorizeOnClick(pHardOverride){
    var lAST = {};
    
    try {
        lAST = getAST(gCodeMirror.getValue(), gLanguage);
    
        if (lAST !== {}){
            lAST = colorize.uncolor(lAST, pHardOverride);
            reRenderSource(lAST);
        }
    } catch(e) {
        // do nothing
    }
}

function reRenderSource(pAST){
    if ("msgenny" === gLanguage){
        gCodeMirror.setValue(tomsgenny.render(pAST));
    } else if ("json" === gLanguage){
        gCodeMirror.setValue(JSON.stringify(pAST, null, "  "));
    } else if ("xu" === gLanguage){
        gCodeMirror.setValue(tomscgen.render(pAST));
    } else {
        gCodeMirror.setValue(tomscgen.render(pAST));
    }
}


function samplesOnChange() {
    if ("none" === $("#__samples").val()) {
        clearOnClick();
    } else {
        $.ajax({
            url : $("#__samples").val(),
            success : function(pData) {
                if ($("#__samples").val()) {
                    gLanguage = txt.classifyExtension($("#__samples").val());
                }
                showLanguageState ();
                gCodeMirror.setValue(pData);
            },
            error : function (a,b,error){ 
            },
            dataType : "text"
        });
    }
}

// webkit (at least in Safari Version 6.0.5 (8536.30.1) which is
// distibuted with MacOSX 10.8.4) omits the xmlns: and xlink:
// namespace prefixes in front of xlink and all hrefs respectively. 
// this function does a crude global replace to circumvent the
// resulting problems. Problem happens for xhtml too
function webkitNamespaceBugWorkaround(pText){
    var lText =  pText.replace(/\ xlink=/g, " xmlns:xlink=", "g");
    lText = lText.replace(/\ href=/g, " xlink:href=", "g");
    return lText;
}

function embedmeOnClick () {
    $("#__cheatsheet").hide();
    $("#__embedsnippet").text(getHTMLSnippet());
    $("#__embedsheet").toggle();
}

function helpmeOnClick () { 
    $("#__embedsheet").hide();
    $("#__cheatsheet").toggle();
}

function toVectorURI (pSourceElementId) {
    var lb64 = btoa(unescape(encodeURIComponent(webkitNamespaceBugWorkaround($(pSourceElementId).html()))));
    return "data:image/svg+xml;base64,"+lb64;
}

function show_svgOnClick () {
    var lWindow = window.open(toVectorURI("#__svg"), "_blank");
}

function toRasterURI(pSourceElementId, pType){
    canvg(document.getElementById("__pngcanvas"), webkitNamespaceBugWorkaround($(pSourceElementId).html()));
    var lCanvas = document.getElementById("__pngcanvas");
    return lCanvas.toDataURL(pType, 0.8);
}

function show_rasterOnClick (pType) {
    var lWindow = window.open(toRasterURI("#__svg", pType), "_blank");
}
function getHTMLSnippet() {
    return "<!DOCTYPE html>\n<html>\n  <head>\n    <script data-main='https://sverweij.github.io/mscgen_js/script/mscgen-inpage.js' src='https://sverweij.github.io/mscgen_js/lib/require.js'>\n    </script>\n  <head>\n  <body>\n    <pre class='code " + gLanguage + " mscgen_js' data-language='" + gLanguage +"'>\n" + gCodeMirror.getValue() + "\n    </pre>\n  </body>\n</html>";
}
function show_htmlOnClick(){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(getHTMLSnippet()));
}

function show_dotOnClick(){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(todot.render(getAST(gCodeMirror.getValue(), gLanguage))));
}

function show_vanillaOnClick(){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(tovanilla.render(getAST(gCodeMirror.getValue(), gLanguage))));
}

function show_communications_diagramOnClick(){
/*    
    var lDiGraph = todagre.render(getAST(gCodeMirror.getValue(), gLanguage));
    var lRenderer = new dagreD3.Renderer();
    var lLayout = dagreD3.layout().nodeSep(20).rankDir("LR");
    msc_render.clean("__svg", window);

    lRenderer.layout(lLayout).run(lDiGraph, d3.select("svg g"));
*/
}

function show_urlOnClick(){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+
        encodeURIComponent(
            window.location.protocol + '//' +
            window.location.host + 
            window.location.pathname + 
            '?donottrack=true&debug=true&lang=' + gLanguage + 
            '&msc=' +  escape(gCodeMirror.getValue())
        )
    );
}

function close_lightboxOnClick(){
    $("#__cheatsheet").hide();
}

function close_embedsheetOnClick(){
    $("#__embedsheet").hide();
}

function showAutorenderState () {
    if (gAutoRender) {
        $("#__autorender").attr("checked", "autorenderOn");
        $("#__btn_render").hide();
    } else {
        $("#__autorender").removeAttr ("checked", "autorenderOn");
        $("#__btn_render").show();
    }
}

function showLanguageState () {
    if ("msgenny" === gLanguage) {
        $("#__language_mscgen").removeAttr("checked", "msgennyOn");
        $("#__language_msgenny").prop("checked", "msgennyOn");
        $("#__language_json").removeAttr("checked", "msgennyOn");
        $("#__btn_colorize").hide();
        $("#__btn_uncolorize").hide();
        $("#__btn_colorize_hard").hide();
        $("#__btn_weigh").hide();
        $("#__btn_ioweigh").hide();
    } else if ("json" === gLanguage){
        $("#__language_mscgen").removeAttr("checked", "msgennyOn");
        $("#__language_msgenny").removeAttr("checked", "msgennyOn");
        $("#__language_json").prop("checked", "msgennyOn");
        $("#__btn_colorize").show();
        $("#__btn_uncolorize").show();
        $("#__btn_colorize_hard").show();
        $("#__btn_weigh").show();
        $("#__btn_ioweigh").show();
    } else /* "mscgen" === gLanguage || "xu" === gLanguage */{
        $("#__language_mscgen").prop("checked", "msgennyOn");
        $("#__language_msgenny").removeAttr("checked", "msgennyOn");
        $("#__language_json").removeAttr("checked", "msgennyOn");
        $("#__btn_colorize").show();
        $("#__btn_uncolorize").show();
        $("#__btn_colorize_hard").show();
        $("#__btn_weigh").show();
        $("#__btn_ioweigh").show();
    }
    if (gAutoRender) {
        render ();
    }
}

function render() {
    try {
        hideError();
        msc_render.clean("__svg", window);
        msc_render.renderAST(getAST(gCodeMirror.getValue(), gLanguage), gCodeMirror.getValue(), "__svg", window);
        /* the next three lines are too slow for (auto) rendering 
         *   - canvg is called twice for doing exactly the same (svg => canvas)
         *   - it inserts relatively big amounts of data in the DOM tree 
         *     (typically 20k for svg, 60k for png, somewhat more for jpeg,
         *     not even corrected for the base64 penalty)
         *   - for bigger sources (e.g. test01_all_possible_arcs.mscin) 
         *     auto rendering is unbearably slow, which stands to reason as 
         *     the source tree has to be updated with  
         *     1.3 * (~250k (png) + ~250k (jpeg) + ~80k (svg)) = ~750k 
         *     on each keystroke  
         *     How slow? 4-5 seconds for each keystroke for test01 
         *     on a 2.53 GHz Intel Core 2 Duo running OS X 10.8.4 in 
         *     FF 23/ Safari 6.0.5
         *  
         * Switched back to rendering on the onclick event.
         * Only generating the svg to base64 encoding is doable in regular 
         * cases, but is noticeable in test01, 
         */
        // $("#show_svg").attr('href', toVectorURI("#__svg")); 
        // $("#show_png").attr('href', toRasterURI("#__svg", "image/png"));
        // $("#show_jpeg").attr('href', toRasterURI("#__svg", "image/jpeg"));

    } catch (e) {
        if (e.line !== undefined && e.column !== undefined) {
            displayError(
             "Line " + e.line + ", column " + e.column + ": " + e.message);
        } else {
            displayError(e.message);
        }
        // TODO: doesn't work that well when the error is not 
        // on the position you were typing...
        // gCodeMirror.setCursor (e.line, e.column);
    }
}
function closeAllLightBoxes() {
    $("#__cheatsheet").hide();
    $("#__embedsheet").hide();
}
function hideError () {
    $("#__error_output").hide();
}

function displayError (pString) {
    $("#__error_output").show();
    $("#__error_output").text(pString);
}

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