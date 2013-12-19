# xù a mscgen super set
_**It is mscgen, but not as we know it**_

## Inline expressions
[SDL][2] has a feature called _inline expressions_. They allow you to group a bunch of 
arcs and label them somehow. To define a loop, for instance. Or a conditional statement. 

[UML2][3] sequence diagrams have a similar concept called "combined fragments" (see 
paragraph 14.3.3 of the linked document for details). 

Behaviour specification is not a particularly strong suit of interaction diagrams
(sequence charts/ diagrams/ collaboration diagrams), as Martin Fowler
correctly notes in [UML distilled][1]. MscGen does not support them (at this time - 
December 2013).


## A MscGen super set 
Nonetheless inline expressions are damn handy. Hence xù, a superset of mscgen
including them.

<table>
    <tr><th>feature</th><th>SDL 2.3 inline expression</th><th>UML 2 combined fragment</th><th>xù</th></tr>
    <tr>
        <td>Alternatives - if with an optional else</td>
        <td>alt</td>
        <td>alt, else</td>
        <td>```alt { a=>b; ---[label="else"]}[label="condition"];```</td>
    </tr>
    <tr>
        <td>Alternatives - if with noelse</td>
        <td>opt</td>
        <td>opt</td>
        <td>```opt { a=>b; }[label="condition"];```</td>
    </tr>
    <tr>
        <td>Break - an excpetion occurred. After this nothing happens.</td>
        <td>exc</td>
        <td>break</td>
        <td>```exc { a=>b; }[label="condition"];```<br>
        ```break { a=>b; }[label="condition"];```
        </td>
    </tr>
    <tr>
        <td>Parralel - do several things at once</td>
        <td>par</td>
        <td>par</td>
        <td>```par { a=>b; --- [label="at the same time ..."]; a => c;} [label="label"];```</td>
    </tr>
    <tr>
        <td>Weak sequencing - stuff within here can happen in any order across the instances</td>
        <td>seq</td>
        <td>seq</td>
        <td>```seq { a=>b; --- [label="at the same time ..."]; a => c;} [label="label"];```</td>
    </tr>
    <tr>
        <td>Strict sequencing - stuff within here can happen in any order across the instances</td>
        <td>_not available_</td>
        <td>strict</td>
        <td>```seq { a=>b; --- [label="at the same time ..."]; a => c;} [label="label"];```</td>
    </tr>
    <tr>
        <td>Negative - this is not happening</td>
        <td>_not available_</td>
        <td>neg</td>
        <td>```neg { a=>b; } [label="this ought not to be happening"];```</td>
    </tr>
    <tr>
        <td>Critical region - this is important, execute at once</td>
        <td>_not available_</td>
        <td>critical</td>
        <td>```critical { a=>b; } [label="execute at once"];```</td>
    </tr>
    <tr>
        <td>Critical region - this is important, execute at once</td>
        <td>_not available_</td>
        <td>ignore, consider</td>
        <td>```consider { a=>b; } [label="when values are > 100 or "];```<br>
        ```ignore { a=>b; } [label="when values are < 100"];```
        </td>
    </tr>
    <tr>
        <td>Assertion - this stuff must be true</td>
        <td>_not available_</td>
        <td>assert</td>
        <td>```assert { a=>b; } [label="execute at once"];```</td>
    </tr>
    <tr>
        <td>Loop - repeat this</td>
        <td>_not available_</td>
        <td>loop</td>
        <td>```assert { a=>>b [label="count(grain)"]; } [label="for all grains of sand on the beach"];```</td>
    </tr>
    <tr>
        <td>Reference - it's not here, but there's a diagram somewhere else detailing this</td>
        <td>_not available_</td>
        <td>_not available_</td>
        <td>```ref { a=>>b [label="thing"]; } [label="do funky stuff"];```</td>
    </tr>
</table>

[1]: http://my.safaribooksonline.com/book/software-engineering-and-development/uml/0321193687/sequence-diagrams/ch04lev1sec4
[2]: http://www.sdl-rt.org/standard/V2.3/html/index.htm
[3]: http://www.omg.org/spec/UML/2.4.1/Superstructure/PDF/
