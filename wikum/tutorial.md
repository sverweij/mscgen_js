# tutorial
## Basics
### a sends a signal to b
``` msgenny
a -> b;
```
![a sample sequence chart, rendered as png](tutorial/tut01.png)
As you can see this creates two entities (a and b), both with a lifeline, and an arrow from the first to the second lifeline. 

### adding text
To show what , add the text after a colon, like so:

``` msgenny
a -> b: "ping";
```
Note: when your description doesn't contain a , or a ; it is possible to leave the quotes out, so 
``` msgenny
a -> b: ping;
```
achieves the same.

### b replies to a
This works the same, as  
``` msgenny
a -> b: ping;
b >> a: heard ya!;
```

### notes 
``` msgenny
a -> b: ping;
b >> a: heard ya!;
a note a: we're not done yet ...;
```

### multi line text
``` msgenny
a note b: This is a note consisting of\ntwo lines of text;
b => c: Breaking text in two\nalso works for arcs;
```

### empty rows, omitted rows, comments
Sometimes your chart needs some more space between arcs, e.g. to emphasise grouping. 
``` msgenny
a =>> b: do something for me;
b >> a: done;
|||;
a => c: "b is done doing something; go bother him"; 
c -> b: bother;
```

To indicate you deliberately left out stuff of your chart, you can use ellipses, like this:
``` msgenny
a =>> b: Do the voodoo;
b => c: Iberian dance task;
c -x b: Whaaat?;
...: magic happens here;
b >> a: Magic answer;
```

To demarcate more strongly and/ or to comment on a part, use *comment* (---), like so:
``` msgenny
a =>> b: read_out_loud(message);
---: for each line in the message:;
b => "text to speach\nprocessor": get_audio (line);
"text to speach\nprocessor" >> b: audio_stream;
b -> speaker: play(audio_stream);
```

### ignore this
In your program lines starting with # or // are ignored, as is everything between c-style block comments
``` msgenny
# This line is ignored
a =>> b: what's happening here? ; /* honestly don't know */
// ignored line
```
Caveat: on translating to mcgen all ignorable text get lost.

## advanced stuff
### options: arcgradient, hscale, width
### naming entities, explicit order
### both ways, no way
### box, rbox, abox
### broadcasts, parallel calls

### using the on line demo
By default renders as you type.

saving as svg (includes your program!), png, jpeg

Drag'n drop

Auto render

Language switch.

Help

## mscgen
Click!
Why? 
- mscgen compatibility, 
- doxygen integration. 
- Features: coloring, arcskip, hyperlinks

### coloring
textcolor, textbgcolor, linecolor

### coloring everyting departing from a lifeline
### arcskip
### id, url, idurl
