/* jshint phantom:true, strict: false */
/* globals renderInThePage */
var system = require('system');

var gPage       = system.args[1];
var gASTString  = system.args[2];
var gOutputType = system.args[3];
var gOutputTo   = system.args[4];

var gOutputType2Format = {
    png: {format: "png"},
    jpeg: {format: "jpeg", quality: 95}
};

var page = require('webpage').create();

page.onCallback = function(pBBox){
    page.viewportSize = { width: pBBox.width, height: pBBox.height };
    page.render(gOutputTo, gOutputType2Format[gOutputType]);
    phantom.exit();
};

page.open(gPage, function(/*pStatus*/) {
    page.evaluate(
        function(pASTString){
            renderInThePage(pASTString);
        },
        gASTString
    );
});
