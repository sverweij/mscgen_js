module.exports = (function() {

    return {
        astEmpty : function() {
            return {
                "entities" : []
            };
        },
        astSimple : function() {
            return {
                "entities" : [{
                    "name" : "a"
                }, {
                    "name" : "b"
                }],
                "arcs" : [[{
                    "kind" : "=>",
                    "from" : "a",
                    "to" : "b",
                    "label" : "a simple script"
                }]]
            };
        },
        astOptions : function() {
            return {
                "options" : {
                    "arcgradient" : "17",
                    "wordwraparcs" : "true",
                    "hscale" : "1.2",
                    "width" : "800"
                },
                "entities" : [{
                    "name" : "a"
                }]
            };
        },
        astNoEntities : function() {
            return {
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
            };
        },
        astWorwraparcstrue : function() {
            return {
                "options" : {
                    "wordwraparcs" : "true",
                },
                "entities" : []
            };
        },
        astBoxArcs : function() {
            return {
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
                    "to" : "a",
                }, {
                    "kind" : "box",
                    "from" : "b",
                    "to" : "b",
                }, {
                    "kind" : "abox",
                    "from" : "c",
                    "to" : "c",
                }, {
                    "kind" : "rbox",
                    "from" : "d",
                    "to" : "d",
                }]]
            };
        },
        astMixedAttributes : function() {
            return {
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

            };
        },
        astColourColor : function() {
            return {
                "entities" : [{
                    "name" : "a",
                    "textcolor" : "green",
                    "textbgcolor" : "cyan",
                    "linecolor" : "#ABCDEF"
                }]
            };
        },
        astAllAttributes : function() {
            return {
                "entities" : [{
                    "name" : "a",
                    "label" : "Label for A",
                    "textcolor" : "green",
                    "textbgcolor" : "cyan",
                    "linecolor" : "#ABCDEF",
                    "arclinecolor" : "violet",
                    "arctextcolor" : "pink",
                    "arctextbgcolor" : "brown",
                    "id" : "Just and id",
                    "idurl" : "http://localhost/idurl",
                    "url" : "http://localhost/url"
                }],
                "arcs" : [[{
                    "kind" : "<<=>>",
                    "from" : "a",
                    "to" : "a",
                    "label" : "Label for a <<=>> a",
                    "textcolor" : "green",
                    "textbgcolor" : "cyan",
                    "linecolor" : "#ABCDEF",
                    "id" : "Just and id",
                    "idurl" : "http://localhost/idurl",
                    "url" : "http://localhost/url"
                }]]
            };
        },
        astBroadcastCounting : function() {
            return {
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
            };
        },
        astCountingTest : function() {
            return {
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
            };
        },
        astBoxes : function() {
            return {
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
            };
        },
        astOneAlt : function() {
            return {
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
            };
        },
        astOneAltUnwound : function() {
            return {
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
                }]]
            };
        },
        astAltWithinLoop : function() {
            return {
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
            };
        },
        astAltWithinLoopUnWound : function() {
            return {
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
                    "depth": 0
                }], [{
                    "kind" : "alt",
                    "from" : "b",
                    "to" : "c",
                    "label" : "label for alt",
                    "numberofrows" : 2,
                    "depth": 1
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
                }]]
            };
        },
        astOptWithComment : function() {
            return {
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
            };
        },
        astOptWithCommentUnWound : function() {
            return {
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
                    "depth": 0
                }], [{
                    "kind" : "---",
                    "label" : "within opt",
                    "from" : "b",
                    "to" : "c"
                }], [{
                    "kind" : "|||",
                    "from" : "b",
                    "to" : "c",
                }], [{
                    "kind" : "---",
                    "label" : "outside opt"
                }]]
            };
        },
        astDeclarationWithinArcspan : function() {
            return {
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
            };
        }
    };
})();

