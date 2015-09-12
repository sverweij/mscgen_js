var conf = require("../ui-control/embedding/config");
var utl = require("./testutensils");

describe('embed-config', function() {
    describe('#getConfig - merges with the global mscgen_js_config', function() {

        it('should return the default configuration when no global mscgen_js_config is present', function() {
            utl.assertequalJSON(conf.getConfig(),
            {
                defaultLanguage : "mscgen",
                parentElementPrefix : "mscgen_js-parent_",
                clickable : false,
                clickURL : "https://sverweij.github.io/mscgen_js/",
            });
        });
        
        it('should return a changed configuration when a mscgen_js_config is present', function(){
            global.mscgen_js_config = {
                clickable: true,
                clickURL: "http://localhost/"
            };
            utl.assertequalJSON(conf.getConfig(),
            {
                defaultLanguage : "mscgen",
                parentElementPrefix : "mscgen_js-parent_",
                clickable : true,
                clickURL : "http://localhost/",
            });
        });
    });
});
