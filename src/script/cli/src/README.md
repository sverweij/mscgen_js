### How we render graphics
We use phantomjs, a 'headless' browser. It is a relatively slow way to do so,
but it yields the best off-line renditions.

#### Why
mscgen_js natively renders svg. For this it relies on a DOM. In a web-browser
this is a given, but in a node.js environment it isn't. There are some
alternatives in node.js, however. We've been using two
- **jsdom**    
This is relatively easy solution. It is very OK for most of our DOM needs,
except one: it doesn't have the operation to calculate the size of an element
(getBBox). We need this operation to make proper text backgrounds and to
calculate how high boxes and rows should be. Hence, without it, many charts
look sub-optimal.
- **phantomjs**    
Because it is a browser everything we need is present. Integrating it in
javascript code is a bit klunky (see below). Because each rendition means
starting off a new browser, there is a fixed performance hit.

#### How
To render vector graphics, we create a new child process that starts
phantomjs with a few parameters:
- `cli-phantom-vector.js`    
  A script that takes the rest of the parameters and
  - opens a carefully prepared html page
  - in that page executes a function that
    - takes a (stringified) AST
    - renders it
    - returns the rendered result.
  - writes the result to a file with the given filename
- `cli-phantom.html`    
  A page set up with
  - an element to render the svg in.
  - require.js
  - two functions to do the rendering.
- the (stringified) abstract syntax tree of the script to render
- the name of the file the output should go to

Raster graphics follow a similar process. Instead of getting the svg from the
page `cli-phantom.js` just takes a picture of the rendered page
with phantomjs' `page.render` function and saves that to file.
