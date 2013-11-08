#!/bin/sh
SIZE=`expr "$2" : "[^-]*-\(.*\).png"`
# convert $1  -bordercolor white -border 0 \
convert $1 -bordercolor white -border 0 \( -clone 0 -resize $SIZEx$SIZE \) -delete 0 -alpha off $2
optipng -quiet $2
