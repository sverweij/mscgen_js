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

define(["jquery", "mscgenparser", "msgennyparser", "mscrender",
        "ast2msgenny", "ast2mscgen",
        "../lib/codemirror",
        // "../lib/codemirror/mode/mscgen/mscgen",
        "../lib/codemirror/addon/edit/closebrackets",
        "../lib/codemirror/addon/edit/matchbrackets",
        "../lib/codemirror/addon/display/placeholder",
        "../lib/canvg/canvg",
        "../lib/canvg/StackBlur",
        "../lib/canvg/rgbcolor"
        ],
        function($, msc_parse, genny_parse, msc_render,
            to_msgenny, to_mscgen,
            codemirror,
            // cm_mscgen,
            cm_closebrackets,
            cm_matchbrackets,
            cm_placeholder,
            cv,
            cv_stackblur,
            cv_rgbcolor) {

var gAutoRender = true;
var gMsGenny = false;
var gGaKeyCount = 0;
var ESC_KEY   = 27; 
var gCodeMirror =
    CodeMirror.fromTextArea(document.getElementById("msc_input"), {
        lineNumbers       : true,
        autoCloseBrackets : true,
        matchBrackets     : true,
        theme             : "midnight", 
        placeholder       : "Type your text (mscgen syntax or ms genny). Or drag a file to this area....",
        // mode              : "mscgen",
        lineWrapping      : true
    });


$(document).ready(function(){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-42701906-1', 'sverweij.github.io');
    ga('send', 'pageview');

    $("#__pngcanvas").hide();
    showAutorenderState ();
    showMsGennyState ();
    render();
    $("#autorender").bind({
        click : function(e) {
                    autorenderOnClick();
                    ga('send', 'event', 'toggle_autorender', 'checkbox');
                }
    });
    $("#msgenny_true").bind ({
        click : function(e) {
                    msgennyOnClick(true);
                    ga('send', 'event', 'toggle_ms_genny', 'radio');
                }     
    });
    $("#msgenny_false").bind ({
        click : function(e) {
                    msgennyOnClick(false);
                    ga('send', 'event', 'toggle_ms_genny', 'radio');
                }     
    });
    $("#show_svg_source").bind({
        click : function(e) {
                    helpmeOnClick();
                    ga('send', 'event', 'show_svg_source', 'button');
                }
    });
    $("#btn_clear").bind({
        click : function(e) {
                    clearOnClick();
                    ga('send', 'event', 'clear', 'button');
                }
    });
    $("#svg").bind({
        dblclick : function(e) {
                    show_svgOnClick();
                    ga('send', 'event', 'show_svg_base64', 'svg dblcick');
                }
    });
    $("#show_svg").bind({
        click : function(e) {
                    show_svgOnClick();
                    ga('send', 'event', 'show_svg_base64', 'button');
                }
    });
    $("#show_png").bind({
        click : function(e) {
                    show_rasterOnClick("image/png");
                    ga('send', 'event', 'show_png_base64', 'button');
                }
    });
    $("#show_jpeg").bind({
        click : function(e) {
                    show_rasterOnClick("image/jpeg");
                    ga('send', 'event', 'show_jpeg_base64', 'button');
                }
    });
    $("#close_lightbox").bind({
        click : function(e) {
                    close_lightboxOnClick();
                    ga('send', 'event', 'close_source_lightbox', 'button');
                }
    });
    $("#btn_render").bind({
        click : function(e) {
                    renderOnClick();
                    ga('send', 'event', 'render', 'button');
                }
    });
    $("#__samples").bind("change", function (e) {
                    samplesOnChange();
                    ga('send', 'event', 'selectexample', 'list' );
    });

    gCodeMirror.on ("change", function() {
                    msc_inputKeyup();
                    if (gGaKeyCount > 17) {
                        gGaKeyCount = 0;
                        ga('send', 'event', '17 characters typed', 'textarea');
                    } else {
                        gGaKeyCount++;
                    }
    });
    gCodeMirror.on ("drop", function(pThing, pEvent) {
                    /* if there is a file in the drop event clear the textarea, 
                     * otherwise do default handling for drop events (whatever it is)
                     */
                    if (pEvent.dataTransfer.files.length > 0) {
                        gCodeMirror.setValue("");
                        ga('send', 'event', 'drop', 'textarea');    
                    } 
    });
    $("#__langlink").bind ({
        click : function(e) {
                    console.debug($("#__langlink").attr("href"));
                    ga('send', 'event', 'link', $("#__langlink").attr("href"));
                }
    });
    $("#__tweetme").bind ({
        click : function(e) {
                    ga('send', 'event', 'link', $("#__tweetme").attr("href"));
                }
    });
    $("#__gplusme").bind ({
        click : function(e) {
                    ga('send', 'event', 'link', $("#__gplusme").attr("href"));
                }
    });
    $("#__forkme").bind ({
        click : function(e) {
                    ga('send', 'event', 'link', $("#__forkme").attr("href"));
                }
    });
    $("#__helpme").bind ({
        click : function(e) {
                    helpmeOnClick();
                    ga('send', 'event', 'link', "helpme");
                }
    });

    $("body").bind({
        keydown : function (e) {
           var lKey = e.keyCode;               
           var lTarget = $(e.currentTarget);   
                                 
           switch(lKey) {                      
               case (ESC_KEY) : {
                   closeLightbox();
                    // ga('send', 'event', 'close_source_lightbox', 'ESC_KEY');
                   break;
               } default: {
                   break;
               }
           }
        }
    });
    // closeLightbox();
    samplesOnChange();
    
}); // document ready

function msc_inputKeyup () {
    if (gAutoRender) {
        render();
    }
}
function msc_inputPaste () {
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

function msgennyOnClick (pValue) {
    gMsGenny = pValue;

    if (gMsGenny === true) {
        // $("#msc_input").val(mscgen2genny ($("#msc_input").val()));
        gCodeMirror.setValue(mscgen2genny(gCodeMirror.getValue()));
        // gCodeMirror.setOption("mode", "msgenny");
    } else {
        gCodeMirror.setValue(genny2mscgen(gCodeMirror.getValue()));
        // gCodeMirror.setOption("mode", "mscgen");
    }
    showMsGennyState ();
}

function clearOnClick(){
    if (gMsGenny === true){
        gCodeMirror.setValue("");
    } else {
        gCodeMirror.setValue("msc{\n  \n}");
        gCodeMirror.setCursor(1,3);
    }
}

function samplesOnChange() {
    if ("none" === $("#__samples").val()) {
        clearOnClick();
    } else {
        $.ajax({
            url : $("#__samples").val(),
            success : function(pData) {
                if ($("#__samples").val() && $("#__samples").val().endsWith("msgenny")){
                    gMsGenny = true;
                } else {
                    gMsGenny = false;
                }
                showMsGennyState ();
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
function helpmeOnClick () { 
    $("#__cheatsheet").toggle();
}

function toVectorURI (pSourceElementId) {
    var lb64 = btoa(unescape(encodeURIComponent(webkitNamespaceBugWorkaround($(pSourceElementId).html()))));
    return "data:image/svg+xml;base64,"+lb64;
}
function show_svgOnClick () {
    var lWindow = window.open(toVectorURI("#svg"), "_blank");
}

function toRasterURI(pSourceElementId, pType){
    canvg(document.getElementById("__pngcanvas"), webkitNamespaceBugWorkaround($(pSourceElementId).html()));
    var lCanvas = document.getElementById("__pngcanvas");
    return lCanvas.toDataURL(pType, 0.8);
}

function show_rasterOnClick (pType) {
    var lWindow = window.open(toRasterURI("#svg", pType), "_blank");
}

function close_lightboxOnClick(){
    closeLightbox();
}

function showAutorenderState () {
    if (gAutoRender) {
        $("#autorender").attr("checked", "autorenderOn");
        $("#btn_render").hide();
    } else {
        $("#autorender").removeAttr ("checked", "autorenderOn");
        $("#btn_render").show();
    }
}

function showMsGennyState () {
    if (gMsGenny) {
        $("#msgenny_false").removeAttr("checked", "msgennyOn");
        $("#msgenny_true").attr("checked", "msgennyOn");
    } else {
        $("#msgenny_true").removeAttr("checked", "msgennyOn");
        $("#msgenny_false").attr("checked", "msgennyOn");
    }
    if (gAutoRender) {
        render ();
    }
}

function mscgen2genny (pMscgenText) {
    try { 
        var lAST = mscparser.parse(pMscgenText);
        return tomsgenny.render(lAST);
    } catch (e) {
        return pMscgenText;
    }
}

function genny2mscgen (pMsGennyText) {
    try { 
        var lAST = msgennyparser.parse(pMsGennyText);
        return tomscgen.render(lAST);
    } catch (e) {
        return pMsGennyText;
    }
}

function render() {
    try {
        hideError();
        var lAST;

        if (gMsGenny) {
            lAST = msgennyparser.parse(gCodeMirror.getValue());
        } else {
            lAST = mscparser.parse(gCodeMirror.getValue());
        }
        msc_render.clean("svg");
        msc_render.renderAST(lAST, gCodeMirror.getValue(), "svg");
        
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
        // $("#show_svg").attr('href', toVectorURI("#svg")); 
        // $("#show_png").attr('href', toRasterURI("#svg", "image/png"));
        // $("#show_jpeg").attr('href', toRasterURI("#svg", "image/jpeg"));
        

    } catch (e) {
        displayError(
            e.line !== undefined && e.column !== undefined
        ? "Line " + e.line + ", column " + e.column + ": " + e.message
        : e.message);
        // TODO: doesn't work that well when the error is not 
        // on the position you were typing...
        // gCodeMirror.setCursor (e.line, e.column);
    }
}


function closeLightbox () {
    $("#__cheatsheet").hide();
}

function hideError () {
    $("#error_output").hide();
}

function displayError (pString) {
    $("#error_output").show();
    $("#error_output").text(pString);
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
