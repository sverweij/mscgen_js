/*
 * methods to chop a given abstract syntax tree into "frames"
 * - ASTS that are a strict subset of the given AST. These
 * frames can be used to render an animation of the sequence
 * chart it represents. 
 *
 * Assumes the AST to be valid (see https://github.com/sverweij/mscgen_js/tree/master/src/script)
 *
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {

    var gAST        = {};
    var gArcs       = {};
    var gLength     = 0;
    var gNoRows     = 0;
    var gPosition   = 0;
    var gFrames     = [];
    var EMPTY_ARC   = [{kind:"|||"}];
    var gPreCalculate = false; 

    /*
     * initializes the frame generator with an AST and
     * calculates the number of frames in it.
     *
     * @param pAST - abstract syntax tree to calculate
     * @param pPreCalculate - if true the module will pre-calculate all frames
     *                 in advance. In all other cases the module will
     *                 calculate each frame when it is called for (with
     *                 getFrame/ getCurrentFrame calls). Note that the
     *                 latter usually is fast enough(tm) even for real 
     *                 time rendering. It will probably save you some
     *                 cpu cycles when you're going traverse the frames
     *                 a lot, at the expense of memory usage.
     *
     *                 Paramater might get removed somewhere in the near
     *                 future.
     */
    function init(pAST, pPreCalculate){
        gPreCalculate = pPreCalculate ? true === pPreCalculate : false;
        gAST      = _deepCopy(pAST);
        gLength   = _calculateLength();
        gNoRows   = _calculateNoRows();
        gPosition = 0;
        if (gAST.arcs) {
            gArcs     = _deepCopy(gAST.arcs);
            gAST.arcs = [];
        }
        gFrames = [];
        if (gPreCalculate) {
            for (var i = 0; i < gLength; i++){
                gFrames.push (_deepCopy(_calculateFrame(i)));
            }
        }
    }

    function home() {
        gPosition = 0;
    }

    function inc(pFrames) {
        pFrames = pFrames ? pFrames : 1;
        gPosition += pFrames;
    }

    function dec(pFrames) {
        pFrames = pFrames ? pFrames : 1;
        gPosition -= pFrames;
    }

    function end() {
        gPosition = gLength;
    }

    function getPosition() {
        return gPosition;
    }

    /*
     * returns the current frame
     */
    function getCurrentFrame() {
        return getFrame(gPosition);
    }

    /* 
     * returns frame pFrameNo
     * if pFrameNo >= getLength() - returns the last frame (=== original AST)
     * if pFrameNo <= 0 - returns the first frame (=== original AST - arcs)
     */
    function getFrame(pFrameNo){
        pFrameNo = Math.max(0, Math.min(pFrameNo, gLength - 1));
        if (gPreCalculate) {
            return gFrames[pFrameNo];
        } else {
            return _calculateFrame(pFrameNo);
        }
    }

    function _calculateFrame(pFrameNo){
        var lFrameNo = Math.min(pFrameNo, gLength - 1);
        var lFrameCount = 0;
        var lRowNo = 0;

        if (gLength - 1 > 0){
            gAST.arcs = [];
        }
        
        while (lFrameCount < lFrameNo) {
            gAST.arcs[lRowNo]=[];
            for(var j = 0; (j < gArcs[lRowNo].length) && (lFrameCount++ < lFrameNo); j++){ 
                gAST.arcs[lRowNo].push(gArcs[lRowNo][j]);
            }
            lRowNo++;
        }

        for (var k=lRowNo; k < gNoRows; k++){
            gAST.arcs[k] = EMPTY_ARC;
        }
        return gAST;
    }

    /* returns the number of "frames" in this AST */
    function getLength(){
        return gLength;
    }

    /*
     * calculates the number of "frames" in the current AST
     */
    function _calculateLength() {
        var lRetval = 1;
        if (gAST.arcs) {
            lRetval += gAST.arcs.reduce(function(pThing, pCurrent){
                return pThing + pCurrent.length;
            },0);
        } 
        return lRetval; 
    }

    /*
     * returns the number of rows in the current AST
     */
    function _calculateNoRows() {
        return gAST.arcs? gAST.arcs.length : 0;
    }

    /*
     * returns a "deep copy" of an object.
     * (uses stringify, so it is limited to objects that
     * survive stringification roundtrips)
     *
     * utility function.  
     */
    function _deepCopy(pJSON) {
        return JSON.parse(JSON.stringify(pJSON));
    }

    return {
        init            : init,
        home            : home,
        inc             : inc,
        dec             : dec,
        end             : end,
        getCurrentFrame : getCurrentFrame,
        getFrame        : getFrame,
        getPosition     : getPosition,
        getLength       : getLength

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
