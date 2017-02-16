# Rendering
- The entry point for rendering SVG's from an abstract syntax tree is the
  **renderAST** function in [graphics/renderast.js](graphics/renderast.js).

  The [README](graphics) in the graphics folder explains how the resulting
  SVG is structured.
- The [text](text) directory contains
  - modules that render abstract syntax trees into various textual output
    formats
  - modules that massage the syntax tree, e.g. to apply colors
    or to flatten the tree to something that is easier to render.
