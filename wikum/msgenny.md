# ms genny
_**Low effort labeling. Auto declarations**_

mscgen already is a simple, concise, well readable language. Write-ability
leaves room for improvement, though.
The *ms genny* language is our attempt to fill that room. It does away with some of 
mscgen's more fancy features in favor of low effort labeling
and automatic entity declarations. This enables you to set up a sequence chart *very*
fast. See below for a complete comparison chart.

To have our cake and eat it too we made the mscgen_js [online interpreter][4] translate between
the two with the flick of a switch. The interpreter also contains a complete [tutorial][5]
on *ms genny*. 

## Example
``` msgenny
a -> b : ab();
a => c : automatically declares entities used in arcs;
c =>> c : process(1);
b <<= c : Has all mscgen arc types... ;
b note b: ...notes + boxes ...;
|||;
--- : Labels usually don't need enclosing quotes;
--- : "except when they contain , or ;";
...;
```

this renders as

![ms genny sample](https://raw.github.com/sverweij/mscgen_js/master/wikum/msgennysample.png)

The equivalent mscgen program would have looked like this:
``` mscgen
msc {
  a, b, c;

  a -> b [label="ab()"];
  a => c [label="automatically declares entities used in arcs"];
  c =>> c [label="process(1)"];
  b <<= c [label="Has all mscgen arc types... "];
  b note b [label="...notes + boxes ..."];
  |||;
  --- [label="Labels usually don't need enclosing quotes"];
  --- [label="except when they contain , or ;"];
  ...;
}
```

## Usage scenarios
We often find ourselves starting a sequence chart in *ms genny*, and, when
we're done, converting it to *mscgen* (one click in the on line interpreter). After
that we either finish it with coloring or directly save the source to
the documentation.

When in a hurry we directly use the rendered output from *ms genny*.

## A note on quotes ##
Just like in *mscgen*, in *ms genny* labels need to be surrounded by quotes. 
To simplify entry, however, in most cases *ms genny* allows you to 
skip the quotes. It only needs quotes when a label contains a comma or a 
semicolon:

    a => b : "hello b";  # works
    a => b :  hello b;   # works
    a => b : "hello; b"; # works
    a => b :  hello; b;  # doesn't work; confuses the parser to think the arc line stops after hello
    a => b : "hello, b"; # works
    a => b :  hello, b;  # doesn't work; confuses the parser to think the arc stops after hello


## Formal syntax ##
The formal syntax is described in a [parsing expression grammar][1]. This grammar
is used to generate the ms genny parser as well.

## Feature comparison
As mentioned above the [online interpreter][4] converts between *mscgen* and *ms genny*.
Moreover, the source code tree contains two node.js scripts which can perform 
these translations from the command line: [genny2msc.js][2] and [msc2genny.js][3] . 

Note: obviously features not supported by *ms genny* get lost in translation.


<table>
    <tr><th>feature</th><th>mscgen</th><th>ms genny</th></tr>
    <tr>
        <td>explicit entity declaration</td>
        <td>mandatory</td>
        <td>supported</td>
    </tr>
    <tr>
        <td>implicit entity declaration</td>
        <td>not supported</td>
        <td>supported</td>
    </tr>
    <tr>
        <td>labels on entities</td>
        <td><code>entity_name [label="this is the label"]</code></td>
        <td><code>entity_name : this is the label</code></td>
    </tr>
    <tr>
        <td>labels on arcs, notes, boxes</td>
        <td><code>a =>> b [label="this is the label"];</code></td>
        <td><code>a =>> b : this is the label;</code></td>
    </tr>
    <tr>
        <td>explicit declaration of start and end of the program</td>
        <td>A mscgen program must start with <code>msc {</code> and must be ended by a <code>}</code></td>
        <td>Needed nor supported</td>
    </tr>
    <tr>
        <td>arc types</td>
        <td>a lot</td>
        <td>same as mscgen</td>
    </tr>
    <tr>
        <td>notes, boxes, empty arcs</td>
        <td>supported</td>
        <td>same as mscgen</td>
    </tr>
    <tr>
        <td>parallel calls</td>
        <td>use a comma between arcs: <code>a=>b, a=>c;</code></td>
        <td>same as mscgen</td>
    </tr>
    <tr>
        <td>broadcasts</td>
        <td>Use an asterisk as <em>to</em> or <em>from</em>: <code>a=>*;</code></td>
        <td>same as mscgen</td>
    </tr>
    <tr>
        <td>options</td>
        <td>hscale, arcgradient, width, wordwraparcs </td>
        <td>same as mscgen, plus "watermark" (which works as in xù)</td>
    </tr>
    <tr>
        <td>comments</td>
        <td><code># single line</code>-style, <code>// C++ type single line</code>-style and <code>/* multi line */</code>-style</td>
        <td>same as mscgen</td>
    </tr>
    <tr>
        <td>entity names</td>
        <td><code>alphanumericalstrings</code>, <code>"quoted strings"</code>  and <code>481</code> numbers</td>
        <td>same as mscgen</td>
    </tr>
    <tr>
        <td>colors</td>
        <td>lines, text, background on entities, arcs and notes</td>
        <td>not supported</td>
    </tr>
    <tr>
        <td>coloring all arcs departing from an entity</td>
        <td>declare by using the <code>arc*</code> property variants on the entity, e.g. <code>arclinecolor="blue"</code></td>
        <td>not supported</td>
    </tr>
    <tr>
        <td>id, url, idurl</td>
        <td>supported</td>
        <td>not supported</td>
    </tr>
    <tr>
        <td>inline expressions (loop, alt, opt, neg, ...)</td>
        <td>not supported</td>
        <td>supported as it is in xù, </td>
    </tr>
</table>

[1]: ../src/script/parse/peg/msgennyparser.pegjs
[2]: ../src/script/cli/genny2msc.js
[3]: ../src/script/cli/msc2genny.js
[4]: https://sverweij.github.io/mscgen_js/
[5]: https://sverweij.github.io/mscgen_js/tutorial.html
