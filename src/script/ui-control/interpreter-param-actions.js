/* jshint browser:true */
/* global define */
define(["./interpreter-uistate",
        "../utl/paramslikker",
        "../utl/domquery",
        "../utl/gaga"
        ],
        function(
            uistate,
            params,
            dq,
            gaga) {
    "use strict";

    function setupGA (pDoNotTrack){
        gaga.gaSetup("false" === pDoNotTrack || undefined === pDoNotTrack );
        gaga.g('create', 'UA-42701906-1', 'sverweij.github.io');
        gaga.g('send', 'pageview');
    }

    function processParams(){
        var lParams = params.getParams (window.location.search);
        setupGA(lParams.donottrack);
        
        uistate.setDebug(false);
        if ("true" === lParams.debug) {
            dq.doForAllOfClass("debug", function(pDomNode){
                dq.SS(pDomNode).show();
            });
            uistate.setDebug(true);
            gaga.g('send', 'event', 'debug', 'true');
        }

        if (lParams.msc) {
            uistate.setSource(lParams.msc);
            gaga.g('send', 'event', 'params.msc');
        } else {
            uistate.setSample();
        }
        if (lParams.lang){
            uistate.setLanguage(lParams.lang);
            gaga.g('send', 'event', 'params.lang', lParams.lang);
        }
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

    return {
        processParams: processParams,
        tagAllLinks: tagAllLinks
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
