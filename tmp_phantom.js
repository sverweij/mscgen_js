/* jshint multistr: true */
/* jshint devel: true */
/* jshint node: true */
var page = require('webpage').create();
var system = require('system');


page
    .open('src/embed.html', function(pStatus){
        "use strict";
        try{
            if (pStatus === "success"){

                var gInput = system.stdin.read();
                console.log(gInput);

                page.viewportSize = { width: 1280, height: 1024 };

                var lRenderResult = page.evaluate(function(){
                    return document.getElementById("yourownidsgetpreserved");
                });
                if (lRenderResult){
                    console.log (lRenderResult.innerHTML);
                    page.render('png_from_phantom.png');
                    phantom.exit(0);
                } else {
                    console.error ("page doesn't contain an element by that id");
                    phantom.exit(1);
                }
            } else {
                console.error ("page doesn't exist");
                phantom.exit(1);
            }
        } catch(e){
            console.error(e);
            phantom.exit(1);
        }
    });
