/*
 * parser for _simplified_ MSC (messsage sequence chart)
 * TODO: allow autodeclaration of entities (_besides_ explicitly
 *       declared entities)?
 */

{
    function merge(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

    function entityExists (pEntities, lName) {
        var i = 0;
        if (lName === undefined || lName === "*") {
            return true;
        }
        if (pEntities && pEntities.entities && lName) {
            for (i=0;i<pEntities.entities.length;i++) {
                if (pEntities.entities[i].name === lName) {
                    return true;
                }
            }
        }
        return false;
    }

    function initEntity(lName ) {
        var lEntity = new Object();
        lEntity.name = lName;
        return lEntity;
    }

    function extractUndeclaredEntities (pEntities, pArcLineList) {
        var i = 0;
        var j = 0;
        var lEntities = new Object();
        if (pEntities) {
            lEntities = pEntities;
        } else {
            lEntities.entities = [];
        }



        for (i=0;i<pArcLineList.arcs.length;i++) {
            for (j=0;j<pArcLineList.arcs[i].length;j++) {
                if (!entityExists (lEntities, pArcLineList.arcs[i][j].from)) {
                    lEntities.entities[lEntities.entities.length] =
                        initEntity(pArcLineList.arcs[i][j].from);
                }
                if (!entityExists (lEntities, pArcLineList.arcs[i][j].to)) {
                    lEntities.entities[lEntities.entities.length] =
                        initEntity(pArcLineList.arcs[i][j].to);
                }
            }
        }
        return lEntities;
    }
}

program         =  _ d:declarationlist _ 
{
    d[1] = extractUndeclaredEntities(d[1], d[2]);

    return merge (d[0], merge (d[1], d[2]))
}

declarationlist = (o:optionlist {return {options:o}})? 
                  (e:entitylist {return {entities:e}})?
                  (a:arclist {return {arcs:a}})?
optionlist      = o:((o:option "," {return o})* 
                  (o:option ";" {return o})) 
{
  var lOptionList = new Object();
  var opt, bla;
  for (opt in o[0]) {
    for (bla in o[0][opt]){
      lOptionList[bla]=o[0][opt][bla];
    }
  }
  lOptionList = merge(lOptionList, o[1]);
  return lOptionList;
}

option          = _ n:optionname _ "=" _ 
                  v:(s:quotedstring {return s}
                     / i:number {return i.toString()}
                     / b:boolean {return b.toString()}) _ 
{
   var lOption = new Object();
   n = n.toLowerCase();
   lOption[n]=v;
   return lOption;
}
optionname      = "hscale"i / "width"i / "arcgradient"i
                  /"wordwraparcs"i
entitylist      = el:((e:entity "," {return e})* (e:entity ";" {return e}))
{
  el[0].push(el[1]);
  return el[0];
}
entity "entity" =  _ i:identifier _ l:(":" _ l:string _ {return l})?
{
  var lEntity = new Object();
  lEntity["name"] = i;
  if (l) {
    lEntity["label"] = l;
  }
  return lEntity;
}
arclist         = (a:arcline _ ";" {return a})+
arcline         = al:((a:arc "," {return a})* (a:arc {return [a]}))
{
   al[0].push(al[1][0]);

   return al[0];
}
arc             = a:((a:singlearc {return a}) 
                / (a:dualarc {return a})
                / (a:commentarc {return a}))
                  al:(":" _ l:string _ {return l})?
{
  if (al) {
    a["label"] = al;
  }
  return a;
}

singlearc       = _ kind:singlearctoken _ {return {kind:kind}}
commentarc      = _ kind:commenttoken _ {return {kind:kind}}
dualarc         = 
 (_ from:identifier _ kind:dualarctoken _ to:identifier _
  {return {kind: kind, from:from, to:to}})
/(_ "*" _ kind:bckarrowtoken _ to:identifier _
  {return {kind:kind, from: "*", to:to}})
/(_ from:identifier _ kind:fwdarrowtoken _ "*" _
  {return {kind:kind, from: from, to: "*"}})
singlearctoken  = "|||" / "..." 
commenttoken    = "---"
dualarctoken    =   "--"  / "<->"
                  / "=="  / "<<=>>"
                          / "<=>"
                  / ".."  / "<<>>"
                  / "::"  / "<:>" 
                  / fwdarrowtoken / bckarrowtoken
                  / "note"i / "abox"i / "rbox"i / "box"i
fwdarrowtoken   "left to right arrow"
                = "->" / "=>>"/ "=>" / ">>"/ ":>" / "-x"i
bckarrowtoken   "right to left arrow"
                = "<-" / "<<=" / "<=" / "<<" / "<:" / "x-"i 


string          = quotedstring / unquotedstring
quotedstring    = '"' s:stringcontent '"' {return s.join("")}
stringcontent   = (!'"' c:('\\"'/ .) {return c})*
unquotedstring  = s:nonsep {return s.join("")}
nonsep          = (!(',' /';') c:(.) {return c})*

identifier "identifier"
 = (letters:([A-Za-z_0-9])+ {return letters.join("")})
  / quotedstring 

whitespace "whitespace"
                = [ \t]
lineend "lineend"
                = [\r\n]
comment "comment"
                =   ("//" / "#" ) ([^\r\n])*
                  / "/*" (!"*/" .)* "*/"
_               = ((whitespace)+ / (lineend)+ / (comment)+)*

number = real / integer
integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

real "real"
  = digits:([0-9]+ "." [0-9]+) { return parseFloat(digits.join("")); }

boolean "boolean"
  = "true"i / "false"i
  
/*
    This file is part of mscgen_js.

    mscgen_js is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    mscgen_js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
*/



