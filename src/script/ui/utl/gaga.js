/* jshint undef:true */
/* jshint unused:false */
/* jshint browser:true */
/* jshint nonstandard:true */
/* global define */
/* global ga */

define([],
/**
 * Wrapper for google analytics. Makes it more easy to implement "donottrack"
 *
 * @exports gaga
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
function() {
    "use strict";

    var gTrack = true;

    function _gaSetup(pTrack) {
        gTrack = pTrack;

        if (true === pTrack) {
            /* jshint -W030 *//* jshint -W033 *//* jshint -W069 */
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] ||
                function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
            /* jshint +W030 *//* jshint +W033 *//* jshint +W069 */
        }
    }

    function _g(pCommand, pEvent, pCategory, pAction, pLabel, pValue) {
        if (true === gTrack) {
            ga(pCommand, pEvent, pCategory, pAction, pLabel, pValue);
        }
    }

    return {
        /**
         * if pTrack === true, calls the google analytics setup code.
         * Does nothing otherwise
         *
         * @param {boolean} pTrack
         */
        gaSetup : function(pTrack) {
            return _gaSetup(pTrack);
        },
        /**
         * If analytics was setup using gaSetup, and tracking is on, sends
         * a ga event. Parameters same as the analytics ga function
         *
         *
         */
        g : function(pCommand, pEvent, pCategory, pAction, pLabel, pValue) {
            return _g(pCommand, pEvent, pCategory, pAction, pLabel, pValue);
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
