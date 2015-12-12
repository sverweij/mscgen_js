/* jshint phantom:true, strict: false */
/* globals renderVectorInThePage */
var system = require('system');
var fs     = require('fs');

var gPage       = system.args[1];
var gASTString  = system.args[2];
// var gOutputType = system.args[3];
var gOutputTo   = system.args[4];
// var gInputFrom  = system.args[5];

var page = require('webpage').create();

page.onCallback = function(pSVG){
    fs.write(gOutputTo, pSVG, 'w');
    phantom.exit();
};

page.open(gPage, function(/*pStatus*/) {
    page.evaluate(
        function(pASTString){
            renderVectorInThePage(pASTString);
        },
        gASTString
    );
});
