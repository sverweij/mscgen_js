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

define(["../jquery", "../parse/xuparser", "../parse/msgennyparser", "../render/graphics/renderast",
        "../render/text/ast2msgenny", "../render/text/ast2xu", "../render/text/ast2dot", "../render/text/ast2mscgen",
        "../utl/gaga", "../render/text/textutensils", "../render/text/colorize",
        "../utl/paramslikker",
        "../../lib/codemirror/lib/codemirror",
        "../../lib/codemirror/addon/edit/closebrackets",
        "../../lib/codemirror/addon/edit/matchbrackets",
        "../../lib/codemirror/addon/display/placeholder",
        "../../lib/codemirror/mode/mscgen/mscgen",
        "../../lib/canvg/canvg",
        "../../lib/canvg/StackBlur",
        "../../lib/canvg/rgbcolor"
        ],
        function($, mscparser, msgennyparser, msc_render,
            tomsgenny, tomscgen, todot, tovanilla,
            gaga, txt, colorize,
            params,
            codemirror,
            cm_closebrackets,
            cm_matchbrackets,
            cm_placeholder,
            cm_mscgen,
            cv,
            cv_stackblur,
            cv_rgbcolor
        ) {

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
        mode              : "xu",
        placeholder       : "Type your text (mscgen syntax or ms genny). Or drag a file to this area....",
        lineWrapping      : true
    });

var gErrorCoordinates = {
    line : 0,
    column : 0
  };
var gDebug = false;

$(document).ready(function(){

    var lParams = params.getParams (window.location.search);

    gaga.gaSetup("false" === lParams.donottrack || undefined === lParams.donottrack );
    gaga.g('create', 'UA-42701906-1', 'sverweij.github.io');
    gaga.g('send', 'pageview');

    setupEvents();
    processParams(lParams);

/* stuff
    $("#__samples").empty();
    $.getJSON('./samples/samples.json', function(pData){
        try {
            $("#__samples").fadeIn("slow");
            pData.samples.forEach(function(pSample){
                if ((true === pSample.debug && gDebug)||(!pSample.debug)) {
                    $("#__samples").append("<option value=\"" + pSample.url + "\">"
                    + pSample.name + "</option>");
                }

            });
        } catch (e) {
            $("#__samples").hide();
        }

    });
/* stuff */

    $("#__pngcanvas").hide();
    showAutorenderState ();
    showLanguageState (gCodeMirror.getValue(), gLanguage);
    render(gCodeMirror.getValue(), gLanguage);
    if (undefined === lParams.msc) {
        samplesOnChange();
    }

}); // document ready

function setupEvents () {
    $("#__autorender").bind({
        click : function(e) {
                    autorenderOnClick(gCodeMirror.getValue(), gLanguage);
                    gaga.g('send', 'event', 'toggle_autorender', 'checkbox');
                }
    });
    $("#__language_msgenny").bind ({
        click : function(e) {
                    switchLanguageOnClick(gCodeMirror.getValue(), "msgenny");
                    gaga.g('send', 'event', 'toggle_ms_genny', 'msgenny');
                }
    });
    $("#__language_mscgen").bind ({
        click : function(e) {
                    switchLanguageOnClick(gCodeMirror.getValue(), "mscgen");
                    gaga.g('send', 'event', 'toggle_ms_genny', 'mscgen');
                }
    });
    $("#__language_json").bind ({
        click : function(e) {
                    switchLanguageOnClick(gCodeMirror.getValue(), "json");
                    gaga.g('send', 'event', 'toggle_ms_genny', 'json');
                }
    });
    $("#__btn_colorize").bind({
        click : function(e) {
                    colorizeOnClick(gCodeMirror.getValue(), gLanguage, false);
                    gaga.g('send', 'event', 'colorize', 'button');
                }
    });
    $("#__btn_uncolorize").bind({
        click : function(e) {
                    unColorizeOnClick(gCodeMirror.getValue(), gLanguage, false);
                    gaga.g('send', 'event', 'uncolorize', 'button');
                }
    });
    $("#__btn_colorize_hard").bind({
        click : function(e) {
                    colorizeOnClick(gCodeMirror.getValue(), gLanguage, true);
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
                    show_htmlOnClick(gCodeMirror.getValue(), gLanguage);
                    gaga.g('send', 'event', 'show_html', 'button');
                }
    });
    $("#__show_dot").bind({
        click : function(e) {
                    show_dotOnClick(gCodeMirror.getValue(), gLanguage);
                    gaga.g('send', 'event', 'show_dot', 'button');
                }
    });
    $("#__show_vanilla").bind({
        click : function(e) {
                    show_vanillaOnClick(gCodeMirror.getValue(), gLanguage);
                    gaga.g('send', 'event', 'show_vanilla', 'button');
                }
    });
    $("#__show_url").bind({
        click : function(e) {
                    show_urlOnClick(gCodeMirror.getValue(), gLanguage);
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
                    renderOnClick(gCodeMirror.getValue(), gLanguage);
                    gaga.g('send', 'event', 'render', 'button');
                }
    });
    $("#__samples").bind("change", function (e) {
                    samplesOnChange();
                    gaga.g('send', 'event', 'selectexample', $("#__samples").val() );
    });

    gCodeMirror.on ("change", function() {
                    msc_inputKeyup(gCodeMirror.getValue(), gLanguage);
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
                        setLanguage(txt.classifyExtension(pEvent.dataTransfer.files[0].name));
                        showLanguageState (gCodeMirror.getValue(), gLanguage);
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
                    embedmeOnClick(gCodeMirror.getValue(), gLanguage);
                    gaga.g('send', 'event', 'link', "embedme");
                }
    });
    $("#__error").bind ({
        click : function(e) {
                    errorOnClick();
                    gaga.g('send', 'event', 'link', "error");
                }
    });

    $("body").bind({
        keydown : function (e) {
           var lKey = e.keyCode;
           var lTarget = $(e.currentTarget);

           switch(lKey) {
               case (ESC_KEY) : {
                   closeAllLightBoxes();
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
        gDebug = true;
        $(".debug").show();
        gaga.g('send', 'event', 'debug', 'true');
    }

    if (pParams.msc) {
        gCodeMirror.setValue(pParams.msc);
        gaga.g('send', 'event', 'params.msc');
    }
    if (pParams.lang){
        setLanguage(pParams.lang);
        gaga.g('send', 'event', 'params.lang', pParams.lang);
    }
    if (pParams.outputformat){
        gaga.g('send', 'event', 'params.outputformat', pParams.outputformat);
    }
}

function msc_inputKeyup (pSource, pLanguage) {
    if (gAutoRender) {
        render(pSource, pLanguage);
    }
}

function renderOnClick (pSource, pLanguage) {
    render(pSource, pLanguage);
}

function autorenderOnClick (pSource, pLanguage) {
    gAutoRender = !gAutoRender;
    if (gAutoRender) {
        render (pSource, pLanguage);
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

function switchLanguageOnClick (pSource, pLanguage) {
    var lPreviousLanguage = gLanguage;
    var lAST = {};
    var lTargetSource = "";
    try {
        lAST = getAST(pSource, lPreviousLanguage);
        if (lAST !== {}){
            lTargetSource = renderSource(lAST, pLanguage);
            gCodeMirror.setValue(lTargetSource);
        }
    } catch(e) {
        // do nothing
    }
    setLanguage(pLanguage);
    showLanguageState (lTargetSource, pLanguage);
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

function colorizeOnClick(pSource, pLanguage, pHardOverride){
    var lAST = {};

    try {
        lAST = getAST(pSource, pLanguage);

        if (lAST !== {}){
            lAST = colorize.colorize(lAST, pHardOverride);
            gCodeMirror.setValue(renderSource(lAST, pLanguage));
        }
    } catch(e) {
        // do nothing
    }
}

function unColorizeOnClick(pSource, pLanguage, pHardOverride){
    var lAST = {};

    try {
        lAST = getAST(pSource, pLanguage);

        if (lAST !== {}){
            lAST = colorize.uncolor(lAST, pHardOverride);
            gCodeMirror.setValue(renderSource(lAST, pLanguage));
        }
    } catch(e) {
        // do nothing
    }
}

function errorOnClick(){
    gCodeMirror.setCursor(gErrorCoordinates.line -1, gErrorCoordinates.column -1);
    gCodeMirror.focus();
}

function renderSource(pAST, pLanguage){
    var lTargetSource = "";

    if ("msgenny" === pLanguage){
        lTargetSource = tomsgenny.render(pAST);
    } else if ("json" === pLanguage){
        lTargetSource = JSON.stringify(pAST, null, "  ");
    } else if ("xu" === pLanguage){
        lTargetSource = tomscgen.render(pAST);
    } else {
        lTargetSource = tomscgen.render(pAST);
    }
    return lTargetSource;
}

function setLanguage (pLanguage){
    gLanguage = pLanguage;
    if ("mscgen" === pLanguage){
        gCodeMirror.setOption("mode", "xu");
    } else {
        gCodeMirror.setOption("mode", pLanguage);
    }
}

function samplesOnChange() {
    var lSelectedSample = $("#__samples").val();
    if ("none" === lSelectedSample || null === lSelectedSample || undefined === lSelectedSample){
        clearOnClick();
    } else {
        $.ajax({
            url : $("#__samples").val(),
            success : function(pData) {
                if ($("#__samples").val()) {
                    setLanguage(txt.classifyExtension($("#__samples").val()));
                }
                showLanguageState (gCodeMirror.getValue(), gLanguage);
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

function embedmeOnClick (pSource, pLanguage) {
    $("#__cheatsheet").hide();
    $("#__embedsnippet").text(getHTMLSnippet(pSource, pLanguage));
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
function getHTMLSnippet(pSource, pLanguage) {
    return "<!DOCTYPE html>\n<html>\n  <head>\n    <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>\n    <script src='https://sverweij.github.io/mscgen_js/mscgen-inpage.js' defer>\n    </script>\n  </head>\n  <body>\n    <pre class='code " + pLanguage + " mscgen_js' data-language='" + pLanguage +"'>\n" + pSource + "\n    </pre>\n  </body>\n</html>";
}
function show_htmlOnClick(pSource, pLanguage){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(getHTMLSnippet(pSource, pLanguage)));
}

function show_dotOnClick(pSource, pLanguage){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(todot.render(getAST(pSource, pLanguage))));
}

function show_vanillaOnClick(pSource, pLanguage){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(tovanilla.render(getAST(pSource, pLanguage))));
}

function show_urlOnClick(pSource, pLanguage){
    var lWindow = window.open('data:text/plain;charset=utf-8,'+
        encodeURIComponent(
            window.location.protocol + '//' +
            window.location.host +
            window.location.pathname +
            '?donottrack=true&debug=true&lang=' + pLanguage +
            '&msc=' +  escape(pSource)
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

function showLanguageState (pSource, pLanguage) {
    if ("msgenny" === pLanguage) {
        $("#__language_mscgen").removeAttr("checked", "msgennyOn");
        $("#__language_msgenny").prop("checked", "msgennyOn");
        $("#__language_json").removeAttr("checked", "msgennyOn");
        $("#__btn_colorize").hide();
        $("#__btn_uncolorize").hide();
        $("#__btn_colorize_hard").hide();
    } else if ("json" === pLanguage){
        $("#__language_mscgen").removeAttr("checked", "msgennyOn");
        $("#__language_msgenny").removeAttr("checked", "msgennyOn");
        $("#__language_json").prop("checked", "msgennyOn");
        $("#__btn_colorize").show();
        $("#__btn_uncolorize").show();
        $("#__btn_colorize_hard").show();
    } else /* "mscgen" === pLanguage || "xu" === pLanguage */{
        $("#__language_mscgen").prop("checked", "msgennyOn");
        $("#__language_msgenny").removeAttr("checked", "msgennyOn");
        $("#__language_json").removeAttr("checked", "msgennyOn");
        $("#__btn_colorize").show();
        $("#__btn_uncolorize").show();
        $("#__btn_colorize_hard").show();
    }
    if (gAutoRender) {
        render (pSource, pLanguage);
    }
}

function render(pSource, pLanguage) {
    try {
        hideError();
        msc_render.clean("__svg", window);
        msc_render.renderAST(getAST(pSource, pLanguage), pSource, "__svg", window);
    } catch (e) {
        if (e.line !== undefined && e.column !== undefined) {
            gErrorCoordinates.line = e.line;
            gErrorCoordinates.column = e.column;
            displayError(
             "Line " + e.line + ", column " + e.column + ": " + e.message,
              ">>> " + pSource.split('\n')[e.line - 1] + " <<<");
        } else {
            gErrorCoordinates.line = 0;
            gErrorCoordinates.column = 0;
            displayError(e.message);
        }
    }
}

function closeAllLightBoxes() {
    $("#__cheatsheet").hide();
    $("#__embedsheet").hide();
}

function hideError () {
    $("#__error").hide();
    $("#__error_context").text("");
}

function displayError (pError, pContext) {
    $("#__error").show();
    $("#__error_output").text(pError);
    $("#__error_context").text(pContext);
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
