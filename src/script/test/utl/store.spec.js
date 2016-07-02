/* global localStorage, global */
/* eslint no-new-require:0, new-cap:0 */

var store = require("../../utl/store");
var assert = require("assert");

describe('ui/utl/store', function() {
    var lLanguage       = "initial language";
    var lSource         = "initial source";
    var lAutoRender     = false;
    var lDebug          = false;
    var lMirrorEntities = false;
    var lNamedStyle     = null;

    var lState = {
        getLanguage      : function() { return "other language"; },
        setLanguage      : function(pLanguage){ lLanguage = pLanguage; },
        getSource        : function() { return "other source"; },
        setSource        : function(pSource){ lSource = pSource; },
        getAutoRender    : function() { return true; },
        setAutoRender    : function(pAutoRender){ lAutoRender = pAutoRender; },
        getDebug         : function() { return true; },
        setDebug         : function(pDebug){ lDebug = pDebug; },
        getMirrorEntities: function() { return lMirrorEntities; },
        setMirrorEntities: function(pMirrorEntities) { lMirrorEntities = pMirrorEntities; },
        getStyle         : function() { return lNamedStyle; },
        setStyle         : function(pNamedStyle) { lNamedStyle = pNamedStyle; }
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

        beforeEach(function() {
            lLanguage       = "initial language";
            lSource         = "initial source";
            lAutoRender     = false;
            lDebug          = false;
            lMirrorEntities = false;
            lNamedStyle     = null;
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

        it("doesn't save/ overwrite source when saving settings only", function(){
            store.saveSettings(lState);
            store.load(lState);
            assert.equal(lLanguage, "initial language");
            assert.equal(lSource, "initial source");
            assert.equal(lAutoRender, true);
            assert.equal(lDebug, true);
        });

        it("doesn't save/ overwrite source when saving & loading settings only", function(){
            store.saveSettings(lState);
            store.loadSettings(lState);
            assert.equal(lLanguage, "initial language");
            assert.equal(lSource, "initial source");
            assert.equal(lAutoRender, true);
            assert.equal(lDebug, true);
        });

    });
});
