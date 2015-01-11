/* jshint browser:true */
/* global define */
define([], function(){
    "use strict";

    return {
        SS: function SS(pId) {
            return {
                show: function(){
                          pId.removeAttribute("style");
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
        ajax : function (pURL, pSuccessFunction) {
            var lHttpRequest = new XMLHttpRequest();
            lHttpRequest.onreadystatechange = function (pEvent) {
                if(pEvent.target.readyState === 4) {
                    pSuccessFunction(pEvent);
                }
            };
            lHttpRequest.open('GET', pURL);
            lHttpRequest.responseType = "text";
            lHttpRequest.send();
        },
        // webkit (at least in Safari Version 6.0.5 (8536.30.1) which is
        // distibuted with MacOSX 10.8.4) omits the xmlns: and xlink:
        // namespace prefixes in front of xlink and all hrefs respectively.
        // this function does a crude global replace to circumvent the
        // resulting problems. Problem happens for xhtml too
        webkitNamespaceBugWorkaround : function (pText){
            return pText.replace(/\ xlink=/g, " xmlns:xlink=", "g")
                        .replace(/\ href=/g, " xlink:href=", "g");
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
 MERCHANTABILITY or FITNEdq.SS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
