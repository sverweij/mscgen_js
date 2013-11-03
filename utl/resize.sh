#!/bin/sh
SIZE=`expr "$2" : "[^-]*-\(.*\).png"`
convert $1 -bordercolor white -border 0 \( -clone 0 -resize $SIZEx$SIZE \) -delete 0 -alpha off -colors 256 $2
optipng -quiet $2