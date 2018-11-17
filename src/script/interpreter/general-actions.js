var animator = require("./animator");
var ESC_KEY  = 27;

function _hideAllPanels(){
    animator.close();
    window.__color_panel.style.width          = '0';
    window.__output_panel.style.width         = '0';
    window.__aboutsheet.style.width           = '0';
    window.__embed_panel.style.width          = '0';
    window.__learn_panel.style.width          = '0';
    window.__render_options_panel.style.width = '0';
    window.__save_as_panel.style.width        = '0';
}

function _togglePanel(pPanelElement, pOpenFn, pCloseFn){
    var lHeight = pPanelElement.style.width.toString();
    if (lHeight === '0px' || lHeight === ""){
        _hideAllPanels();
        pPanelElement.style.width = '340px';
        pOpenFn();
    } else {
        _hideAllPanels();
        pCloseFn();
    }
}

module.exports = {
    hideAllPanels: _hideAllPanels,
    togglePanel: _togglePanel,
    keyDown: function (e) {
        if (ESC_KEY === e.keyCode) {
            _hideAllPanels();
        }
    }
};
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
