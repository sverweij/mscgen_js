/* jshint browser:true */
/* global define */
define(["./controller-interpreter",
        "./controller-animator",
        "../utl/paramslikker",
        "../utl/domquery",
        "../utl/gaga"],
        function(
            actions,
            animctrl,
            params,
            dq,
            gaga) {
    "use strict";

    var ESC_KEY   = 27;

    function setupGA(pDoNotTrack){
        gaga.gaSetup("false" === pDoNotTrack || undefined === pDoNotTrack );
        gaga.g('create', 'UA-42701906-1', 'sverweij.github.io');
        gaga.g('send', 'pageview');
    }
    function setupInputEvents(){
      window.__autorender.addEventListener("click",
          function() {
              actions.autorenderOnClick();
              gaga.g('send', 'event', 'toggle_autorender', 'checkbox');
          },
          false
      );
      window.__language_msgenny.addEventListener("click",
          function() {
              actions.switchLanguageOnClick("msgenny");
              gaga.g('send', 'event', 'toggle_ms_genny', 'msgenny');
          },
          false
      );
      window.__language_mscgen.addEventListener("click",
          function() {
              actions.switchLanguageOnClick("mscgen");
              gaga.g('send', 'event', 'toggle_ms_genny', 'mscgen');
          },
          false
      );
      window.__language_json.addEventListener("click",
          function() {
              actions.switchLanguageOnClick("json");
              gaga.g('send', 'event', 'toggle_ms_genny', 'json');
          },
          false
      );
      window.__btn_colorize.addEventListener("click",
          function() {
              actions.colorizeOnClick();
              gaga.g('send', 'event', 'colorize', 'button');
          },
          false
      );
      window.__btn_uncolorize.addEventListener("click",
          function() {
              actions.unColorizeOnClick();
              gaga.g('send', 'event', 'uncolorize', 'button');
          },
          false
      );
      window.__btn_render.addEventListener("click",
          function() {
              actions.renderOnClick();
              gaga.g('send', 'event', 'render', 'button');
          },
          false
      );
      window.__samples.addEventListener("change",
          function () {
              actions.setSample(window.__samples.value);
              gaga.g('send', 'event', 'selectexample', window.__samples.value);
          },
          false
      );
    }

    function setupOutputEvents(){
      window.__svg.addEventListener("dblclick",
          function() {
              actions.show_svgOnClick();
              gaga.g('send', 'event', 'show_svg_base64', 'svg dblcick');
          },
          false
      );
      window.__show_svg.addEventListener("click",
          function() {
              actions.show_svgOnClick();
              gaga.g('send', 'event', 'show_svg_base64', 'button');
          },
          false
      );
      window.__show_png.addEventListener("click",
          function() {
              actions.show_rasterOnClick("image/png");
              gaga.g('send', 'event', 'show_png_base64', 'button');
          },
          false
      );
      window.__show_jpeg.addEventListener("click",
          function() {
              actions.show_rasterOnClick("image/jpeg");
              gaga.g('send', 'event', 'show_jpeg_base64', 'button');
          },
          false
      );
      window.__show_html.addEventListener("click",
          function() {
              actions.show_htmlOnClick();
              gaga.g('send', 'event', 'show_html', 'button');
          },
          false
      );
      window.__show_dot.addEventListener("click",
          function() {
              actions.show_dotOnClick();
              gaga.g('send', 'event', 'show_dot', 'button');
          },
          false
      );
      window.__show_vanilla.addEventListener("click",
              function() {
                  actions.show_vanillaOnClick();
                  gaga.g('send', 'event', 'show_vanilla', 'button');
              },
              false
          );
      window.__show_url.addEventListener("click",
          function() {
              actions.show_urlOnClick();
              gaga.g('send', 'event', 'show_url', 'button');
          },
          false
      );
      window.__show_anim.addEventListener("click",
          function() {
              actions.show_animOnClick(animctrl);
              gaga.g('send', 'event', 'show_anim', 'button');
          },
          false
      );
      window.__error.addEventListener("click",
          function() {
              actions.errorOnClick();
              gaga.g('send', 'event', 'link', "error");
          },
          false
      );
    }

    function setupInfoNavigationEvents(){
      window.__close_lightbox.addEventListener("click",
          function() {
              dq.SS(window.__cheatsheet).hide();
              gaga.g('send', 'event', 'close_source_lightbox', 'button');
          },
          false
      );
      window.__close_embedsheet.addEventListener("click",
          function() {
              dq.SS(window.__embedsheet).hide();
              gaga.g('send', 'event', 'close_embedsheet', 'button');
          },
          false
      );
      window.__close_aboutsheet.addEventListener("click",
          function() {
              dq.SS(window.__aboutsheet).hide();
              gaga.g('send', 'event', 'close_aboutsheet', 'button');
          },
          false
      );
      window.__helpme.addEventListener("click",
          function() {
              actions.helpmeOnClick();
              gaga.g('send', 'event', 'link', "helpme");
          },
          false
      );
      window.__embedme.addEventListener("click",
          function() {
              actions.embedmeOnClick();
              gaga.g('send', 'event', 'link', "embedme");
          },
          false
      );
      window.__about.addEventListener("click",
          function() {
              actions.aboutOnClick();
              gaga.g('send', 'event', 'link', "about");
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
    function tagAllLinks(){
      dq.attachEventHandler("a[href]", "click", function(e){
        var lTarget = "unknown";

        if (e.currentTarget && e.currentTarget.href){
            lTarget = e.currentTarget.href;
        }

        gaga.g('send', 'event', 'link', lTarget);
      });
    }

    function processParams(pParams){
        if ("true" === pParams.debug) {
            actions.setDebug(true);
            dq.doForAllOfClass("debug", function(pDomNode){
                dq.SS(pDomNode).show();
            });
            gaga.g('send', 'event', 'debug', 'true');
        }

        if (pParams.msc) {
            actions.setSource(pParams.msc);
            gaga.g('send', 'event', 'params.msc');
        }
        if (pParams.lang){
            actions.setLanguage(pParams.lang);
            gaga.g('send', 'event', 'params.lang', pParams.lang);
        }
    }

    function setupEvents(){
        setupInputEvents();
        setupOutputEvents();
        setupInfoNavigationEvents();
        tagAllLinks();
    }

    var lParams = params.getParams (window.location.search);

    setupGA(lParams.donottrack);
    processParams(lParams);
    setupEvents();
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
