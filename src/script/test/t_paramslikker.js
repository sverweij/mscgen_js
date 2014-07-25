var assert = require("assert");
var par = require("../utl/paramslikker");
var utl = require("./testutensils");

describe('textutensils', function() {
    describe('#getParams - empty', function() {
        it('should return an empty object when no string passed', function() {
            utl.assertequalJSON({}, par.getParams());
        });
        it('should return an empty object when empty string passed', function() {
            utl.assertequalJSON({}, par.getParams(""));
        });
        it('should return an empty object when only ? passed', function() {
            utl.assertequalJSON({}, par.getParams("?"));
        });
        it('should return an empty object when no name value pairs passed', function() {
            utl.assertequalJSON({}, par.getParams("?debug"));
        });
        it('should return an empty object when no name value pairs passed', function() {
            utl.assertequalJSON({}, par.getParams("?debug&donottrack"));
        });
        it('should return an empty object - invalidly passed stuff', function() {
            utl.assertequalJSON({}, par.getParams('?msc=msc{a,b,c; a->b; c->b; b >> * [label="answer"]}'));
        });
    });

    describe('#getParams - happy days', function() {
        it('should return an empty object when no name value pairs passed', function() {
            utl.assertequalJSON({
                debug : ""
            }, par.getParams("?debug="));
        });
        it('should return an object with one property', function() {
            utl.assertequalJSON({
                debug : "yep"
            }, par.getParams("?debug=yep"));
        });
        it('should return an object with two properties', function() {
            utl.assertequalJSON({
                debug : "yep",
                donottrack : "yes"
            }, par.getParams("?debug=yep&donottrack=yes"));
        });
        it('should return an object with a property that has a value with spaces', function() {
            utl.assertequalJSON({
                withspaces : "with spaces",
            }, par.getParams("?withspaces=with spaces"));
        });
        it('should return an object with an msc program', function() {
            utl.assertequalJSON({
                msc : 'msc{a,b,c; a->b; c->b; b >> * [label="answer"]}'
            }, par.getParams('?msc=' + escape('msc{a,b,c; a->b; c->b; b >> * [label="answer"]}')));
        });

    });
});

