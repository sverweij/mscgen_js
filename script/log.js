define(function (){
    function LOG (pString, pLevel){
        if (console) {
            if (!pLevel) { pLevel = "generic"; }
            switch (pLevel){
                case "debug": 
                    console.debug(pString); // debug deprecated; should use log. However firefox doesn't sort it out to the correct category yet
                    break;
                case "info": 
                    console.info(pString);
                    break;
                case "warn": 
                    console.warn(pString);
                    break;
                case "error":
                    console.error(pString);
                    break;
                default:
                    console.log(pString);
                    break;
            }
        }
    }
    return {
        DEBUG: function (pString){
            LOG(pString, "debug");
        },
        INFO: function (pString){
            LOG(pString, "info");
        },
        WARN: function (pString){
            LOG(pString, "warn");
        },
        ERROR: function (pString){
            LOG(pString, "error");
        }
    };
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
