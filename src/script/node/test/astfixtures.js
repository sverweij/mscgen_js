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
        }
    };
})();
