// TODO actually recognize syntax of TypeScript constructs

CodeMirror.defineMode("mscgen", function(config, parserConfig) {
   
    function wordRegexp(words) {
        return new RegExp("^((" + words.join(")|(") + "))\\b");
    }

    var gOptions    = ["hscale", "width", "arcgradient", "wordwraparcs"];
    var gAttributes = ["label", "idurl", "id", "url",
                        "linecolor", "linecolour", 
                        "textcolor", "textcolour", 
                        "textbgcolor", "textbgcolour", 
                        "arclinecolor", "arclinecolour", 
                        "arctextcolor", "arctextcolour", 
                        "arctextbgcolor", "arctextbgcolour", 
                        "arcskip"];
/*
    var gArcToken   = ["|||", "...", "---", 
                       "--", "<->",
                       "==", "<<=>>",
                              "<=>",
                       "..", "<<>>",
                       "::", "<:>",
                       "->", "=>>", "=>", ">>", ":>", "-x",
                       "<-", "<<=", "<=", "<<", "<:" "x-",
                       "note", "abox", "rbox", "box"];
                       */

    function tokenBase(stream, state) {
        return "base";
    }

    function tokenString(stream, state) {
        return "string";
    }

    function tokenComment(stream, state) {
        return "comment";
    }
    return {
        token : function (stream, state) {
                    var ch = stream.next();
                    if (ch === "#") {
                        stream.skipToEnd();
                        return "comment";
                    }
                    /*
                    if (stream.match(wordRegExp(gAttributes))){
                        return "attribute";
                    }
                    */
                    return "base";
                },
    }
});

CodeMirror.defineMIME("text/mscgen", "text");

/* DEFAULT THEME

.cm-s-default .cm-keyword {color: #708;}
.cm-s-default .cm-atom {color: #219;}
.cm-s-default .cm-number {color: #164;}
.cm-s-default .cm-def {color: #00f;}
.cm-s-default .cm-variable {color: black;}
.cm-s-default .cm-variable-2 {color: #05a;}
.cm-s-default .cm-variable-3 {color: #085;}
.cm-s-default .cm-property {color: black;}
.cm-s-default .cm-operator {color: black;}
.cm-s-default .cm-comment {color: #a50;}
.cm-s-default .cm-string {color: #a11;}
.cm-s-default .cm-string-2 {color: #f50;}
.cm-s-default .cm-meta {color: #555;}
.cm-s-default .cm-error {color: #f00;}
.cm-s-default .cm-qualifier {color: #555;}
.cm-s-default .cm-builtin {color: #30a;}
.cm-s-default .cm-bracket {color: #997;}
.cm-s-default .cm-tag {color: #170;}
.cm-s-default .cm-attribute {color: #00c;}
.cm-s-default .cm-header {color: blue;}
.cm-s-default .cm-quote {color: #090;}
.cm-s-default .cm-hr {color: #999;}
.cm-s-default .cm-link {color: #00c;}

.cm-negative {color: #d44;}
.cm-positive {color: #292;}
.cm-header, .cm-strong {font-weight: bold;}
.cm-em {font-style: italic;}
.cm-link {text-decoration: underline;}

.cm-invalidchar {color: #f00;}

div.CodeMirror span.CodeMirror-matchingbracket {color: #0f0;}
div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #f22;}
 */
