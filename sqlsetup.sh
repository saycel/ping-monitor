#! /bin/bash

#script for initial setup of database, user, and table.
#This will be run from the root account but will create a user for the data.


while true
do
    read  -p "Username used to manage data gathered from pings " user
    echo
    read  -p "Username (again): " user2
    echo
    [ "$user" = "$user2" ] && break
    echo "Please try again"
done

while true
do
    read -s -p "Password for new user " pass
    echo
    read -s -p "Password (again): " pass2
    echo
    [ "$pass" = "$pass2" ] && break
    echo "Please try again"
done

while true
do
    read  -p "Database to be created and used for ping result storage: " base
    echo
    read  -p "Database name (again): " base2
    echo
    [ "$base" = "$base2" ] && break
    echo "Please try again"
done

while true
do
    read  -p "Table to be used for ping result storage: " table
    echo
    read  -p "Database name (again): " table2
    echo
    [ "$table" = "$table2" ] && break
    echo "Please try again"
done

read -p "Now Please enter your Mysql ROOT password. Press {ENTER} to continue"
mysql -u root -p << EOF
CREATE DATABASE x$base;
CREATE USER '$user'@'localhost' IDENTIFIED BY '$pass';
GRANT ALL ON x$base.* TO '$user'@'localhost';
FLUSH PRIVILEGES;
\q
EOF

mysql -u $user -p$pass << EOF
use x$base
create table $table (
date DATETIME, 
hostname VARCHAR(30), 
IP VARCHAR(30), 
TTL VARCHAR(10), 
loss VARCHAR(2000), 
ResponseTime VARCHAR(20) );
EOF


#directory for storing credentials file
storage="/home/credentials"
echo "user=$user" >> $storage
echo "pass=$pass" >> $storage
echo "base=x$base" >> $storage
echo "table=$table" >> $storage


