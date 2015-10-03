#!/bin/sh
VERSION=`utl/getver`
COMMIT=`git rev-parse HEAD | cut -c 1-16`
DATE=`date "+%Y%m%d %H:%M"`
HOST=`cat tracking.host`
TRACKINGID=`cat tracking.id`
SITEVERIFID=`cat siteverification.id`

sed s/"{{version}}"/$VERSION/g |\
    sed s/"{{commit}}"/$COMMIT/g |\
    sed s/"{{date}}"/"$DATE"/g |\
    sed s/"{{host}}"/$HOST/g |\
    sed s/"{{trackingid}}"/$TRACKINGID/g |\
    sed s/"{{siteverificationid}}"/$SITEVERIFID/g

# sed  -E s/"([^\$])([\$]{version})"/"\1$VERSION"/g |\
    # sed  -E s/"([^\$])([\$]{commit})"/"\1$COMMIT"/g |\
    # sed  -E s/"([^\$])([\$]{date})"/"\1$DATE"/g |\
    # sed  -E s/"([^\$])([\$]{host})"/"\1$HOST"/g |\
    # sed  -E s/"([^\$])([\$]{trackingid})"/"\1$TRACKINGID"/g |\
    # sed  -E s/"([^\$])([\$]{siteverificationid})"/"\1$SITEVERIFID"/g |\
    # sed s/"\$\${"/"\${"/g
