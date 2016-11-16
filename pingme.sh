#! /bin/bash


#select IP to ping
read -p "Which IP would you like to ping? " IP
results=$(ping -c 1 $IP)

# Ping from IP
field1=$(awk -F':' '{print $1}' <<< $results)
field1=$(sed -n -e 's/^.*bytes from//p' <<< $field1)

#TIme to Live
field2=$(awk -F'=' '{print $3}' <<< $results)
field2=$(sed  -e 's/time//' <<< $field2)
field2=$(awk -F':' '{print "ttl= "$0}' <<< $field2)

#Packet Loss
field3=$(awk -F',' '{print $3}' <<< $results)

#Response time (in ms)
field4=$(awk -F'=' '{print $4}' <<< $results)
field4=$(awk -F'---' '{ print $1 }' <<< $field4)

# Hostname
field5=$(hostname)

#Date
field6=$(date)

source credentials
mysql -u $user -p$pass $base << EOF
INSERT INTO $table (date,hostname,IP,TTL,loss,ResponseTime) VALUES 
('$field6','$field5','$field1','$field2','$field3','$field4');
EOF
