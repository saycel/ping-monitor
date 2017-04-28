#Saycel Uptime Monitor

This code builds the API to monitor the wide area network uptime of our Cellular Network.  It is still under development.  However API routes are now available to query to see historical and current data in formatted JSON. 
Currently we ping our system every thirty minutes.  This will increase. 

##Example API Routes

GET http://saycel.net/pearl-lagoon/current-status ---> returns most recent Ping  

GET http://saycel.net/pearl-lagoon/monthly-report/january ---> returns a full month of pings  

GET http://saycel.net/pearl-lagoon/query/2017/01/15  ---> query a specific day  

GET http://saycel.net/pearl-lagoon/query/2017 ---> query 2017  

GET http://saycel.net/pearl-lagoon/query/2017/01 ---> query January
GET http://saycel.net/bluefields/current-status ---> query Bluefields

GET http://saycel.net/research/current-status ---> query NYU labs.


###TODO
1. Front End Widget for Website
4. Annual ping backups
5. Make this pretty for UNICEF
