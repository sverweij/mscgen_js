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

  --- [label="[okiedokie]", linecolor="green"];
  ui << msc [label="parseTree"];
  ui => render [label="renderParseTree(parseTree)"];
  render => utls [label="low level helpers"];  
  utls => doc [label="all kinds of dom manipulation"];
  render => doc [label="all kinds of dom manipulation"];
  render note render [label="move dom manipulation down?"];

  --- [label="[parse error]", linecolor="red"];
  ui << msc [label="exception"];
  ui =>> ui [label="show error"];

  ui =>> ui [label="show error"];
  }
*/

define(["mscgenparser", "mscgensmplparser",
        "mscrender", "parsetree2smpl", "parsetree2mscgen", "jquery"],
        function(msc_parse, smpl_parse, msc_render, to_smpl, to_mscgen, $) {

var gAutoRender = true;
var gSmpl = false;
var gGaKeyCount = 0;
var ESC_KEY   = 27; 

$(document).ready(function(){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-42701906-1', 'sverweij.github.io');
    ga('send', 'pageview');

    showAutorenderState ();
    showSmplState ();
    render();
    $("#autorender").bind({
        click : function(e) {
                    autorenderOnClick();
                    ga('send', 'event', 'toggle_autorender', 'checkbox');
                }
    });
    $("#smpl").bind({
        click : function(e) {
                    smplOnClick();
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
    $("#msc_input").bind({
        keyup : function(e) {
                    msc_inputKeyup();
                    if (gGaKeyCount%10 === 0) {
                        gGaKeyCount = 0;
                        ga('send', 'event', '10 characters typed', 'textarea');
                    } else {
                        gGaKeyCount++;
                    }
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

function smplOnClick () {
    gSmpl = !gSmpl;
    if (gSmpl === true) {
        $("#msc_input").val(mscgen2smpl ($("#msc_input").val()));
    } else {
        $("#msc_input").val(smpl2mscgen ($("#msc_input").val()));
    }
    showSmplState ();
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

function showSmplState () {
    if (gSmpl) {
        $("#smpl").attr("checked", "smplOn");
    } else {
        $("#smpl").removeAttr("checked", "smplOn");
    }
    if (gAutoRender) {
        render ();
    }
}

function mscgen2smpl (pMscgenText) {
    try { 
        var lParseTree = mscparser.parse($("#msc_input").val());
        return tosmpl.render(lParseTree);
    } catch (e) {
        return pMscgenText;
    }
}

function smpl2mscgen (pSmplText) {
    try { 
        var lParseTree = mscsmplparser.parse($("#msc_input").val());
        return tomscgen.render(lParseTree);
    } catch (e) {
        return pMscgenText;
    }
}

function render() {
    try {
        hideError();
        var lParseTree;

        if (gSmpl) {
            lParseTree = mscsmplparser.parse($("#msc_input").val());
        } else {
            lParseTree = mscparser.parse($("#msc_input").val());
        }
        msc_render.clean();
        msc_render.renderParseTree(lParseTree, $("#msc_input").val());

    } catch (e) {
        displayError(
            e.line !== undefined && e.column !== undefined
        ? "Line " + e.line + ", column " + e.column + ": " + e.message
        : e.message);
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
