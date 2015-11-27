/* global define */
/* jshint browser:true */
define(["./animator", "../utl/domutl"],
        function(animctrl, dq) {
    "use strict";

    var ESC_KEY   = 27;
    // function _closeAboutPanel(){
    //     window.__aboutsheet.style.height = '0';
    // }

    function _hideAllPanels(){
        dq.SS(window.__cheatsheet).hide();
        dq.SS(window.__embedsheet).hide();
        // dq.SS(window.__aboutsheet).hide();
        animctrl.close();
        window.__color_panel.style.height = '0';
        window.__output_panel.style.height = '0';
        window.__aboutsheet.style.height = '0';
        // window.__cheatsheet.style.height = '0';
    }

    function _togglePanel(pPanelElement, pOpenFn, pCloseFn){
        var lHeight = pPanelElement.style.height.toString();
        if ( lHeight === '0px' || lHeight === ""){
            _hideAllPanels();
            pPanelElement.style.height = '250px';
            pOpenFn();
        } else {
            _hideAllPanels();
            pCloseFn();
        }
    }

    return {
        hideAllPanels: _hideAllPanels,
        togglePanel: _togglePanel,
        keyDown: function (e) {
            if(ESC_KEY === e.keyCode) {
                _hideAllPanels();
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
