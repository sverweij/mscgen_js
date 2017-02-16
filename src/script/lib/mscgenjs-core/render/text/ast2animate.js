/*
 * methods to chop a given abstract syntax tree into "frames"
 * - ASTS that are a strict subset of the given AST. These
 * frames can be used to render an animation of the sequence
 * chart it represents.
 *
 * Assumes the AST to be valid (see https://github.com/sverweij/mscgen_js/tree/master/src/script)
 *
 */

/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var _ = require("../../lib/lodash/lodash.custom");

    var EMPTY_ARC     = [{kind:"|||"}];

    function FrameFactory(pAST, pPreCalculate){
        this.AST          = {};
        this.arcs         = {};
        this.len          = 0;
        this.noRows       = 0;
        this.position     = 0;
        this.frames       = [];
        this.preCalculate = false;
        if (pAST) {
            if (pAST && typeof pPreCalculate !== 'undefined'){
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
        this.preCalculate = pPreCalculate ? true === pPreCalculate : false;
        this.AST          = _.cloneDeep(pAST);
        this.len          = _calculateLength(pAST);
        this.noRows       = _calcNumberOfRows(pAST);
        this.position     = 0;
        if (this.AST.arcs) {
            this.arcs     = _.cloneDeep(this.AST.arcs);
            this.AST.arcs = [];
        }
        this.frames = [];
        if (this.preCalculate) {
            for (var i = 0; i < this.len; i++){
                this.frames.push(_.cloneDeep(this._calculateFrame(i)));
            }
        }
    };

    /*
     * Set position to the provided frame number
     * If pFrameNumber > last frame, sets position to last frame
     * If pFrameNumber < first frame, sets position to first frame
     */
    FrameFactory.prototype.setPosition = function(pPosition){
        this.position = Math.min(this.len, Math.max(0, pPosition));
    };

    /*
     * Go to the first frame
     */
    FrameFactory.prototype.home = function (){
        this.position = 0;
    };

    /*
     * Skips pFrames ahead. When pFrames not provided, skips 1 ahead
     *
     * won't go beyond the last frame
     */
    FrameFactory.prototype.inc = function (pFrames) {
        pFrames = pFrames ? pFrames : 1;
        this.setPosition(this.position + pFrames);
    };

    /*
     * Skips pFrames back. When pFrames not provided, skips 1 back
     *
     * won't go before the first frame
     */
    FrameFactory.prototype.dec = function (pFrames) {
        pFrames = pFrames ? pFrames : 1;
        this.setPosition(this.position - pFrames);
    };

    /*
     * Go to the last frame
     */
    FrameFactory.prototype.end = function()  {
        this.position = this.len;
    };

    /*
     * returns the current frame
     */
    FrameFactory.prototype.getCurrentFrame = function () {
        return this.getFrame(this.position);
    };

    /*
     * returns frame pFrameNo
     * if pFrameNo >= getLength() - returns the last frame (=== original AST)
     * if pFrameNo <= 0 - returns the first frame (=== original AST - arcs)
     */
    FrameFactory.prototype.getFrame = function (pFrameNo){
        pFrameNo = Math.max(0, Math.min(pFrameNo, this.len - 1));
        if (this.preCalculate) {
            return this.frames[pFrameNo];
        } else {
            return this._calculateFrame(pFrameNo);
        }
    };

    /*
     * returns the position of the current frame (number)
     */
    FrameFactory.prototype.getPosition = function () {
        return this.position;
    };

    /*
     * returns the number of "frames" in this AST
     * */
    FrameFactory.prototype.getLength = function (){
        return this.len;
    };

    /*
     * returns the ratio position/ length in percents.
     * 0 <= result <= 100, even when position actually exceeds
     * length or is below 0
     */
    FrameFactory.prototype.getPercentage = function () {
        return (this.len > 0) && (this.position > 0) ? 100 * (Math.min(1, this.position / this.len)) : 0;
    };

    /*
     * Returns the AST the subset frame pFrameNo should constitute
     */
    FrameFactory.prototype._calculateFrame = function (pFrameNo){
        var lFrameNo = Math.min(pFrameNo, this.len - 1);
        var lFrameCount = 0;
        var lRowNo = 0;

        if (this.len - 1 > 0){
            this.AST.arcs = [];
        }

        while (lFrameCount < lFrameNo) {
            this.AST.arcs[lRowNo] = [];
            for (var j = 0; (j < this.arcs[lRowNo].length) && (lFrameCount++ < lFrameNo); j++){
                this.AST.arcs[lRowNo].push(this.arcs[lRowNo][j]);
            }
            lRowNo++;
        }

        for (var k = lRowNo; k < this.noRows; k++){
            this.AST.arcs[k] = EMPTY_ARC;
        }
        return this.AST;
    };


    /*
     * returns the number of rows for the current AST
     */
    FrameFactory.prototype.getNoRows = function () {
        return this.noRows;
    };

    /*
     * calculates the number of "frames" in the current AST
     * --> does not yet cater for recursive structures
     */
    function _calculateLength(pThing) {
        var lRetval = 1; /* separate frame for entities */
        if (pThing.arcs) {
            lRetval = pThing.arcs.reduce(function(pSum, pArcRow){
                /*
                 * inner itself counts for two arcs (one extra for
                 * drawing the bottom), but for one frame)
                 */
                return pSum + (Boolean(pArcRow[0].arcs) ? _calculateLength(pArcRow[0]) : pArcRow.length);
            }, lRetval);
        }
        return lRetval;
    }

    /*
     * returns the number of rows for a given AST (/ AST snippet)
     */
    function _calcNumberOfRows(pThing) {
        var lRetval = 0;
        if (pThing.arcs){
            lRetval = pThing.arcs.reduce(function(pSum, pArcRow){
                return pSum + (Boolean(pArcRow[0].arcs) ? _calcNumberOfRows(pArcRow[0]) + 2 : 1);
            }, lRetval);
        }
        return lRetval;
    }


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
