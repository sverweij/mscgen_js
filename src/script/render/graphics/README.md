# Rendering - graphics
In this section we motivate our choice for
[scalable vector graphics](#scalable-vector-graphics), desribe how
our template or [skeleton](#the-scalable-vector-graphics-skeleton) looks and
explain how the rendering functions fill it.

## Scalable vector graphics
As the default output format for the pictures we have chosen scalable
vector graphics (SVG):
- Vector graphics are an obvious choice for drawing sequence charts - it's mostly lines
- SVG works out of the box in most modern browsers
- Converting (/ downgrading) vector graphics to raster graphic
  formats (like png, jpeg etc) is doable (see below). The other way 'round is
  difficult.

## The scalable vector graphics skeleton
:page_with_curl: code in [renderskeleton.js](renderskeleton.js)

We use the following structure for the svg

- `desc` - contains the source code that was used to generate the svg.
   This is practical not only for debugging, but also to reconstruct the
   original program.
- `defs` - "definitions"
    - `style` - which contains the css defining default colors, fonts,
      line widths etc.
    - a list of `marker`s - one for each of the arrow heads possible
      in sequence charts.
    - a `g`roup containing all elements to be rendered: entities,
      arcs, inline expressions
- The body `g`roup. This consists of 5 groups, each of which
  represents a layer. The layers themselves contain nothing else than
  a reference (`use` s) to the groups defined in `defs/g`,
  unless noted differently. The body also contains the translation
  of the `hscale` and `width` options by way of a `transform`
  attribute. The layers from bottom to top:
    - background (a white rectangle the size of the diagram. Put in
      directly, not by reference)
    - arcspan (if there are any inline expressions they get rendered here)
    - lifeline (the vertical lines)
    - sequence (contains the entities, all arcs that are not boxes and
      accompanying text)
    - note (contains all arcs that are boxes (box, abox, rbox and _note_)
    - watermark (contra-intuitively, the easiest way to render a
      watermark in an svg is to put it on top. The watermark is put
      in this layer directly and not by reference)


TODO. Subjects to be covered:
- renderast/ and the svg element factory (:page_with_curl: code in [renderast.js](renderast.js) and [svgelementfactory.js](svgelementfactory.js) )
- flattening (:page_with_curl: code in [../text/flatten.js](../text/flatten.js))
- text wrapping (html vs text/tspans) (:page_with_curl: code in [../text/textutensils.js](../text/textutensils.js))
  & BBox (in [svgutensils.js](svgutensils.js) iircc)
