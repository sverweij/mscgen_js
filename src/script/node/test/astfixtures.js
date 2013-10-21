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
        astOptions : function(){
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
        }
    };
})();
