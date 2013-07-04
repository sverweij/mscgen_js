/*
msc {
  html [label="index.html"]
, ui [label="mscgenui.js"]
, msc [label="mscparser.js"]
, render [label="mscrender.js"]
, doc [label="window.document"];

  |||;
  html => ui [label="render"];
  ui =>> doc [label="get input from textarea"];
  doc >> ui [label="text"];
  ui =>> msc [label="parse(text)"];
  --- [label="okiedokie"];
  ui << msc [label="parseTree"];
  ui => render [label="renderParseTree(parseTree)"];
  render => doc [label="all kinds of domdocument stuff"];
  
  --- [label="parse error"];
  ui << msc [label="exception"];

}
*/

define(["log", "msc", "mscrender", "jquery"],
        function(log, msc_parse, msc_render, $) {

var gAutoRender = true;
var ESC_KEY   = 27; 

$(document).ready(function(){
    showAutorenderState ();
    render();
    $("#autorender").bind({
        click : function(e) {
                    autorenderOnClick();
                }
    });
    $("#show_svg").bind({
        click : function(e) {
                    show_svgOnClick();
                }
    });
    $("#close_lightbox").bind({
        click : function(e) {
                    close_lightboxOnClick();
                }
    });
    $("#btn_render").bind({
        click : function(e) {
                    renderOnClick();
                }
    });
    $("#msc_input").bind({
        keyup : function(e) {
                    msc_inputKeyup();
                }
    });

    $("body").bind({
        keydown : function (e) {
           var lKey = e.keyCode;               
           var lTarget = $(e.currentTarget);   
                                               
           switch(lKey) {                      
               case (ESC_KEY) : {
                   closeLightbox();
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

function show_svgOnClick () {
    $("#textcopylightbox").show();
    $("#textcopybox").text($("#svg").html());
    $("#textcopybox").select();
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

function render() {
    try {
        hideError();
        var lParseTree = mscparser.parse($("#msc_input").val());
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
