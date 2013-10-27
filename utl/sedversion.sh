#!/bin/sh
sed s/{version}/"`date "+build %Y%M%d %H:%M:%S"`"/g
