var jsdom = require('jsdom');
var renderast = require('./renderast');

var lSampleAST = {
  "entities": []
};
jsdom.env("<html><body></body></html>", function(err, window) {
    // renderast.clean("snok", window);

    renderast.renderAST(lSampleAST, JSON.stringify(lSampleAST, null, " "), "__svg", window);
    console.log(window.document.body.innerHTML);
});
