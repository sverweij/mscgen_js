```mscgen
/*
 * Annotated mscgen example. 
 * comments can be in multi line style (like this one) or in
 * in single line style (starting with # or //). Everything 
 * in comments is ignored by the parsers.
 */
msc {
  # Options
  # hscale makes the renderer multiplies the width between entities 
  hscale="1.2",
  # arcgradient makes the arc lines slope the amount of pixels specified
  # this is useful when lines might overlap, e.g. in parallel calls or 
  # broadcasts
  arcgradient="10";

  # Entities
  # A comma separated list of entity names, closed with a semi colon.
  # Each entity can have zero or more properties, influencing its 
  # appearance and the appearance of arcs departing from it.
  # 
  # It is most practical to give entities short names. You'll have
  # to re type them a lot. If you want them to show them up nicely
  # just give them a label.
  #
  # 
  a [label="Entity A",
     textbgcolor="red", textcolor="white"],          # this colors the entity
  b [label="Entity B", textbgcolor="yellow",
     linecolor="blue",
     arclinecolor="blue", arctextbgcolor="yellow",   # these arc*color determine the default
     arctextcolor="blue"                             # color of arcs departing from entity b
     ],
  c [label="Entity C", textbgcolor="blue", textcolor="yellow"];

  # Arcs
  a->b [ label = "ab()" ] ;
  b->c [ label = "bc(TRUE)"];
  c=>>c [ label = "process(1)" ];
  b<<=c [ label = "callback()", arcskip="1"];
  |||;
  ---  [ label = "If more to run", ID="*" ];
  a->a [ label = "next()"];
  a=>c [ label = "ac1()"];
  b<<c [ label = "cb(true)", textbgcolor="lime"];
  b->b [ label = "stalled(...)"];
  a<<b [ label = "ab() = FALSE", textcolor="red", linecolor="red"], 
  c note c [label="Just a note ...", linecolor="green", textcolor="green", textbgcolor="lime"];
}
```

