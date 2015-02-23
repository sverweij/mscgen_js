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
/* jshint jquery:false */
/* jshint nonstandard:true */
/* global define, canvg */

define(["../parse/xuparser", "../parse/msgennyparser", "../render/graphics/renderast",
        "../render/text/ast2msgenny", "../render/text/ast2xu", "../render/text/ast2dot", "../render/text/ast2mscgen",
        "../utl/gaga", "../render/text/textutensils", "../render/text/colorize",
        "../utl/paramslikker", "./controller-animator",
        "../../lib/codemirror/lib/codemirror",
        "../utl/domquery",
        "../../lib/codemirror/addon/edit/closebrackets",
        "../../lib/codemirror/addon/edit/matchbrackets",
        "../../lib/codemirror/addon/display/placeholder",
        "../../lib/codemirror/mode/mscgen/mscgen",
        "../../lib/canvg/canvg",
        "../../lib/canvg/StackBlur",
        "../../lib/canvg/rgbcolor"
        ],
        function(mscparser, msgennyparser, msc_render,
            tomsgenny, tomscgen, todot, tovanilla,
            gaga, txt, colorize,
            params, animctrl,
            codemirror,
            dq
        ) {
"use strict";

var gAutoRender = true;
var gLanguage = "mscgen";
var gGaKeyCount = 0;
var ESC_KEY   = 27;
var gCodeMirror =
    codemirror.fromTextArea(window.__msc_input, {
        lineNumbers       : true,
        autoCloseBrackets : true,
        matchBrackets     : true,
        theme             : "midnight",
        mode              : "xu",
        placeholder       : "Type your text (mscgen syntax or ms genny). Or drag a file to this area....",
        lineWrapping      : false
    });

var gErrorCoordinates = {
    line : 0,
    column : 0
  };
var gDebug = false;

// $(document).ready(function(){

    var lParams = params.getParams (window.location.search);

    gaga.gaSetup("false" === lParams.donottrack || undefined === lParams.donottrack );
    gaga.g('create', 'UA-42701906-1', 'sverweij.github.io');
    gaga.g('send', 'pageview');

    setupEvents();
    processParams(lParams);

    showAutorenderState ();
    showLanguageState (gCodeMirror.getValue(), gLanguage);
    render(gCodeMirror.getValue(), gLanguage);
    if (undefined === lParams.msc) {
        samplesOnChange();
    }
    if (window.__loading) {
        window.__loading.outerHTML = "";
    }

// }); // document ready

function setupEvents () {
    window.__autorender.addEventListener("click",
        function(e) {
            autorenderOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'toggle_autorender', 'checkbox');
        },
        false
    );
    window.__language_msgenny.addEventListener("click",
        function(e) {
            switchLanguageOnClick(gCodeMirror.getValue(), "msgenny");
            gaga.g('send', 'event', 'toggle_ms_genny', 'msgenny');
        },
        false
    );
    window.__language_mscgen.addEventListener("click",
        function(e) {
            switchLanguageOnClick(gCodeMirror.getValue(), "mscgen");
            gaga.g('send', 'event', 'toggle_ms_genny', 'mscgen');
        },
        false
    );
    window.__language_json.addEventListener("click",
        function(e) {
            switchLanguageOnClick(gCodeMirror.getValue(), "json");
            gaga.g('send', 'event', 'toggle_ms_genny', 'json');
        },
        false
    );
    window.__btn_colorize.addEventListener("click",
        function(e) {
            colorizeOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'colorize', 'button');
        },
        false
    );
    window.__btn_uncolorize.addEventListener("click",
        function(e) {
            unColorizeOnClick(gCodeMirror.getValue(), gLanguage, false);
            gaga.g('send', 'event', 'uncolorize', 'button');
        },
        false
    );
    window.__svg.addEventListener("dblclick",
        function(e) {
            show_svgOnClick();
            gaga.g('send', 'event', 'show_svg_base64', 'svg dblcick');
        },
        false
    );
    window.__show_svg.addEventListener("click",
        function(e) {
            show_svgOnClick();
            gaga.g('send', 'event', 'show_svg_base64', 'button');
        },
        false
    );
    window.__show_png.addEventListener("click",
        function(e) {
            show_rasterOnClick("image/png");
            gaga.g('send', 'event', 'show_png_base64', 'button');
        },
        false
    );
    window.__show_jpeg.addEventListener("click",
        function(e) {
            show_rasterOnClick("image/jpeg");
            gaga.g('send', 'event', 'show_jpeg_base64', 'button');
        },
        false
    );
    window.__show_html.addEventListener("click",
        function(e) {
            show_htmlOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'show_html', 'button');
        },
        false
    );
    window.__show_dot.addEventListener("click",
        function(e) {
            show_dotOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'show_dot', 'button');
        },
        false
    );
    window.__show_vanilla.addEventListener("click",
            function(e) {
                show_vanillaOnClick(gCodeMirror.getValue(), gLanguage);
                gaga.g('send', 'event', 'show_vanilla', 'button');
            },
            false
        );
    window.__show_url.addEventListener("click",
        function(e) {
            show_urlOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'show_url', 'button');
        },
        false
    );
    window.__show_anim.addEventListener("click",
        function(e) {
            show_animOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'show_anim', 'button');
        },
        false
    );

    window.__close_lightbox.addEventListener("click",
        function(e) {
            dq.SS(window.__cheatsheet).hide();
            gaga.g('send', 'event', 'close_source_lightbox', 'button');
        },
        false
    );
    window.__close_embedsheet.addEventListener("click",
        function(e) {
            dq.SS(window.__embedsheet).hide();
            gaga.g('send', 'event', 'close_embedsheet', 'button');
        },
        false
    );
    window.__close_aboutsheet.addEventListener("click",
        function(e) {
            dq.SS(window.__aboutsheet).hide();
            gaga.g('send', 'event', 'close_aboutsheet', 'button');
        },
        false
    );
    window.__btn_render.addEventListener("click",
        function(e) {
            renderOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'render', 'button');
        },
        false
    );
    window.__samples.addEventListener("change",
        function (e) {
            samplesOnChange();
            gaga.g('send', 'event', 'selectexample', window.__samples.value);
        },
        false
    );

    gCodeMirror.on ("change",
        function() {
            msc_inputKeyup(gCodeMirror.getValue(), gLanguage);
            if (gGaKeyCount > 17) {
                gGaKeyCount = 0;
                gaga.g('send', 'event', '17 characters typed', gLanguage);
            } else {
                gGaKeyCount++;
            }
    });
    gCodeMirror.on ("drop",
        function(pThing, pEvent) {
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
    function linkClickEventHandler(e) {
        var lTarget = "unknown";

        if (e.currentTarget && e.currentTarget.href){
            lTarget = e.currentTarget.href;
        }

        gaga.g('send', 'event', 'link', lTarget);
    }
    dq.attachEventHandler("a[href]", "click", linkClickEventHandler);
    window.__helpme.addEventListener("click",
        function(e) {
            helpmeOnClick();
            gaga.g('send', 'event', 'link', "helpme");
        },
        false
    );
    window.__embedme.addEventListener("click",
        function(e) {
            embedmeOnClick(gCodeMirror.getValue(), gLanguage);
            gaga.g('send', 'event', 'link', "embedme");
        },
        false
    );
    window.__about.addEventListener("click",
        function(e) {
            aboutOnClick();
            gaga.g('send', 'event', 'link', "about");
        },
        false
    );
    window.__error.addEventListener("click",
        function(e) {
            errorOnClick();
            gaga.g('send', 'event', 'link', "error");
        },
        false
    );
    window.document.body.addEventListener("keydown",
        function (e) {
           if(ESC_KEY === e.keyCode) {
                dq.SS(window.__cheatsheet).hide();
                dq.SS(window.__embedsheet).hide();
                dq.SS(window.__aboutsheet).hide();
                animctrl.close();
           }
        },
        false
    );
}

function processParams(pParams){
    if ("true" === pParams.debug) {
        gDebug = true;
        dq.doForAllOfClass("debug", function(pDomNode){
            dq.SS(pDomNode).show();
        });
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

function colorizeOnClick(pSource, pLanguage) {
    var lAST = {};

    try {
        lAST = getAST(pSource, pLanguage);

        if (lAST !== {}){
            lAST = colorize.colorize(lAST, false);
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
    var lSelectedSample = window.__samples.value;
    if ("none" === lSelectedSample || null === lSelectedSample || undefined === lSelectedSample){
        clearOnClick();
    } else {
        dq.ajax (lSelectedSample, function(pEvent){
            setLanguage(txt.classifyExtension(lSelectedSample));
            showLanguageState (gCodeMirror.getValue(), gLanguage);
            gCodeMirror.setValue(pEvent.target.response);
        });
    }
}

function embedmeOnClick (pSource, pLanguage) {
    dq.SS(window.__cheatsheet).hide();
    window.__embedsnippet.textContent = getHTMLSnippet(pSource, pLanguage);
    dq.SS(window.__embedsheet).toggle();
    dq.SS(window.__aboutsheet).hide();
}

function helpmeOnClick () {
    dq.SS(window.__embedsheet).hide();
    dq.SS(window.__cheatsheet).toggle();
    dq.SS(window.__aboutsheet).hide();
}

function aboutOnClick () {
    dq.SS(window.__embedsheet).hide();
    dq.SS(window.__cheatsheet).hide();
    dq.SS(window.__aboutsheet).toggle();
}
function show_animOnClick(pSource, pLanguage){
    try {
        animctrl.initialize(getAST(pSource, pLanguage));
        dq.SS(window.__animscreen).show();
    } catch(e) {
        // do nothing
    }
}

function toVectorURI (pSourceElementId) {
    var lb64 = btoa(unescape(encodeURIComponent(dq.webkitNamespaceBugWorkaround(pSourceElementId.innerHTML))));
    return "data:image/svg+xml;base64,"+lb64;
}

function show_svgOnClick () {
    window.open(toVectorURI(window.__svg), "_blank");
}

function toRasterURI(pSourceElement, pType){
    canvg(window.__pngcanvas, dq.webkitNamespaceBugWorkaround(pSourceElement.innerHTML));
    return window.__pngcanvas.toDataURL(pType, 0.8);
}

function show_rasterOnClick (pType) {
    window.open(toRasterURI(window.__svg, pType), "_blank");
}
function getHTMLSnippet(pSource, pLanguage) {
    return "<!DOCTYPE html>\n<html>\n  <head>\n    <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>\n    <script src='https://sverweij.github.io/mscgen_js/mscgen-inpage.js' defer>\n    </script>\n  </head>\n  <body>\n    <pre class='code " + pLanguage + " mscgen_js' data-language='" + pLanguage +"'>\n" + pSource + "\n    </pre>\n  </body>\n</html>";
}
function show_htmlOnClick(pSource, pLanguage){
    window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(getHTMLSnippet(pSource, pLanguage)));
}

function show_dotOnClick(pSource, pLanguage){
    window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(todot.render(getAST(pSource, pLanguage))));
}

function show_vanillaOnClick(pSource, pLanguage){
    window.open('data:text/plain;charset=utf-8,'+encodeURIComponent(tovanilla.render(getAST(pSource, pLanguage))));
}

function show_urlOnClick(pSource, pLanguage){
    window.open('data:text/plain;charset=utf-8,'+
        encodeURIComponent(
            window.location.protocol + '//' +
            window.location.host +
            window.location.pathname +
            '?donottrack=true&debug=true&lang=' + pLanguage +
            '&msc=' +  escape(pSource)
        )
    );
}

function showAutorenderState () {
    if (gAutoRender) {
        window.__autorender.checked = true;
        dq.SS(window.__btn_render).hide();
    } else {
        window.__autorender.checked = false;
        dq.SS(window.__btn_render).show();
    }
}

function showLanguageState (pSource, pLanguage) {
    if ("msgenny" === pLanguage) {
        window.__language_mscgen.checked = false;
        window.__language_msgenny.checked = true;
        window.__language_json.checked = false;
        dq.SS(window.__btn_colorize).hide();
        dq.SS(window.__btn_uncolorize).hide();
    } else if ("json" === pLanguage){
        window.__language_mscgen.checked = false;
        window.__language_msgenny.checked = false;
        window.__language_json.checked = true;
        dq.SS(window.__btn_colorize).show();
        dq.SS(window.__btn_uncolorize).show();
    } else /* "mscgen" === pLanguage || "xu" === pLanguage */{
        window.__language_mscgen.checked = true;
        window.__language_msgenny.checked = false;
        window.__language_json.checked = false;
        dq.SS(window.__btn_colorize).show();
        dq.SS(window.__btn_uncolorize).show();
    }
    if (gAutoRender) {
        render (pSource, pLanguage);
    }
}

function render(pSource, pLanguage) {
    try {
        var lAST = {};
        hideError();
        dq.SS(window.__output_buttons).hide();
        msc_render.clean("__svg", window);
        lAST = getAST(pSource, pLanguage);
        msc_render.renderAST(lAST, pSource, "__svg", window);
        if (lAST.entities.length > 0) {
            dq.SS(window.__output_buttons).show();
        }
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

function hideError () {
    dq.SS(window.__error).hide();
    window.__error_output.textContent = "";
    window.__error_context.textContent = "";
}

function displayError (pError, pContext) {
    dq.SS(window.__error).show();
    window.__error_output.textContent = pError;
    window.__error_context.textContent = pContext;
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
 MERCHANTABILITY or FITNEdq.SS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
