###  Script for running ping every X amount of time and then inserting the data into a Mysql database.
# To run this script you need to first run sqlsetup.sh this will generate the following.
## -Database
## -User
## -User permissions
## -Permissions on database
## -Table
## -Store user, password, database, and table names in credentials file

node app.js > stdout.txt 2> stderr.txt &
