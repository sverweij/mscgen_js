# Things

- [introduction] (../README.md)
- [ms genny] (msgenny.md)

## tutorial
### Basics
#### a sends a signal to b
``` msgenny
a -> b;
```

As you can see this creates two entities (a and b), both with a lifeline, and an arrow from the first to the second lifeline. 

#### adding text
To show what , add the text after a colon, like so:

``` msgenny
a -> b: "ping";
```
Note: when your description doesn't contain a , or a ; it is possible to leave the quotes out, so 
``` msgenny
a -> b: ping;
```
achieves the same.

#### b replies to a
This works the same, as  
``` msgenny
a -> b: ping;
b >> a: heard ya!;
```

#### notes 
``` msgenny
a -> b: ping;
b >> a: heard ya!;
a note a: we're not done yet ...;
```

#### multi line text
'splain \n

#### comments

#### empty rows, omitted rows, comments

### advanced use
#### options: arcgradient, hscale, width
#### broadcasts, parallel calls

### using the on line demo
By default renders as you type.
saving as svg (includes your program!), png, jpeg

Drag'n drop

Auto render or not?
Language switch.

### mscgen
Click!
Why? mscgen compatibility, doxygen integration. Features: coloring, arcskip, hyperlinks
#### coloring
textcolor, textbgcolor, linecolor
#### coloring everyting departing from a lifeline
#### arcskip
#### id, url, idurl
