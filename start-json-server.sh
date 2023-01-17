 
#!/bin/bash

# our comment is here
#
# chmod +x ./start-json-server.sh
#
echo " "
echo "Start json-server ..."
cd info-group
json-server --watch src/db.json --port 3004
