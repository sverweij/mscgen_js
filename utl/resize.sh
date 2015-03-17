#!/bin/sh
SIZE=`expr "$2" : "[^-]*-\(.*\).png"`
CONVERT=`which convert`
OPTIPNG=`which optipng`
if [ $CONVERT ]
then
    $CONVERT $1 \( -clone 0 -resize $SIZEx$SIZE \) -delete 0 -alpha on $2
fi

if [ $OPTIPNG ]
then
    $OPTIPNG -quiet $2
fi
