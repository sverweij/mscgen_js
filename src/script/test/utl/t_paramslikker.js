/* jshint nonstandard: true */
var par    = require("../../utl/paramslikker");
var expect = require("chai").expect;

describe('paramslikker', function() {
    describe('#getParams - empty', function() {
        it('should return an empty object when no string passed', function() {
            expect(par.getParams()).to.deep.equal({});
        });
        it('should return an empty object when empty string passed', function() {
            expect(par.getParams("")).to.deep.equal({});
        });
        it('should return an empty object when only ? passed', function() {
            expect(par.getParams("?")).to.deep.equal({});
        });
        it('should return an empty object when no name value pairs passed', function() {
            expect(par.getParams("?debug")).to.deep.equal({});
        });
        it('should return an empty object when no name value pairs passed', function() {
            expect(par.getParams("?debug&donottrack")).to.deep.equal({});
        });
        it('should return an empty object - invalidly passed stuff', function() {
            expect(par.getParams('?msc=msc{a,b,c; a->b; c->b; b >> * [label="answer"]}')).to.deep.equal({});
        });
    });

    describe('#getParams - happy days', function() {
        it('should return an empty object when no name value pairs passed', function() {
            expect(par.getParams("?debug=")).to.deep.equal({
                debug : ""
            });
        });
        it('should return an object with one property', function() {
            expect(par.getParams("?debug=yep")).to.deep.equal({
                debug : "yep"
            });
        });
        it('should return an object with two properties', function() {
            expect(par.getParams("?debug=yep&donottrack=yes")).to.deep.equal({
                debug : "yep",
                donottrack : "yes"
            });
        });
        it('should return an object with a property that has a value with spaces', function() {
            expect(par.getParams("?withspaces=with spaces")).to.deep.equal({
                withspaces : "with spaces"
            });
        });
        it('should return an object with an msc program', function() {
            expect(par.getParams('?msc=' + escape('msc{a,b,c; a->b; c->b; b >> * [label="answer"]}'))).to.deep.equal({
                msc : 'msc{a,b,c; a->b; c->b; b >> * [label="answer"]}'
            });
        });

    });
});
