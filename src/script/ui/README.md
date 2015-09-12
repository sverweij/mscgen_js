# interactive interpreter
:page_with_curl: code in [../mscgen-interpreter.js](../mscgen-interpreter.js) and
the sources in [ui/](.).

## Rendering in real time
When we built the first version of the on line interpreter we parsed and
rendered the chart at each key-up. The javascript was more than fast
enough to keep up for 'reasonably sized' scripts, so we kept this approach.

### 'reasonably sized' is relative
In version 0.9.103 we changed the key-up => render approach: 
- Customers switched off 'auto render' sometimes. 
- Some of our own - very reasonable - scripts became 'unreasonably sized'.

The interpreter now politely waits until you pause your typing for more 
than 500ms:
- It sets a timeout to ~500ms on each key-up. 
- When the timeout expires it renders the chart.
- To prevent unnecessary renders, each key-up cancels the current 
  timeout before setting a new one.

For bigger sized scripts the interpreter feels a lot faster than the
render-per-keystroke approach.
 
### why 500ms?
- It is close to the average typing speed (see 
  [wikipedia](https://en.wikipedia.org/wiki/Words_per_minute)).
- Longer timeouts felt too slow.
- Shorter timeouts have less of an effect, although still noticeable.

> We experimented with 10ms timeouts with the relatively big
[test01_all_possible_arcs](../../samples/test01_all_possible_arcs.mscin). 
It surprised us this was already a very noticeable improvement over the 
render-per-keystroke approach.

### pre-rending rastergrahpics? Nope
In our enthusiasm we also started pre-rendering the raster graphics
versions. That turned out to be too slow (data below), so
these are now generated when you actually click the button.

Our findings from that experiment:
> - rendering base64 encoded strings on each keystroke is too slow:
  - canvg is called twice for doing exactly the same (svg => canvas)
  - it inserts relatively big amounts of data in the DOM tree
    (typically 20k for svg, 60k for png, somewhat more for jpeg,
    not even corrected for the base64 penalty)
  - for bigger sources (e.g. test01_all_possible_arcs.mscin)
     auto rendering is unbearably slow, which stands to reason as
     the source tree has to be updated with  
     1.3 * (~250k (png) + ~250k (jpeg) + ~80k (svg)) = ~750k
     on each keystroke  
     How slow? 4-5 seconds for each keystroke for test01
     on a 2.53 GHz Intel Core 2 Duo running OS X 10.8.4 in
     FF 23/ Safari 6.0.5
  -  Only generating the svg to base64 encoding is doable in regular
     cases, but is noticeable in test01.

## Raster graphics - png and jpeg
For rendering raster graphics we use the `canvg` library, which takes
a piece of svg and renders it on a canvas. When that has happened, a
call to the canvas's `toDataURL` function suffices to return the base64
encoded version of the chart.

## The editor: code mirror
- choosing code mirror
- plugins used
- syntax highlighting for mscgen, xù and msgenny
