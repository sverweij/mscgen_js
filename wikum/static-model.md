![static model](http://www.yuml.me/e7b17d46)

```yuml
[Entity|name*;label;linecolor;textcolor;textbgcolor;arclinecolor;arctextcolor;arctextbgcolor;url;id;idurl]
[Arc|label;arcskip;linecolor;textcolor;textbgcolor;url;id;idurl]
[Option|hscale;arcgradient;width;wordwraparcs]
[Arcline]++-0..*>[Arc]
[Arc]0..*-to 0..1>[Entity]
[Arc]0..*-from 0..1>[Entity]
[Arc]0..* for arc spanning arcs only - 1>[Arcline]
[Diagram]-0..*>[Arcline]
[Diagram]-0..*>[Entity]
[Diagram]-0..*>[Option]
```
(edit [here](http://www.yuml.me/edit/e7b17d46))
