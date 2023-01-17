#!/bin/bash

# our comment is here
#
# chmod +x ./start-servers-script.sh
#
mydir=$(pwd)
echo "The current directory is: $mydir"
myuser=`whoami`
echo "The user logged in is: $myuser"
echo " "
echo "Start konsole for json-server ..."
konsole --hold --new-tab -e $SHELL -c "./start-json-server.sh" &
echo " "
echo "Start npm script ..."
cd info-group
npm start
