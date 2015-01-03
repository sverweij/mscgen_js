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

define(["../../utl/utensils"], function(utl) {

    var EMPTY_ARC     = [{kind:"|||"}];

    function FrameFactory(pAST, pPreCalculate){
        this.gAST          = {};
        this.gArcs         = {};
        this.gLength       = 0;
        this.gNoRows       = 0;
        this.gPosition     = 0;
        this.gFrames       = [];
        this.gPreCalculate = false; 
        if (pAST) {
            if (pAST && undefined !== pPreCalculate){
                this.init(pAST, pPreCalculate);
            } else {
                this.init(pAST);
            }
        }
    }

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
    FrameFactory.prototype.init = function (pAST, pPreCalculate){
        this.gPreCalculate = pPreCalculate ? true === pPreCalculate : false;
        this.gAST      = utl.deepCopy(pAST);
        this.gLength   = this._calculateLength();
        this.gNoRows   = this._calculateNoRows();
        this.gPosition = 0;
        if (this.gAST.arcs) {
            this.gArcs     = utl.deepCopy(this.gAST.arcs);
            this.gAST.arcs = [];
        }
        this.gFrames = [];
        if (this.gPreCalculate) {
            for (var i = 0; i < this.gLength; i++){
                this.gFrames.push (utl.deepCopy(this._calculateFrame(i)));
            }
        }
    };

    /*
     * Go to the first frame
     */
    FrameFactory.prototype.home = function (){
        this.gPosition = 0;
    };

    /*
     * Skips pFrames ahead. When pFrames not provided, skips 1 ahead
     *
     * won't go beyond the last frame
     */
    FrameFactory.prototype.inc = function (pFrames) {
        pFrames = pFrames ? pFrames : 1;
        this.gPosition = Math.min(this.gLength, this.gPosition + pFrames);
    };

    /*
     * Skips pFrames back. When pFrames not provided, skips 1 back
     *
     * won't go before the first frame
     */
    FrameFactory.prototype.dec = function (pFrames) {
        pFrames = pFrames ? pFrames : 1;
        this.gPosition = Math.max(0, this.gPosition - pFrames);
    };

    /*
     * Go to the last frame
     */
    FrameFactory.prototype.end = function()  {
        this.gPosition = this.gLength;
    };

    /*
     * returns the current frame
     */
    FrameFactory.prototype.getCurrentFrame = function () {
        return this.getFrame(this.gPosition);
    };

    /* 
     * returns frame pFrameNo
     * if pFrameNo >= getLength() - returns the last frame (=== original AST)
     * if pFrameNo <= 0 - returns the first frame (=== original AST - arcs)
     */
    FrameFactory.prototype.getFrame = function (pFrameNo){
        pFrameNo = Math.max(0, Math.min(pFrameNo, this.gLength - 1));
        if (this.gPreCalculate) {
            return this.gFrames[pFrameNo];
        } else {
            return this._calculateFrame(pFrameNo);
        }
    };

    /*
     * returns the position of the current frame (number)
     */
    FrameFactory.prototype.getPosition = function () {
        return this.gPosition;
    };

    /*
     * returns the number of "frames" in this AST
     * */
    FrameFactory.prototype.getLength = function (){
        return this.gLength;
    };

    /*
     * returns the ratio position/ length in percents.
     * 0 <= result <= 100, even when position actually exceeds
     * length or is below 0
     */
    FrameFactory.prototype.getPercentage = function () {
        return (this.gLength > 0) && (this.gPosition > 0) ? 100*(Math.min(1, this.gPosition/this.gLength)) : 0;
    };

    /*
     * Returns the AST the subset frame pFrameNo should constitute
     */
    FrameFactory.prototype._calculateFrame = function (pFrameNo){
        var lFrameNo = Math.min(pFrameNo, this.gLength - 1);
        var lFrameCount = 0;
        var lRowNo = 0;

        if (this.gLength - 1 > 0){
            this.gAST.arcs = [];
        }
        
        while (lFrameCount < lFrameNo) {
            this.gAST.arcs[lRowNo]=[];
            for(var j = 0; (j < this.gArcs[lRowNo].length) && (lFrameCount++ < lFrameNo); j++){ 
                this.gAST.arcs[lRowNo].push(this.gArcs[lRowNo][j]);
            }
            lRowNo++;
        }

        for (var k=lRowNo; k < this.gNoRows; k++){
            this.gAST.arcs[k] = EMPTY_ARC;
        }
        return this.gAST;
    };


    /*
     * calculates the number of "frames" in the current AST
     * --> does not yet cater for recursive structures
     */
    FrameFactory.prototype._calculateLength = function () {
        var lRetval = 1;
        if (this.gAST.arcs) {
            lRetval += this.gAST.arcs.reduce(function(pThing, pCurrent){
                return pThing + pCurrent.length;
            },0);
        } 
        return lRetval; 
    };

    /*
     * returns the number of rows in the current AST
     */
    FrameFactory.prototype._calculateNoRows = function () {
        return this.gAST.arcs? this.gAST.arcs.length : 0;
    };

    return {
        FrameFactory: FrameFactory
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
