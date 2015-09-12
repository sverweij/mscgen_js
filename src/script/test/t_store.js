/* global localStorage */
var store = require("../ui/utl/store");
var assert = require("assert");

describe('store', function() {
    var lLanguage = "initial language";
    var lSource = "initial source";
    var lAutoRender = false;
    var lDebug = false;
    
    var lState = {
        getLanguage: function(){return "other language";},
        setLanguage: function(pLanguage){lLanguage = pLanguage;},
        getSource: function(){return "other source";},
        setSource: function(pSource){lSource = pSource;},
        getAutoRender: function(){return true;},
        setAutoRender: function(pAutoRender){lAutoRender = pAutoRender;},
        getDebug: function(){return true;},
        setDebug: function(pDebug){lDebug = pDebug;}
    };

    describe('#load and save with no localStorage available', function() {
        it('silently fail on load', function(){
            store.load(lState);
            assert.equal(lLanguage, "initial language");
            assert.equal(lSource, "initial source");
            assert.equal(lAutoRender, false);
            assert.equal(lDebug, false);
        });
        
        it('silently fail on save', function(){
            store.save(lState);
            store.load(lState);
            assert.equal(lLanguage, "initial language");
            assert.equal(lSource, "initial source");
            assert.equal(lAutoRender, false);
            assert.equal(lDebug, false);
        });
    });
    
    describe('#load and save', function() {        
        before(function(){
            global.localStorage = new require('node-localstorage').LocalStorage('./throwmeaway');
            localStorage.clear();
        });
        
        after(function(){
            localStorage._deleteLocation();
        });
        
        it('leaves the state as is when localStorage has no item', function() {
            store.load(lState);
            assert.equal(lLanguage, "initial language");
            assert.equal(lSource, "initial source");
            assert.equal(lAutoRender, false);
            assert.equal(lDebug, false);
        });
        
        it('saves the passed state', function(){
            store.save(lState);
            store.load(lState);
            assert.equal(lLanguage, "other language");
            assert.equal(lSource, "other source");
            assert.equal(lAutoRender, true);
            assert.equal(lDebug, true);
        });
        
    });
});
