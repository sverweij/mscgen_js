var colorize = require("../../../render/text/colorize");
var fix      = require("../../astfixtures");
var _        = require("../../../lib/lodash/lodash.custom");
var expect   = require("chai").expect;

/*
var template = {
  "meta": {
    "extendedOptions": false,
    "extendedArcTypes": false,
    "extendedFeatures": false
  },
  "entities": [
    {
      "name": "a",
      "textbgcolor": "red",
      "textcolor": "green",
      "linecolor": "blue",
      "arctextcolor": "fuchsia",
      "arclinecolor": "cyan"
    }
  ]
};
*/

var textColoredEntity = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "textcolor": "green"
    }
  ]
};

var arcTextColoredEntity = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "arctextcolor": "green"
    }
  ]
};

var textColoredEntityWithArc = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "textcolor": "green"
    }
  ],
    "arcs": [
      [
      {
          "kind": "=>",
          "from": "a",
          "to": "a"
      }
    ]
  ]
};

var boxes = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "textcolor": "green"
    }
  ],
    "arcs": [
      [
      {
          "kind": "box",
          "from": "a",
          "to": "a"
      }
    ],
    [
      {
          "kind": "abox",
          "from": "a",
          "to": "a"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "a",
          "to": "a"
      }
    ],
    [
      {
          "kind": "note",
          "from": "a",
          "to": "a"
      }
    ]
  ]
};

var coloredBoxes = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "textcolor": "green"
    }
  ],
    "arcs": [
      [
      {
          "kind": "box",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "abox",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "note",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "#FFFFCC"
      }
    ]
  ]
};

var coloredBoxesForced = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "linecolor": "#008800",
        "textbgcolor": "#CCFFCC",
        "arclinecolor": "#008800"
    }
  ],
    "arcs": [
      [
      {
          "kind": "box",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "abox",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "note",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "#FFFFCC"
      }
    ]
  ]
};

var boxesWithNonColoredEntity = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a"
    }
  ],
    "arcs": [
      [
      {
          "kind": "box",
          "from": "a",
          "to": "a"
      }
    ],
    [
      {
          "kind": "abox",
          "from": "a",
          "to": "a"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "a",
          "to": "a"
      }
    ],
    [
      {
          "kind": "note",
          "from": "a",
          "to": "a"
      }
    ]
  ]
};


var coloredBoxesWithNonColoredEntity= {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "linecolor": "#008800",
        "textbgcolor": "#CCFFCC",
        "arclinecolor": "#008800"
    }
  ],
    "arcs": [
      [
      {
          "kind": "box",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "abox",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white"
      }
    ],
    [
      {
          "kind": "note",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "#FFFFCC"
      }
    ]
  ]
};

var alreadyColoredBoxes = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "a",
        "arclinecolor": "cyan"
    }
  ],
    "arcs": [
      [
      {
          "kind": "box",
          "from": "a",
          "to": "a",
          "linecolor": "red",
          "textbgcolor": "orange",
          "label": "remains orange"
      }
    ],
    [
      {
          "kind": "abox",
          "from": "a",
          "to": "a",
          "linecolor": "orange",
          "textbgcolor": "red",
          "textcolor": "white",
          "label": "remains red"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "a",
          "to": "a",
          "linecolor": "black",
          "textbgcolor": "white",
          "textcolor": "fuchsia",
          "label": "remains black and white"
      }
    ],
    [
      {
          "kind": "note",
          "from": "a",
          "to": "a",
          "linecolor": "blue",
          "textbgcolor": "cyan",
          "textcolor": "black",
          "label": "remains blue"
      }
    ]
  ]
};

var customScheme = {
    "entityColors": [
        {
            "linecolor" : "#FF0000",
            "textbgcolor" : "red",
            "textcolor": "white"
        }, {
            "linecolor" : "#AAAAAA",
            "textbgcolor" : "white",
        }, {
            "linecolor" : "#0000FF",
            "textbgcolor" : "blue",
            "textcolor": "#111111"
        }
    ],
    "arcColors" : {
        "note" : {
            "linecolor" : "#AA0000",
            "textbgcolor" : "#FFFFCC",
            "textcolor": "#AA0000"
        },
        "rbox" : {
            "linecolor" : "#000000",
            "textbgcolor" : "#333333",
            "textcolor": "#FFFFFF"
        }
    },
    "aggregateArcColors":{
        "inline_expression" : {
            "linecolor" : "grey",
            "textbgcolor" : "white"
        },
        "box" : {
            "linecolor" : "black",
            "textbgcolor" : "white"
        }
    }
};

var customMscTestInput = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "options": {
        "arcgradient": "10",
        "wordwraparcs": "true"
    },
    "entities": [
    {
        "name": "a"
    },
    {
        "name": "b"
    },
    {
        "name": "c"
    },
    {
        "name": "d"
    },
    {
        "name": "e"
    }
  ],
    "arcs": [
      [
      {
          "kind": "note",
          "from": "b",
          "to": "d",
          "label": "colors should star cycling at d"
      }
    ],
    [
      {
          "kind": "=>>",
          "from": "a",
          "to": "b",
          "label": "here's some text that should get colored"
      }
    ],
    [
      {
          "kind": "=>>",
          "from": "b",
          "to": "c",
          "label": "here's some more text, expected to have an other color"
      }
    ],
    [
      {
          "kind": "=>>",
          "from": "c",
          "to": "*",
          "label": "colors y'all!"
      }
    ],
    [
      {
          "kind": "<<",
          "from": "b",
          "to": "d",
          "label": "colored in d's color"
      }
    ],
    [
      {
          "kind": ">>",
          "from": "e",
          "to": "b",
          "label": "colored in e's color"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "b",
          "to": "b",
          "label": "some reflection"
      }
    ],
    [
      {
          "kind": ">>",
          "from": "b",
          "to": "a",
          "label": "reflected colore things"
      }
    ]
  ]
};
var customMscTestOutput = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "options": {
        "arcgradient": "10",
        "wordwraparcs": "true"
    },
    "entities": [
    {
        "name": "a",
        "linecolor": "#FF0000",
        "textbgcolor": "red",
        "textcolor": "white",
        "arctextcolor": "white",
        "arclinecolor": "#FF0000"
    },
    {
        "name": "b",
        "linecolor": "#AAAAAA",
        "textbgcolor": "white",
        "arclinecolor": "#AAAAAA"
    },
    {
        "name": "c",
        "linecolor": "#0000FF",
        "textbgcolor": "blue",
        "textcolor": "#111111",
        "arctextcolor": "#111111",
        "arclinecolor": "#0000FF"
    },
    {
        "name": "d",
        "linecolor": "#FF0000",
        "textbgcolor": "red",
        "textcolor": "white",
        "arctextcolor": "white",
        "arclinecolor": "#FF0000"
    },
    {
        "name": "e",
        "linecolor": "#AAAAAA",
        "textbgcolor": "white",
        "arclinecolor": "#AAAAAA"
    }
  ],
    "arcs": [
      [
      {
          "kind": "note",
          "from": "b",
          "to": "d",
          "label": "colors should star cycling at d",
          "linecolor": "#AA0000",
          "textcolor": "#AA0000",
          "textbgcolor": "#FFFFCC"
      }
    ],
    [
      {
          "kind": "=>>",
          "from": "a",
          "to": "b",
          "label": "here's some text that should get colored"
      }
    ],
    [
      {
          "kind": "=>>",
          "from": "b",
          "to": "c",
          "label": "here's some more text, expected to have an other color"
      }
    ],
    [
      {
          "kind": "=>>",
          "from": "c",
          "to": "*",
          "label": "colors y'all!"
      }
    ],
    [
      {
          "kind": "<<",
          "from": "b",
          "to": "d",
          "label": "colored in d's color"
      }
    ],
    [
      {
          "kind": ">>",
          "from": "e",
          "to": "b",
          "label": "colored in e's color"
      }
    ],
    [
      {
          "kind": "rbox",
          "from": "b",
          "to": "b",
          "label": "some reflection",
          "linecolor": "#000000",
          "textcolor": "#FFFFFF",
          "textbgcolor": "#333333"
      }
    ],
    [
      {
          "kind": ">>",
          "from": "b",
          "to": "a",
          "label": "reflected colore things"
      }
    ]
  ]
};

describe('render/text/colorize', function() {
    describe('#colorize', function() {
        it('should return the input on uncolor(colorize)', function(){
            expect(colorize.uncolor(colorize.applyScheme(_.cloneDeep(fix.astAltWithinLoop)))).to.deep.equal(fix.astAltWithinLoop);
        });
        it('should, leave already textcolored entities alone', function(){
            expect(colorize.applyScheme(_.cloneDeep(textColoredEntity))).to.deep.equal(textColoredEntity);
        });
        it('should, leave already textcolored entities alone', function(){
            expect(colorize.applyScheme(_.cloneDeep(textColoredEntity), 'auto')).to.deep.equal(textColoredEntity);
        });
        it('should, leave already arctextcolored entities alone', function(){
            expect(colorize.applyScheme(arcTextColoredEntity)).to.deep.equal(arcTextColoredEntity);
        });
        it('should, leave regular arcs departing from already textcolored entities alone', function(){
            expect(colorize.applyScheme(textColoredEntityWithArc)).to.deep.equal(textColoredEntityWithArc);
        });
        it('should color box arcs departing from colored entities', function(){
            expect(colorize.applyScheme(_.cloneDeep(boxes))).to.deep.equal(coloredBoxes);
        });
        it('should not respect any colors when force is applied', function(){
            expect(colorize.applyScheme(_.cloneDeep(boxes), 'auto', true)).to.deep.equal(coloredBoxesForced);
        });
        it('should not respect any colors when force is applied', function(){
            var lRosedBoxes = colorize.applyScheme(_.cloneDeep(boxes), 'rosy');
            expect(colorize.applyScheme(lRosedBoxes, 'auto', true)).to.deep.equal(coloredBoxesForced);
        });
        it('should color box arcs departing from non-colored entities', function(){
            expect(colorize.applyScheme(boxesWithNonColoredEntity)).to.deep.equal(coloredBoxesWithNonColoredEntity);
        });
        it('should not color box arcs already having some color', function(){
            expect(colorize.applyScheme(alreadyColoredBoxes)).to.deep.equal(alreadyColoredBoxes);
        });
        it('should use custom entity color scheme and arc specifics when passed these', function(){
            expect(colorize.colorize(customMscTestInput, customScheme)).to.deep.equal(customMscTestOutput);
        });
    });
});
