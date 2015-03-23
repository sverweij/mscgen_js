## renderast.js
### renderAST

1. renderASTPre
   1. set the innerelement id/ prefix
   1. `skel.bootstrap`
   1. `initializeChart`
       - create shortcuts for the layers
       - calculate the text height
       - set the tree depth
   1. `preProcessOptions`
      - sets the options to defaults and overrides them when they were set in the AST
   1. `embedSource`
1. `renderASTMain`
   1. `renderEntities`
       - initializes the entity2X and entity2arcColor global objects
       - calculates the maximum entity height
       - for each entity :
           1. `_renderEntity`
              - renders the entity and adds it to the svg
              - sets the value for the current entity in the respective entity2X and entity2arcColor objects
       - sets the entity X high watermark global
   1. `rowmemory.clear`
   1. `renderArcRows`
1. `renderASTPost`
   - calculate the properties of the canvas
   - render the background
   - `postProcessOptions`
     - render a watermark
     - scale the canvas to options.width if that was specified
   - `renderSvgElement`
     - applies the canvas calculations to the svg

### clean
1. `skel.init`
1. `removeRenderedSVGFromElement`


```
complexity/lines/errors over time
69/813
65/771/9.48
65/777/9.57
65/771/9.64
65/767/9.60
65/774/9.69
64/779/9.66
62/777/9.58
```

### bundledDepencies - don't work as advertised?
"bundledDependencies": ["almond", "requirejs", "codemirror", "canvg"],
