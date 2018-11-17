/* eslint-env node */

var gDebug = false;

function toOptions(pPrev, pSample) {
    return pPrev + '<option value="' + pSample.value + '">' + pSample.label + "</option>";
}

function toOptionGroups(pPrev, pSampleGroup){
    return pPrev + '<optgroup label="' + pSampleGroup.label + '">' +
        pSampleGroup
            .values
            .filter(function(value) { return (!value.debug || gDebug); })
            .reduce(toOptions, "") +
    '</optgroup>';
}

module.exports = {
    toOptionList: function (pSampleGroups, pDebug) {
        gDebug = !!pDebug;
        return pSampleGroups.reduce(toOptionGroups, "");
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
