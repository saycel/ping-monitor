#! /bin/bash


#select IP to ping
read -p "Which IP would you like to ping? " IP
ping -c 1 $IP > results


#Ping from IP

field1 () {
awk -F':' '{ print $1 }' results > tmp
grep "64" tmp | awk '{ print $0"," }' > field1
echo "Field 1 now processed."
}
field1


# Time to Live ttl=###

field2 () {
awk -F'=' '{ print $3 }' results > tmp
sed -i 's/time//' tmp
sed -i '/^$/d;s/[[:blank:]]//g' tmp #delete all whitespace
awk '{ print "ttl= "$0","}' tmp > field2
echo "Field 2 now processed."
}
field2


# Packet loss

field3 () {
awk -F',' '{ print $3 }' results > tmp
sed -i '/^$/d;s/[[:blank:]]//g' tmp
awk '{ print $0"," }' tmp > field3
echo "Field 3 now processed."
}
field3

# Response time (in ms)

field4 () {
awk -F'=' '{ print $4 }' results > tmp
sed -i '/^$/d;s/[[:blank:]]//g' tmp
awk '{ print $0"," }' tmp > field4 # append , to end of line
echo "Field 4 now processed."
}
field4



host () {
echo $(hostname) > tmp
awk '{ print $0"," }' tmp > host
echo "Hostname processed"
}
host

datenow () {
echo $(date) > tmp
awk '{ print $0"," }' tmp > date
echo "Date processed"
}
datenow


postProcess () {
rm tmp
paste -d '\0' date host field1 field2 field3 field4 > /var/lib/mysql-files/output.csv
rm date host field1 field2 field3 field4 results
echo "Post processing now completed"
}
postProcess

#Sql insertion into predefined database and table.

mysql -u root << EOF
use PingScript
LOAD DATA INFILE '/var/lib/mysql-files/output.csv'
INTO TABLE results
FIELDS TERMINATED BY ',';
EOF

