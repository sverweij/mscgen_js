#!/bin/sh
VERSION=`cat VERSION`
COMMIT=`git rev-parse HEAD | cut -c 1-16`
DATE=`date "+%Y%m%d %H:%M"`
sed  -E s/"([^\$])([\$]{version})"/"\1$VERSION"/g |\
    sed  -E s/"([^\$])([\$]{commit})"/"\1$COMMIT"/g |\
    sed  -E s/"([^\$])([\$]{date})"/"\1$DATE"/g |\
    sed s/"\$\${"/"\${"/g
