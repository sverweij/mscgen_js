/* jshint browser:true */
/* global define */
define([], function(){
    "use strict";

    return {
        SS: function SS(pId) {
            return {
                show: function(pDisplayStyle){
                          pId.removeAttribute("style");
                          if (pDisplayStyle){
                              pId.style.display = pDisplayStyle;
                          }
                      },
                hide: function(){
                          pId.style.display = "none";
                      },
                toggle: function(){
                    if(pId.style.display === "none") {
                        pId.removeAttribute("style");
                    } else {
                        pId.style.display = "none";
                    }
                }
            };
        },
        attachEventHandler: function (pQuerySelector, pEvent, pFunction) {
            var lNodes = document.querySelectorAll(pQuerySelector);
            for (var i = 0; i < lNodes.length; i++){
                lNodes[i].addEventListener(pEvent, pFunction, false);
            }
        },
        doForAllOfClass: function (pClass, pFunction) {
            var lNodes = document.getElementsByClassName(pClass);
            for (var i = 0; i < lNodes.length; i++){
                pFunction(lNodes[i]);
            }
        },
        ajax : function (pURL, pSuccessFunction, pErrorFunction) {
            var lHttpRequest = new XMLHttpRequest();
            lHttpRequest.onreadystatechange = function (pEvent) {
                if(pEvent.target.readyState === XMLHttpRequest.DONE) {
                    if (200 === lHttpRequest.status) {
                        pSuccessFunction(pEvent);
                    } else {
                        pErrorFunction(pEvent);
                    }
                }
            };
            lHttpRequest.open('GET', pURL);
            lHttpRequest.responseType = "text";
            try {
                lHttpRequest.send();
            } catch (e) {
                pErrorFunction();
            }
        }
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
