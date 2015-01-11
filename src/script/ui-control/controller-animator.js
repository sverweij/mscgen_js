/* jshint browser:true */
/* global define */

define(["../render/graphics/renderast", "../render/text/ast2animate", "../utl/gaga", "../utl/domquery"],
function(msc_render, ast2animate, gaga, dq) {
    "use strict";

    var ICON_PLAY    = "icon-play3";
    var ICON_PAUSE   = "icon-pause2";
    var gPlaying     = false;
    var gTimer       = {};
    var gInitialized = false;
    var anim = new ast2animate.FrameFactory();

    _setupEvents();

    function initialize(pAST) {
        msc_render.clean("__animsvg", window);
        anim.init(pAST, true);
        msc_render.renderAST(anim.getCurrentFrame(), "", "__animsvg", window);
        gInitialized = true;
    }
    
    function animate(){
        if (gTimer) {
            window.clearTimeout(gTimer);
        }
        if (gPlaying && (anim.getPosition() < anim.getLength())) {
            gTimer = window.setTimeout(animate, 500);
            updateState();
            anim.inc();
        } else {
            gPlaying = false;
            updateState();
        }
    }

    function updateState(){
        if (gInitialized) {
            msc_render.clean("__animsvg", window);
            msc_render.renderAST(anim.getCurrentFrame(), "", "__animsvg", window);
            window.__anim_progress_percentage.setAttribute("style",
                                "width: " + anim.getPercentage() + "%");
        }
        if (gPlaying){
            window.__btn_anim_playpause.className = ICON_PAUSE;
        } else {
            window.__btn_anim_playpause.className = ICON_PLAY;
        }
    }

    function home(){
        anim.home();
        gPlaying = false;
        updateState();
    }
    function dec(){
        anim.dec();
        gPlaying = false;
        updateState();
    }
    function playpause(){
        gPlaying = !gPlaying;
        if (gPlaying) {
            animate();
        }
    }
    function inc(){
        anim.inc();
        gPlaying = false;
        updateState();
    }
    function end(){
        anim.end();
        gPlaying = false;
        updateState();
    }
    function close() {
        dq.SS(window.__animscreen).hide();
        gPlaying = false;
        anim.home();
        updateState();
        gInitialized = false;
        gaga.g('send', 'event', 'close_animscreen', 'button');
    }

    function percentageClick(pEvent) {
        var lRect = window.__anim_progress_percentage_wrapper.getBoundingClientRect();
        var lClickedPosition = (pEvent.clientX - lRect.left);
        var lMaxPosition = lRect.width;

        var lSelectedPosition = lClickedPosition/ lMaxPosition;
        anim.setPosition(Math.ceil(lSelectedPosition * anim.getLength()));
        updateState();
    }

    function _setupEvents() {
        window.__btn_anim_home.addEventListener("click",
            function() {
                home();
                gaga.g('send', 'event', 'anim_home', 'button');
            },
            false
        );
        window.__btn_anim_dec.addEventListener("click",
            function() {
                dec();
                gaga.g('send', 'event', 'anim_dec', 'button');
            },
            false
        );
        window.__btn_anim_playpause.addEventListener("click",
            function() {
                playpause();
                gaga.g('send', 'event', 'anim_playpause', 'button');
            },
            false
        );
        window.__btn_anim_inc.addEventListener("click",
            function() {
                inc();
                gaga.g('send', 'event', 'anim_inc', 'button');
            },
            false
        );
        window.__btn_anim_end.addEventListener("click",
            function() {
                end();
                gaga.g('send', 'event', 'anim_end', 'button');
            },
            false
        );
        window.__btn_anim_close.addEventListener("click",
            function() {
                close();
            },
            false
        );
        window.__anim_progress_percentage_wrapper.addEventListener("click",
             function(pEvent) {
                 percentageClick(pEvent);
             },
             false
        );
    }

    return {
        initialize : initialize,
        close      : close
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
