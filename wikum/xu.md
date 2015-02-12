# xù - a mscgen super set
_**It is mscgen, but not as we know it**_

## Inline expressions
[SDL][2] has a feature called _inline expressions_. They allow you to group a bunch of 
arcs and label them somehow. To define a loop, for instance. Or a conditional statement. 

[UML2][3] sequence diagrams have a similar concept called "combined fragments" (see 
paragraph 14.3.3 of the linked document for details). 

Behaviour specification is not a particularly strong suit of interaction diagrams
(sequence charts/ diagrams/ collaboration diagrams), as Martin Fowler
correctly notes in [UML distilled][1]. At this time (December 2013) mscgen does not 
support them. 

Nonetheless inline expressions are damn handy. Hence xù, a superset of mscgen
including them. 

## An example
This is an example of a xù script describing an interaction that loops over
a list of changes and sorts the old ones to a deletion queue, and the
rest to a birth queue:

```mscgen
msc {
  width=700, hscale=0.8;
  a, b [label="change store"], c, d [label="necro queue"],
  e [label="natalis queue"];

  a =>> b [label="get change list()"];
  a alt e [label="changes found"] {
    b >> a [label="list of changes"];
    a =>> c [label="cull old stuff (list of changes)"];
    b loop e [label="for each change"] {
      c =>> b [label="get change()"];
      b >> c [label="change"];
      c alt e [label="change too old"] {
        c =>> d [label="queue(change)"];
        --- [label="change newer than latest run"];
        c =>> e [label="queue(change)"];
        --- [label="all other cases"];
        ||| [label="leave well alone"];
      };
    };
    c >> a [label="done processing"];
    --- [label="nothing found"];
    b >> a [label="nothing"];
    a note a [label="silent exit"];
  };
}
```

![rendered](xusample.png)

## Syntax
As you can see, the syntax of the inline expressions is very similar to that
of regular arcs, the only difference being that inline expressions have a (mandatory)
section of arcs, enclosed by curly brackets.

```peg
spanarc         = 
 _ from:identifier _ kind:spanarctoken _ to:identifier _ al:("[" al:attributelist "]" {return al})? _ "{" _ arclist:arclist _ "}" _ ";"
```

To compare, this is how a regular arc looks:
```peg
regulararc      =
_ from:identifier _ kind:arctoken      _ to:identifier _                       ("[" attributelist "]")? _ ";"
```

Some more examples
```mscgen
break {
   a => b [label="Can you do this?"];
   b >> a [label="Fatal error"];
};
```

Arguments go into the label as free text. 
```mscgen
loop [label="for each grain of sand on the beach"] {
  a => beach [label="get grain"];
  a => progeny [label="add"];
};
```

```mscgen
msc {
  john, shed,  bike;

  john alt bike [label="wheather is nice"] {
    john =>> shed [label="get(bike)"];
    shed >> john [label="bike"];
    john =>> bike [label="use"];
    --- [label="else"];
    ||| [label="john stays at home"];
  };
}
```

To separate sections to execute in parallel you can use a comment line, like so:
```mscgen
par {
  a => b;
  b >> a;
  ---;
  a => c;
  c => d;
}
```

If you're interested in the complete grammar: the parsing expression grammar we
use to generate the parser is [included in the source][4]. 

## ms genny
ms genny also has support for inline expressions, the if-then-else construct above
would look something like this:

```msgenny
john, shed, bike;

john alt bike: wheather is nice {
  john =>> shed : get(bike);
  shed >> john : bike;
  john =>> bike : use;
  --- : else;
  ||| : john stays at home;
};
```

## compatibility with mscgen
```ast2mscgen``` handles by translating inline expressions to horizontal lines ("---") 

## watermark
Just like msgenny, xù supports a "watermark" _option_: ```watermark="xù rocks!"```;


## Supported inline expressions

<table>
    <tr><th>feature</th><th>SDL-RT 2.3 inline expression</th><th>UML 2 combined fragment</th><th>xù</th></tr>
    <tr>
        <td>Alternatives - if with an optional else</td>
        <td>alt</td>
        <td>alt, else</td>
        <td><code>alt</code></td>
    </tr>
    <tr>
        <td>Alternatives - if with noelse</td>
        <td>opt</td>
        <td>opt</td>
        <td><code>opt</code></td>
    </tr>
    <tr>
        <td>Break - an excpetion occurred. After this nothing happens.</td>
        <td>exc</td>
        <td>break</td>
        <td><code>exc</code><br>
        <code>break</code>
        </td>
    </tr>
    <tr>
        <td>Parralel - do several things at once</td>
        <td>par</td>
        <td>par</td>
        <td><code>par</code></td>
    </tr>
    <tr>
        <td>Weak sequencing - stuff within here can happen in any order across the instances</td>
        <td>seq</td>
        <td>seq</td>
        <td><code>seq</code></td>
    </tr>
    <tr>
        <td>Strict sequencing - stuff within here can happen in only this order across the instances</td>
        <td>_not available_</td>
        <td>strict</td>
        <td><code>strict</td>
    </tr>
    <tr>
        <td>Negative - this is not happening</td>
        <td>_not available_</td>
        <td>neg</td>
        <td><code>neg</code></td>
    </tr>
    <tr>
        <td>Critical region - this is important, execute at once</td>
        <td>_not available_</td>
        <td>critical</td>
        <td><code>critical</code></td>
    </tr>
    <tr>
        <td>Ignore/ consider</td>
        <td>_not available_</td>
        <td>ignore, consider</td>
        <td><code>consider</code><br>
        <code>ignore<code>
        </td>
    </tr>
    <tr>
        <td>Assertion - this stuff must be true</td>
        <td>_not available_</td>
        <td>assert</td>
        <td><code>assert</code></td>
    </tr>
    <tr>
        <td>Loop - repeat this</td>
        <td>loop</td>
        <td>loop</td>
        <td><code>loop</code></td>
    </tr>
    <tr>
        <td>Reference - it's not here, but there's a diagram somewhere else detailing this</td>
        <td>not available as an "inline expression" but as 'MSC reference'</td>
        <td>_not available_</td>
        <td><code>ref</code></td>
    </tr>
</table>


[1]: http://my.safaribooksonline.com/book/software-engineering-and-development/uml/0321193687/sequence-diagrams/ch04lev1sec4
[2]: http://www.sdl-rt.org/standard/V2.3/html/index.htm
[3]: http://www.omg.org/spec/UML/2.4.1/Superstructure/PDF/
[4]: ../src/script/parse/peg/xuparser.pegjs
