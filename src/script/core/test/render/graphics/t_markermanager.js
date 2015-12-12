var mark   = require("../../../render/graphics/markermanager");
var fs     = require("fs");
var path   = require("path");
var expect = require("chai").expect;

var gMarkerDefs =
    [
      {
          "name": "481callback-#00FF00",
          "path": "M 1,1 l 8,2 l-8,2",
          "color": "#00FF00",
          "type": "callback"
      },
      {
          "name": "481callback-l-#00FF00",
          "path": "M17,1 l-8,2 l 8,2",
          "color": "#00FF00",
          "type": "callback"
      },
      {
          "name": "481callback-black",
          "path": "M 1,1 l 8,2 l-8,2",
          "color": "black",
          "type": "callback"
      },
      {
          "name": "481callback-l-black",
          "path": "M17,1 l-8,2 l 8,2",
          "color": "black",
          "type": "callback"
      },
      {
          "name": "481callback-blue",
          "path": "M 1,1 l 8,2 l-8,2",
          "color": "blue",
          "type": "callback"
      },
      {
          "name": "481callback-l-blue",
          "path": "M17,1 l-8,2 l 8,2",
          "color": "blue",
          "type": "callback"
      },
      {
          "name": "481callback-fuchsia",
          "path": "M 1,1 l 8,2 l-8,2",
          "color": "fuchsia",
          "type": "callback"
      },
      {
          "name": "481callback-l-fuchsia",
          "path": "M17,1 l-8,2 l 8,2",
          "color": "fuchsia",
          "type": "callback"
      },
      {
          "name": "481signal-black",
          "path": "M9,3 l-8, 2",
          "color": "black",
          "type": "signal"
      },
      {
          "name": "481signal-u-black",
          "path": "M9,3 l-8,-2",
          "color": "black",
          "type": "signal"
      },
      {
          "name": "481signal-l-black",
          "path": "M9,3 l 8, 2",
          "color": "black",
          "type": "signal"
      },
      {
          "name": "481signal-lu-black",
          "path": "M9,3 l 8,-2",
          "color": "black",
          "type": "signal"
      }
    ];

describe('render/graphics/markermanager', function() {
    describe('#getMarkerDefs - paths not hit in end2end, but that are still important', function() {

        it('should return the colors in arcs in inline expressions', function() {
            var lTextFromFile = fs.readFileSync(path.join(__dirname, '../../fixtures/simpleXuSample.json'), {"encoding":"utf8"});
            var lAST = JSON.parse(lTextFromFile.toString());
            expect(mark.getMarkerDefs("481", lAST)).to.deep.equal(gMarkerDefs);
        });

    });
});
