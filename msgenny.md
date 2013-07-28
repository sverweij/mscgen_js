ms genny
========

*scratch* 

- simplified syntax a.c.t. mscgen
- automatic declaration of entities
- explicit declaration of entities possible (to make the order explicit)
- supports all arcs mscgen does
- supports all options mscgen does
- supports labels
- no support for colors, arcskip, id, url, idurl

usage
-----
*scratch*

Write in ms genny, (finish and) save in mscgen.

example
-------
*scratch; maybe bit shorter; also insert pictures*

    a -> b : ab();
    a -> c : automatically declares entities used in arcs;
    c =>> c : process(1);
    b <<= c : Has all mscgen arc types... ;
    b note b: ...notes + boxes ...;
    |||;
    --- : Labels usually don't need enclosing quotes;
    ...;

things
------
Just like in mscgen, in ms genny labels need to be surrounded by quotes. 
To make entry more easy, however, in moste cases ms genny allows to 
forego the enclosing quotes. Only when a label contains a comma or 
semicolon, enclosing quotes are mandatory as the parser won't be able to
figure out whether it's part of the string or ending the arc.

    a => b : "hello b";  # works
    a => b :  hello b;   # works
    a => b : "hello; b"; # works
    a => b :  hello; b;  # doesn't work; confuses the parser to think the arc line stops after hello
    a => b : "hello, b"; # works
    a => b :  hello, b;  # doesn't work; confuses the parser to think the arc stops after hello

formal syntax
-------------
[peg][1]

[1]: script/node/mscgensmplparser.pegjs
