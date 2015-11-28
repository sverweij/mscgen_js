# MsGenny
_**Low effort labeling. Auto declarations**_

mscgen already is a simple, concise, well readable language. Write-ability
leaves room for improvement, though.
The *MsGenny* language is our attempt to fill that room. It does away with some of
MscGen's more fancy features in favor of low effort labeling
and automatic entity declarations. This enables you to set up a sequence chart *very*
fast. See below for a complete comparison chart.

To have our cake and eat it too we made the mscgen_js [online interpreter][4] translate between
the two with the flick of a switch. The interpreter also contains a complete [tutorial][5]
on *MsGenny*.

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

![MsGenny sample](https://raw.github.com/sverweij/mscgen_js/master/wikum/msgennysample.png)

([open this chart in the online interpreter](https://sverweij.github.io/mscgen_js/index.html?utm_source=wikum.genny&lang=msgenny&msc=a%20-%3E%20b%20%3A%20ab%28%29%3B%0Aa%20%3D%3E%20c%20%3A%20automatically%20declares%20entities%20used%20in%20arcs%3B%0Ac%20%3D%3E%3E%20c%20%3A%20process%281%29%3B%0Ab%20%3C%3C%3D%20c%20%3A%20Has%20all%20mscgen%20arc%20types...%20%3B%0Ab%20note%20b%3A%20...notes%20%2B%20boxes%20...%3B%0A|||%3B%0A---%20%3A%20Labels%20usually%20don%27t%20need%20enclosing%20quotes%3B%0A---%20%3A%20%22except%20when%20they%20contain%20%2C%20or%20%3B%22%3B%0A...%3B))

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
([open in the mscgen_js online interpreter](https://sverweij.github.io/mscgen_js/index.html?utm_source=wikum.genny&lang=mscgen&msc=msc%20{%0A%20%20a%2C%20b%2C%20c%3B%0A%0A%20%20a%20-%3E%20b%20[label%3D%22ab%28%29%22]%3B%0A%20%20a%20%3D%3E%20c%20[label%3D%22automatically%20declares%20entities%20used%20in%20arcs%22]%3B%0A%20%20c%20%3D%3E%3E%20c%20[label%3D%22process%281%29%22]%3B%0A%20%20b%20%3C%3C%3D%20c%20[label%3D%22Has%20all%20mscgen%20arc%20types...%20%22]%3B%0A%20%20b%20note%20b%20[label%3D%22...notes%20%2B%20boxes%20...%22]%3B%0A%20%20|||%3B%0A%20%20---%20[label%3D%22Labels%20usually%20don%27t%20need%20enclosing%20quotes%22]%3B%0A%20%20---%20[label%3D%22except%20when%20they%20contain%20%2C%20or%20%3B%22]%3B%0A%20%20...%3B%0A}))

## Usage scenarios
We often find ourselves starting a sequence chart in *MsGenny*, and, when
we're done, converting it to *MscGen* (one click in the on line interpreter). After
that we either finish it with coloring or directly save the source to
the documentation.

When in a hurry we directly use the rendered output from *MsGenny*.

## A note on quotes ##
Just like in *MscGen*, in *MsGenny* labels need to be surrounded by quotes.
To simplify entry, however, in most cases *MsGenny* allows you to
skip the quotes. It only needs quotes when a label contains a comma or a
semicolon:
```msgenny
    a => b : "hello b";  # works
    a => b :  hello b;   # works
    a => b : "hello; b"; # works
    a => b :  hello; b;  # doesn't work; confuses the parser to think the arc line stops after hello
    a => b : "hello, b"; # works
    a => b :  hello, b;  # doesn't work; confuses the parser to think the arc stops after hello
```

## Formal syntax ##
The formal syntax is described in a [parsing expression grammar][1]. This grammar
is used to generate the MsGenny parser as well.

## Feature comparison
As mentioned above the [online interpreter][4] converts between *MscGen* and *MsGenny*,
but the [command line interface][2] also does:
```sh
# Translate MsGenny => MscGen
mscgen_js -T mscgen -i yourchart.msgenny -o yourchart.mscgen

# Translate MscGen => MsGenny
mscgen_js -T msgenny -i yourchart.mscgen -o yourchart.msgenny
```




<table>
    <tr><th>feature</th><th>MscGen</th><th>MsGenny</th></tr>
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
        <td>Characters allowed in unquoted entity names</td>
        <td><code>A-Z0-9</code></td>
        <td>Every unicode character, except<code>;,"=-><:*{}</code> and spaces (<code> \t\n\r</code>)</td>
    </tr>
    <tr>
        <td>Characters allowed in quoted entity names</td>
        <td>Every unicode character</td>
        <td>same as MscGen</td>
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
        <td>same as MscGen</td>
    </tr>
    <tr>
        <td>notes, boxes, empty arcs</td>
        <td>supported</td>
        <td>same as MscGen</td>
    </tr>
    <tr>
        <td>parallel calls</td>
        <td>use a comma between arcs: <code>a=>b, a=>c;</code></td>
        <td>same as MscGen</td>
    </tr>
    <tr>
        <td>broadcasts</td>
        <td>Use an asterisk as <em>to</em> or <em>from</em>: <code>a=>*;</code></td>
        <td>same as MscGen</td>
    </tr>
    <tr>
        <td>options</td>
        <td>hscale, arcgradient, width, wordwraparcs </td>
        <td>same as mscgen, plus "watermark" (which works as in xù)</td>
    </tr>
    <tr>
        <td>comments</td>
        <td><code># single line</code>-style, <code>// C++ type single line</code>-style and <code>/* multi line */</code>-style</td>
        <td>same as MscGen</td>
    </tr>
    <tr>
        <td>entity names</td>
        <td><code>alphanumericalstrings</code>, <code>"quoted strings"</code>  and <code>481</code> numbers</td>
        <td>same as MscGen</td>
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
[2]: ../src/script/cli/README.md
[4]: https://sverweij.github.io/mscgen_js/?utm_source=wikum.genny
[5]: https://sverweij.github.io/mscgen_js/tutorial.html?utm_source=wikum.genny
