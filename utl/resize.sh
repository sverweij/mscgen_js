#!/bin/sh
SIZE=`expr "$2" : "[^-]*-\(.*\).png"`
convert $1 \( -clone 0 -resize $SIZEx$SIZE \) -delete 0 -alpha on $2
optipng -quiet $2
