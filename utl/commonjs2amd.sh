#!/bin/sh
sed s/module\.exports\ =\ \(/define\ \([],\ /g | sed s/\}\)\(\)\;/\}\)\;/g 
