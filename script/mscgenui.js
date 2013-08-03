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
  ui << msc [label="parseTree"];
  ui => render [label="renderParseTree(parseTree, text)"];
  render => utls [label="low level helpers"];  
  utls => doc [label="all kinds of dom manipulation"];
  render => doc [label="all kinds of dom manipulation"];
  render note render [label="move dom manipulation down?"];

  --- [label="[parse error]", linecolor="red"];
  ui << msc [label="exception"];
  ui =>> ui [label="show error"];

  ui =>> html [label="show error"];

  |||;
  ui note render [label="There's a parser for mscgen and a separate one for ms genny. For simplicity only showning one.", textbgcolor="#ffe"];
  }
*/

define(["mscgenparser", "msgennyparser", "mscrender",
        "parsetree2msgenny", "parsetree2mscgen", "codemirror",
        "codemirror/addon/edit/closebrackets",
        "codemirror/addon/edit/matchbrackets",
        "codemirror/mode/mscgen/mscgen",
        "jquery"],
        function(msc_parse, genny_parse, msc_render,
            to_msgenny, to_mscgen, codemirror,
            cm_closebrackets,
            cm_matchbrackets,
            cm_mscgen,
            $) {

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
        mode              : "mscgen",
        lineWrapping      : true
    });


$(document).ready(function(){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-42701906-1', 'sverweij.github.io');
    ga('send', 'pageview');


    showAutorenderState ();
    showMsGennyState ();
    render();
    $("#autorender").bind({
        click : function(e) {
                    autorenderOnClick();
                    ga('send', 'event', 'toggle_autorender', 'checkbox');
                }
    });
    $("#msgenny").bind({
        click : function(e) {
                    msgennyOnClick();
                    ga('send', 'event', 'toggle_ms_genny', 'checkbox');
                }
    });
    $("#show_svg_source").bind({
        click : function(e) {
                    show_svg_sourceOnClick();
                    ga('send', 'event', 'show_svg_source', 'button');
                }
    });
    $("#svg").bind({
        dblclick : function(e) {
                    show_svg_sourceOnClick();
                    ga('send', 'event', 'show_svg_source', 'svg dblcick');
                }
    });
    $("#show_svg").bind({
        click : function(e) {
                    show_svgOnClick();
                    ga('send', 'event', 'show_svg_base64', 'button');
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
    gCodeMirror.on ("change", function() {
                    msc_inputKeyup();
                    if (gGaKeyCount > 17) {
                        gGaKeyCount = 0;
                        ga('send', 'event', '17 characters typed', 'textarea');
                    } else {
                        gGaKeyCount++;
                    }
    });
    /*
    $("#msc_input").bind({
        keyup : function(e) {
                    msc_inputKeyup();
                    if (gGaKeyCount > 17) {
                        gGaKeyCount = 0;
                        ga('send', 'event', '17 characters typed', 'textarea');
                    } else {
                        gGaKeyCount++;
                    }
                },
        paste : function (e) {
                    msc_inputPaste();
                    ga('send', 'event', 'paste', 'textarea');
                },
        cut : function (e) {
                    ga('send', 'event', 'cut', 'textarea');
                },
        copy : function (e) {
                    ga('send', 'event', 'copy', 'textarea');
                }
    });
    */
    $("#textcopybox").bind({
        cut : function (e) {
                    ga('send', 'event', 'cut', 'svgsource');
                },
        copy : function (e) {
                    ga('send', 'event', 'copy', 'svgsource');
                }
    });
    $("#langlink").bind ({
        click : function(e) {
                    ga('send', 'event', 'link', $("#langlink").attr("href"));
                }
    });
    $("#forkme").bind ({
        click : function(e) {
                    ga('send', 'event', 'link', $("#forkme").attr("href"));
                }
    });

    $("body").bind({
        keydown : function (e) {
           var lKey = e.keyCode;               
           var lTarget = $(e.currentTarget);   
                                               
           switch(lKey) {                      
               case (ESC_KEY) : {
                   closeLightbox();
                    ga('send', 'event', 'close_source_lightbox', 'ESC_KEY');
                   break;
               } default: {
                   break;
               }
           }
        }
    });

    
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

function msgennyOnClick () {
    gMsGenny = !gMsGenny;
    if (gMsGenny === true) {
        // $("#msc_input").val(mscgen2genny ($("#msc_input").val()));
        gCodeMirror.setValue(mscgen2genny(gCodeMirror.getValue()));
        gCodeMirror.setOption("mode", "msgenny");
    } else {
        gCodeMirror.setValue(genny2mscgen(gCodeMirror.getValue()));
        gCodeMirror.setOption("mode", "mscgen");
    }
    showMsGennyState ();
}

// webkit (at least in Safari Version 6.0.5 (8536.30.1) which is
// distibuted with MacOSX 10.8.4) omits the xmlns: and xlink:
// namespace prefixes in front of xlink and all hrefs respectively. 
// this function does a crude global replace to circumvent the
// resulting problems.
function webkitNamespaceBugWorkaround(pText){
    var lText =  pText.replace(/\ xlink=/g, " xmlns:xlink=", "g");
    lText = lText.replace(/\ href=/g, " xlink:href=", "g");
    lText =  lText.replace(/\ xhtml=/g, " xmlns:xhtml=", "g");
    lText = lText.replace(/\<div/g, "<xhtml:div", "g");// TODO: strictly speaking not needed anymore
    return lText;
}
function show_svg_sourceOnClick () {
    // tracked in caller 
    $("#textcopylightbox").show();
    $("#textcopybox").text(webkitNamespaceBugWorkaround($("#svg").html()));
    $("#textcopybox").select();
}

function show_svgOnClick () {
    var lb64 = btoa(unescape(encodeURIComponent(webkitNamespaceBugWorkaround($("#svg").html()))));
    var lURI = "data:image/svg+xml;base64,"+lb64;
    var lWindow = window.open(lURI, "_blank");
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
        $("#msgenny").attr("checked", "msgennyOn");
    } else {
        $("#msgenny").removeAttr("checked", "msgennyOn");
    }
    if (gAutoRender) {
        render ();
    }
}

function mscgen2genny (pMscgenText) {
    try { 
        var lParseTree = mscparser.parse(pMscgenText);
        return tomsgenny.render(lParseTree);
    } catch (e) {
        return pMscgenText;
    }
}

function genny2mscgen (pMsGennyText) {
    try { 
        var lParseTree = msgennyparser.parse(pMsGennyText);
        return tomscgen.render(lParseTree);
    } catch (e) {
        return pMsGennyText;
    }
}

function render() {
    try {
        hideError();
        var lParseTree;

        if (gMsGenny) {
            // lParseTree = msgennyparser.parse($("#msc_input").val());
            lParseTree = msgennyparser.parse(gCodeMirror.getValue());
        } else {
            // lParseTree = mscparser.parse($("#msc_input").val());
            lParseTree = mscparser.parse(gCodeMirror.getValue());
        }
        msc_render.clean();
        msc_render.renderParseTree(lParseTree, gCodeMirror.getValue());

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
    $("textcopybox").text("");
    $("#textcopylightbox").hide();
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
