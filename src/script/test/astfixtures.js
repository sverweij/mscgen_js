module.exports = (function() {

    return {
        astEmpty : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : []
        },
        astSimple : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b space"
            }],
            "arcs" : [[{
                "kind" : "=>",
                "from" : "a",
                "to" : "b space",
                "label" : "a simple script"
            }]]
        },
        astLabeledEntity : {
            "meta": {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities": [
                {
                    "name": "實體",
                    "label": "This is the label for 實體"
                }
            ]
        },
        astAsteriskBoth : {
            "meta": {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "options": {
                "arcgradient": "18"
            },
            "entities": [
            {
                "name": "ω"
            },
            {
                "name": "ɑ"
            },
            {
                "name": "β"
            },
            {
                "name": "ɣ"
            }
          ],
            "arcs": [
              [
              {
                  "kind": "->",
                  "from": "ɑ",
                  "to": "*",
                  "label": "ɑ -> *"
              }
            ],
            [
              {
                  "kind": "<-",
                  "from": "*",
                  "to": "β",
                  "label": "* <- β"
              }
            ],
            [
              {
                  "kind": "<->",
                  "from": "ɣ",
                  "to": "*",
                  "label": "ɣ <-> *"
              }
            ]
          ]
        },
        astSimpleExtended : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b space"
            }],
            "arcs" : [[{
                "kind" : "=>",
                "from" : "a",
                "to" : "b space",
                "label" : "a simple script"
            }]]
        },
        astOptionsMscgen : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "options" : {
                "hscale" : "1.2",
                "width" : "800",
                "arcgradient" : "17",
                "wordwraparcs" : "true"
            },
            "entities" : [{
                "name" : "a"
            }]
        },
        astOptions : {
            "meta" : {
                "extendedOptions": true,
                "extendedArcTypes": false,
                "extendedFeatures": true
            },
            "options" : {
                "hscale" : "1.2",
                "width" : "800",
                "arcgradient" : "17",
                "wordwraparcs" : "true",
                "watermark" : "not in mscgen, available in xù and msgenny"
            },
            "entities" : [{
                "name" : "a"
            }]
        },
        astWithAWatermark : {
            "meta" : {
                "extendedOptions": true,
                "extendedArcTypes": false,
                "extendedFeatures": true
            },
            "options" : {
                "watermark" : "not in mscgen, available in xù and msgenny"
            },
            "entities" : [{
                "name" : "a"
            }]
        },
        astNoEntities : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [],
            "arcs" : [[{
                "kind" : "---",
                "label" : "start"
            }], [{
                "kind" : "...",
                "label" : "no entities ...",
            }], [{
                "kind" : "---",
                "label" : "end"
            }]]
        },
        astWorwraparcstrue : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "options" : {
                "wordwraparcs" : "true",
            },
            "entities" : []
        },
        astBoxArcs : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "note",
                "from" : "a",
                "to" : "a"
            }, {
                "kind" : "box",
                "from" : "b",
                "to" : "b"
            }, {
                "kind" : "abox",
                "from" : "c",
                "to" : "c"
            }, {
                "kind" : "rbox",
                "from" : "d",
                "to" : "d"
            }]]
        },
        astMixedAttributes : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a",
                "label" : "miXed",
                "textbgcolor" : "orange"
            }],
            "arcs" : [[{
                "kind" : "note",
                "from" : "a",
                "to" : "a",
                "linecolor" : "red",
                "textcolor" : "blue",
                "arcskip" : "4"
            }]]
        },
        astColourColor : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a",
                "textcolor" : "green",
                "textbgcolor" : "cyan",
                "linecolor" : "#ABCDEF"
            }]
        },
        astAllAttributes : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a",
                "label" : "Label for A",
                "idurl" : "http://localhost/idurl",
                "id" : "Just and id",
                "url" : "http://localhost/url",
                "linecolor" : "#ABCDEF",
                "textcolor" : "green",
                "textbgcolor" : "cyan",
                "arclinecolor" : "violet",
                "arctextcolor" : "pink",
                "arctextbgcolor" : "brown"
            }],
            "arcs" : [[{
                "kind" : "<<=>>",
                "from" : "a",
                "to" : "a",
                "label" : "Label for a <<=>> a",
                "idurl" : "http://localhost/idurl",
                "id" : "Just and id",
                "url" : "http://localhost/url",
                "linecolor" : "#ABCDEF",
                "textcolor" : "green",
                "textbgcolor" : "cyan"
            }]]
        },
        astBroadcastCounting : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "=>>",
                "from" : "a",
                "to" : "b"
            }], [{
                "kind" : "=>>",
                "from" : "a",
                "to" : "*"
            }], [{
                "kind" : "=>>",
                "from" : "b",
                "to" : "*"
            }]]
        },
        astCountingTest : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }, {
                "name" : "e"
            }, {
                "name" : "f",
                "label" : "Rémy"
            }],
            "arcs" : [[{
                "kind" : "=>>",
                "from" : "a",
                "to" : "b"
            }, {
                "kind" : "<<=>>",
                "from" : "c",
                "to" : "d"
            }], [{
                "kind" : "<<=",
                "from" : "b",
                "to" : "a"
            }, {
                "kind" : "--",
                "from" : "c",
                "to" : "d"
            }], [{
                "kind" : "box",
                "from" : "a",
                "to" : "d",
                "label" : "boxes dont count"
            }], [{
                "kind" : "=>>",
                "from" : "e",
                "to" : "e",
                "label" : "self references don't count"
            }], [{
                "kind" : "note",
                "from" : "c",
                "to" : "c",
                "label" : "notes don't count"
            }]]
        },
        astBoxes : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "note",
                "from" : "a",
                "to" : "b"
            }], [{
                "kind" : "box",
                "from" : "a",
                "to" : "a"
            }, {
                "kind" : "rbox",
                "from" : "b",
                "to" : "b"
            }], [{
                "kind" : "abox",
                "from" : "b",
                "to" : "a"
            }]]
        },
        astOneAlt : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }],
            "arcs" : [[{
                "kind" : "=>",
                "from" : "a",
                "to" : "b"
            }], [{
                "kind" : "alt",
                "from" : "b",
                "to" : "c",
                "arcs" : [[{
                    "kind" : "=>",
                    "from" : "b",
                    "to" : "c"
                }], [{
                    "kind" : ">>",
                    "from" : "c",
                    "to" : "b"
                }]]
            }]]
        },
        astOneAltUnwound : {
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }],
            "arcs" : [[{
                "kind" : "=>",
                "from" : "a",
                "to" : "b"
            }], [{
                "kind" : "alt",
                "from" : "b",
                "to" : "c",
                "numberofrows" : 2,
                "depth" : 0
            }], [{
                "kind" : "=>",
                "from" : "b",
                "to" : "c"
            }], [{
                "kind" : ">>",
                "from" : "c",
                "to" : "b"
            }], [{
                "kind" : "|||",
                "from" : "b",
                "to" : "c",
            }]],
            depth : 1
        },
        astAltWithinLoop : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }],
            "arcs" : [[{
                "kind" : "=>",
                "from" : "a",
                "to" : "b"
            }], [{
                "kind" : "loop",
                "from" : "a",
                "to" : "c",
                "arcs" : [[{
                    "kind" : "alt",
                    "from" : "b",
                    "to" : "c",
                    "arcs" : [[{
                        "kind" : "->",
                        "from" : "b",
                        "to" : "c",
                        "label" : "-> within alt"
                    }], [{
                        "kind" : ">>",
                        "from" : "c",
                        "to" : "b",
                        "label" : ">> within alt"
                    }]],
                    "label" : "label for alt"
                }], [{
                    "kind" : ">>",
                    "from" : "b",
                    "to" : "a",
                    "label" : ">> within loop"
                }]],
                "label" : "label for loop"
            }], [{
                "kind" : "=>>",
                "from" : "a",
                "to" : "a",
                "label" : "happy-the-peppy - outside"
            }], [{
                "kind" : "..."
            }]]
        },
        astAltWithinLoopUnWound : {
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }],
            "arcs" : [[{
                "kind" : "=>",
                "from" : "a",
                "to" : "b"
            }], [{
                "kind" : "loop",
                "from" : "a",
                "to" : "c",
                "label" : "label for loop",
                "numberofrows" : 5,
                "depth" : 0
            }], [{
                "kind" : "alt",
                "from" : "b",
                "to" : "c",
                "label" : "label for alt",
                "numberofrows" : 2,
                "depth" : 1
            }], [{
                "kind" : "->",
                "from" : "b",
                "to" : "c",
                "label" : "-> within alt"
            }], [{
                "kind" : ">>",
                "from" : "c",
                "to" : "b",
                "label" : ">> within alt"
            }], [{
                "kind" : "|||",
                "from" : "b",
                "to" : "c",
            }], [{
                "kind" : ">>",
                "from" : "b",
                "to" : "a",
                "label" : ">> within loop"
            }], [{
                "kind" : "|||",
                "from" : "a",
                "to" : "c",
            }], [{
                "kind" : "=>>",
                "from" : "a",
                "to" : "a",
                "label" : "happy-the-peppy - outside"
            }], [{
                "kind" : "..."
            }]],
            depth : 2
        },
        astOptWithComment : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }],
            "arcs" : [[{
                "kind" : "opt",
                "from" : "b",
                "to" : "c",
                "arcs" : [[{
                    "kind" : "---",
                    "label" : "within opt"
                }]],
                "label" : "label for opt"
            }], [{
                "kind" : "---",
                "label" : "outside opt"
            }]]
        },
        astOptWithCommentUnWound : {
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }],
            "arcs" : [[{
                "kind" : "opt",
                "from" : "b",
                "to" : "c",
                "label" : "label for opt",
                "numberofrows" : 1,
                "depth" : 0
            }], [{
                "kind" : "---",
                "label" : "within opt",
                "from" : "b",
                "to" : "c",
                depth : 1
            }], [{
                "kind" : "|||",
                "from" : "b",
                "to" : "c"
            }], [{
                "kind" : "---",
                "label" : "outside opt"
            }]],
            depth : 1
        },
        astDeclarationWithinArcspan : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "alt",
                "from" : "a",
                "to" : "b",
                "arcs" : [[{
                    "kind" : "->",
                    "from" : "c",
                    "to" : "d"
                }]]
            }]]
        },
        astInlineWithArcColor : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "opt",
                "from" : "a",
                "to" : "b",
                "arcs" : [[{
                    "kind" : "=>",
                    "from" : "a",
                    "to" : "b",
                    "label" : "hasnocolors"
                }]],
                "label" : "hasarccolors",
                "arclinecolor" : "red",
                "arctextcolor" : "green",
                "arctextbgcolor" : "cyan"
            }]]
        },
        astInlineWithArcColorUnWound : {
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "opt",
                "from" : "a",
                "to" : "b",
                "label" : "hasarccolors",
                "arclinecolor" : "red",
                "arctextcolor" : "green",
                "arctextbgcolor" : "cyan",
                "numberofrows" : 1,
                "depth" : 0
            }], [{
                "kind" : "=>",
                "from" : "a",
                "to" : "b",
                "label" : "hasnocolors",
                "linecolor" : "red",
                "textcolor" : "green",
                "textbgcolor" : "cyan"
            }], [{
                "kind" : "|||",
                "from" : "a",
                "to" : "b"
            }]],
            depth : 1
        },
        astNestedInlinesWithArcColor : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "loop",
                "from" : "a",
                "to" : "b",
                "arcs" : [[{
                    "kind" : "=>",
                    "from" : "a",
                    "to" : "b",
                    "label" : "no colors"
                }], [{
                    "kind" : ">>",
                    "from" : "b",
                    "to" : "a",
                    "label" : "all colors",
                    "linecolor" : "fuchsia",
                    "textcolor" : "lime",
                    "textbgcolor" : "cyan"
                }], [{
                    "kind" : "opt",
                    "from" : "a",
                    "to" : "b",
                    "arcs" : [[{
                        "kind" : "->",
                        "from" : "a",
                        "to" : "b",
                        "label" : "no colors"
                    }], [{
                        "kind" : "=>>",
                        "from" : "b",
                        "to" : "a",
                        "label" : "all colors",
                        "linecolor" : "fuchsia",
                        "textcolor" : "lime",
                        "textbgcolor" : "cyan"
                    }]]
                }]],
                "arclinecolor" : "red",
                "arctextcolor" : "green",
                "arctextbgcolor" : "blue"
            }]]
        },
        astNestedInlinesWithArcColorUnWound : {
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "loop",
                "from" : "a",
                "to" : "b",
                "arclinecolor" : "red",
                "arctextcolor" : "green",
                "arctextbgcolor" : "blue",
                "numberofrows" : 6,
                "depth" : 0
            }], [{
                "kind" : "=>",
                "from" : "a",
                "to" : "b",
                "label" : "no colors",
                "linecolor" : "red",
                "textcolor" : "green",
                "textbgcolor" : "blue"
            }], [{
                "kind" : ">>",
                "from" : "b",
                "to" : "a",
                "label" : "all colors",
                "linecolor" : "fuchsia",
                "textcolor" : "lime",
                "textbgcolor" : "cyan"
            }], [{
                "kind" : "opt",
                "from" : "a",
                "to" : "b",
                "numberofrows" : 2,
                "depth" : 1
            }], [{
                "kind" : "->",
                "from" : "a",
                "to" : "b",
                "label" : "no colors"
            }], [{
                "kind" : "=>>",
                "from" : "b",
                "to" : "a",
                "label" : "all colors",
                "linecolor" : "fuchsia",
                "textcolor" : "lime",
                "textbgcolor" : "cyan"
            }], [{
                "kind" : "|||",
                "from" : "a",
                "to" : "b"
            }], [{
                "kind" : "|||",
                "from" : "a",
                "to" : "b"
            }]],
            depth : 2
        },
        astSimpleBroadcast : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "b",
                "to" : "*"
            }]]
        },
        astSimpleBroadcastExploded : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "b",
                "to" : "a"
            }, {
                "kind" : "->",
                "from" : "b",
                "to" : "c"
            }, {
                "kind" : "->",
                "from" : "b",
                "to" : "d"
            }]]
        },
        astComplexerBroadcast : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b",
                "label" : "The big Dr Bee!",
                "arctextcolor" : "green"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "a",
                "to" : "b",
                "label" : "whoopdeedoo"
            }], [{
                "kind" : "->",
                "from" : "b",
                "to" : "*",
                "label" : "has a label, for instance",
                "linecolor" : "blue",
                "textbgcolor" : "yellow"
            }], [{
                "kind" : "->",
                "from" : "a",
                "to" : "*",
                "label" : "whoa!"
            }]]
        },
        astComplexerBroadcastExploded : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b",
                "label" : "The big Dr Bee!",
                "arctextcolor" : "green"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "a",
                "to" : "b",
                "label" : "whoopdeedoo"
            }], [{
                "kind" : "->",
                "from" : "b",
                "to" : "a",
                "label" : "has a label, for instance",
                "linecolor" : "blue",
                "textbgcolor" : "yellow"
            }, {
                "kind" : "->",
                "from" : "b",
                "to" : "c",
                "label" : "has a label, for instance",
                "linecolor" : "blue",
                "textbgcolor" : "yellow"
            }, {
                "kind" : "->",
                "from" : "b",
                "to" : "d",
                "label" : "has a label, for instance",
                "linecolor" : "blue",
                "textbgcolor" : "yellow"
            }], [{
                "kind" : "->",
                "from" : "a",
                "to" : "b",
                "label" : "whoa!"
            }, {
                "kind" : "->",
                "from" : "a",
                "to" : "c",
                "label" : "whoa!"
            }, {
                "kind" : "->",
                "from" : "a",
                "to" : "d",
                "label" : "whoa!"
            }]]
        },
        astSameArcRowBroadcast : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "options" : {
                "arcgradient" : "20"
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "b",
                "to" : "*"
            }, {
                "kind" : ":>",
                "from" : "d",
                "to" : "a"
            }]]
        },
        astSameArcRowBroadcastExploded : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "options" : {
                "arcgradient" : "20"
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }, {
                "name" : "d"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "b",
                "to" : "a"
            }, {
                "kind" : ":>",
                "from" : "d",
                "to" : "a"
            }, {
                "kind" : "->",
                "from" : "b",
                "to" : "c"
            }, {
                "kind" : "->",
                "from" : "b",
                "to" : "d"
            }]]
        },
        astCheatSheet : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "a",
                "to" : "b",
                "label" : "a -> b  (signal)"
            }], [{
                "kind" : "=>",
                "from" : "a",
                "to" : "b",
                "label" : "a => b  (method)"
            }], [{
                "kind" : ">>",
                "from" : "b",
                "to" : "a",
                "label" : "b >> a  (return value)"
            }], [{
                "kind" : "=>>",
                "from" : "a",
                "to" : "b",
                "label" : "a =>> b (callback)"
            }], [{
                "kind" : "-x",
                "from" : "a",
                "to" : "b",
                "label" : "a -x b  (lost)"
            }], [{
                "kind" : ":>",
                "from" : "a",
                "to" : "b",
                "label" : "a :> b  (emphasis)"
            }], [{
                "kind" : "..",
                "from" : "a",
                "to" : "b",
                "label" : "a .. b  (dotted)"
            }], [{
                "kind" : "note",
                "from" : "a",
                "to" : "a",
                "label" : "a note a"
            }, {
                "kind" : "box",
                "from" : "b",
                "to" : "b",
                "label" : "b box b"
            }], [{
                "kind" : "rbox",
                "from" : "a",
                "to" : "a",
                "label" : "a rbox a"
            }, {
                "kind" : "abox",
                "from" : "b",
                "to" : "b",
                "label" : "b abox b"
            }], [{
                "kind" : "|||",
                "label" : "||| (empty row)"
            }], [{
                "kind" : "...",
                "label" : "... (omitted row)"
            }], [{
                "kind" : "---",
                "label" : "--- (comment)"
            }]]
        },
        astWithPreComment : {
            "precomment" : ["# pre comment", "\n", "/* pre\n * multiline\n * comment\n */", "\n"],
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "a",
                "to" : "b"
            }]]
        },
        astSimpleParallel : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "a"
            }, {
                "name" : "b"
            }, {
                "name" : "c"
            }],
            "arcs" : [[{
                "kind" : "->",
                "from" : "b",
                "to" : "a",
                "label" : "{paral"
            }, {
                "kind" : "=>>",
                "from" : "b",
                "to" : "c",
                "label" : "lel}"
            }]]
        },
        astAttributes : {
            "meta" : {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
            },
            "entities" : [{
                "name" : "Alice",
                "linecolor" : "#008800",
                "textcolor" : "black",
                "textbgcolor" : "#CCFFCC",
                "arclinecolor" : "#008800",
                "arctextcolor" : "#008800"
            }, {
                "name" : "Bob",
                "linecolor" : "#FF0000",
                "textcolor" : "black",
                "textbgcolor" : "#FFCCCC",
                "arclinecolor" : "#FF0000",
                "arctextcolor" : "#FF0000"
            }, {
                "name" : "pocket",
                "linecolor" : "#0000FF",
                "textcolor" : "black",
                "textbgcolor" : "#CCCCFF",
                "arclinecolor" : "#0000FF",
                "arctextcolor" : "#0000FF"
            }],
            "arcs" : [[{
                "kind" : "=>",
                "from" : "Alice",
                "to" : "Bob",
                "label" : "do something funny"
            }], [{
                "kind" : "=>",
                "from" : "Bob",
                "to" : "pocket",
                "label" : "fetch (nose flute)",
                "textcolor" : "yellow",
                "textbgcolor" : "green",
                "arcskip" : "0.5"
            }], [{
                "kind" : ">>",
                "from" : "Bob",
                "to" : "Alice",
                "label" : "PHEEE!",
                "textcolor" : "green",
                "textbgcolor" : "yellow",
                "arcskip" : "0.3"
            }], [{
                "kind" : "=>",
                "from" : "Alice",
                "to" : "Alice",
                "label" : "hihihi",
                "linecolor" : "#654321"
            }]]
        }
    };
})();
