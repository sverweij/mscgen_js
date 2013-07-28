Who is Ms Genny?
================
*mscgen* already is a simple, concise, well readable language. When you use
it, you will discover it was not designed to be as friendly to write.
We attempted to fill this room by designing a simplified variant: *ms genny*.
In *ms genny* we did away with some of *mscgen*'s more fancy features like
*colors* and *arcskip* in favor of low effort labeling and of automatic 
entity declarations. 


Example
-------

    a -> b : ab();
    a => c : automatically declares entities used in arcs;
    c =>> c : process(1);
    b <<= c : Has all mscgen arc types... ;
    b note b: ...notes + boxes ...;
    |||;
    --- : Labels usually don't need enclosing quotes;
    --- : "except when they contain , or ;";
    ...;


which renders as

![ms genny sample](test/msgennysample.png)

Usage scenarios
---------------
We often find ourselves starting a sequence chart in *ms genny*, and, when
we're done, converting it to *mscgen* (one click in the on line demo). After
that we finish it of with coloring or to directly save the source ande the 
renedered picture to the documentation.

Of course directly using the output from *ms genny* is possible as well.

a note on quotes 
----------------
Just like in *mscgen*, in *ms genny* labels need to be surrounded by quotes. 
To make entry more easy, however, in most cases *ms genny* allows to 
forego quotes. Only when a label contains a comma or 
semicolon, enclosing quotes are mandatory. This is because the parser won't be able to
figure out whether it's part of the string or ending the arc.

    a => b : "hello b";  # works
    a => b :  hello b;   # works
    a => b : "hello; b"; # works
    a => b :  hello; b;  # doesn't work; confuses the parser to think the arc line stops after hello
    a => b : "hello, b"; # works
    a => b :  hello, b;  # doesn't work; confuses the parser to think the arc stops after hello


formal syntax
-------------
The formal syntax is described in a [peg][1]. It's 100% accurate as it is used to 
generate the parser.

Feature comparison
------------------
To have your cake and eat it too: the [online demo][4] translates between
*ms genny* and *mscgen* with the flick of a switch. Moreover, with the
node.js scripts [smpl2msc.js][2] and [msc2smpl.js][3] you can do translations 
from the command line. Obviously, in that last one features not supported 
by *ms genny* will not be in the result.


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
        <td>A mscgen program must start with <code>msc {</code> must be ended by a <code>}</code></td>
        <td>Not needed (or supported)</td>
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
        <td>same as mscgen</td>
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
        <td>declare by using the <code>arc*</code> property variants on the entity</td>
        <td>not supported</td>
    </tr>
    <tr>
        <td>id, url, idurl</td>
        <td>supported</td>
        <td>not supported</td>
    </tr>
</table>

[1]: script/node/mscgensmplparser.pegjs
[2]: script/node/smpl2msc.js
[3]: script/node/msc2smpl.js
[4]: http://sverweij.github.io/mscgen_js/
