CREATE DATABASE statistics;
GRANT ALL ON statisctis.* TO root@localhost;
FLUSH PRIVILEGES;

use statistics
create table pings (
date DATETIME, 
hostname VARCHAR(2000), 
IP VARCHAR(30), 
TTL VARCHAR(10), 
loss VARCHAR(2000), 
ResponseTime VARCHAR(20) );





