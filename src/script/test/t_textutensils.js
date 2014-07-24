var assert = require("assert");
var txt = require("../render/text/textutensils");

describe('textutensils', function() {
    describe('#wrap(x, 10) - string with spaces', function() {
        var lWrapThis = "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
        var lWrapAry = txt.wrap(lWrapThis, 10);

        it('should break up in 8 pieces', function() {
            assert.equal(lWrapAry.length, 8);
        });
        it('should have "Aap noot" in the first line', function() {
            assert.equal(lWrapAry[0], "Aap noot");
        });
        it('should have "schapen." as the last line', function() {
            assert.equal(lWrapAry[lWrapAry.length - 1], "schapen.");
        });
    });

    describe('#wrap(x, 10) - string without spaces', function() {
        var lWrapSpaceless = "Aap_noot_mies_wim_zus_jet_teun_vuur_gijs_lam_kees_bok_weide_does_hok_duif_schapen.";
        var lWrapSpacelessAry = txt.wrap(lWrapSpaceless, 10);

        it('should break up in 9 pieces', function() {
            assert.equal(lWrapSpacelessAry.length, 9);
        });
        it('should have "Aap_noot_m" in the first line', function() {
            assert.equal(lWrapSpacelessAry[0], "Aap_noot_m");
        });
        it('should have "schapen." as the last line', function() {
            assert.equal(lWrapSpacelessAry[lWrapSpacelessAry.length - 1], "n.");
        });

    });

    describe('#wrap(x, 10) - empty string', function() {
        var lEmptyString = "";
        var lEmptyStringAry = txt.wrap(lEmptyString, 10);

        it('should break up in 1 piece', function() {
            assert.equal(lEmptyStringAry.length, 1);
        });
        it('should have the empty string in it\'s only component', function() {
            assert.equal(lEmptyStringAry[0], "");
        });
    });

    describe('#wrap(x, 100) - string with spaces', function() {
        var lWrapThis = "Aap noot mies wim zus jet teun vuur gijs lam kees bok weide does hok duif schapen.";
        var lWrapAry = txt.wrap(lWrapThis, 100);

        it('should break up in 1 piece', function() {
            assert.equal(lWrapAry.length, 1);
        });
        it('should have the complete lWrapThis in the first line', function() {
            assert.equal(lWrapAry[0], lWrapThis);
        });
    });

    describe('#classifyExtension() - ', function() {

        it('empty string should classify as mscgen ', function() {
            assert.equal(txt.classifyExtension(''), "mscgen");
        });

        it('should classify as mscgen ', function() {
            assert.equal(txt.classifyExtension('raggerderag.msc'), "mscgen");
        });

        it('should classify as msgenny ', function() {
            assert.equal(txt.classifyExtension('daaris/;d"orgelm.msgenny'), "msgenny");
        });

        it('string ending with . should classify as mscgen', function() {
            assert.equal(txt.classifyExtension('aap.noot/mies.'), "mscgen");
        });

        it('should classify as ast/json ', function() {
            assert.equal(txt.classifyExtension('test01_all_arcs.json'), "json");
        });
    });

    describe('#formatNumber() - ', function() {
        it('puts two spaces in front of a single digit on max width 3', function() {
            assert.equal(txt.formatNumber(7, 3), "  7");
        });
        it('puts no spaces in front of a single digit on max width 1', function() {
            assert.equal(txt.formatNumber(7, 1), "7");
        });
        it('puts no spaces in front of a single digit on max width 0', function() {
            assert.equal(txt.formatNumber(7, 0), "7");
        });
        it('puts no spaces in front of a single digit on max width < 0', function() {
            assert.equal(txt.formatNumber(7, -8), "7");
        });
        it('puts no spaces in front of a three digit number on max width 3', function() {
            assert.equal(txt.formatNumber(481, 3), "481");
        });
    });

});

