#! /bin/bash

#Enter your IP addresses in the format "IP[x]=IPADDRESS" for example IP[1]=8.8.8.8

#List of IP addresses to log
IP[1]=10.99.0.10
IP[2]=190.107.210.237
#Begins loop through all IP Addresses provided
for i in "${IP[@]}"
do
results=$(ping -c 1 $i)

# Ping from IP
field1=$(echo $i)

#Time to Live
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
field6=$(date +'%F %T')

#input credentials from credentials file into currently runnning script
source /var/lib/ping-monitor/credentials
#credentials="$(pwd/credentials)"
#source $credentials

mysql -u $user -p$pass $base << EOF
INSERT INTO $table (date,hostname,IP,TTL,loss,ResponseTime) VALUES 
('$field6','$field5','$field1','$field2','$field3','$field4');
EOF
done #End of loop
