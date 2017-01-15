#Saycel Uptime Monitor
This code builds the API to monitor the wide area network uptime of our Pearl Lagoon Cellular Network.  It is still under development.  However API routes are now available to query to see historical and curr†ent data in formatted JSON.  For now here is an IP Address - Port && api-routes that you can query to see our pingtimes. Soon we will use a domain. 

Currently we ping our system every thirty minutes.  This will increase. 

##API Routes

GET 162.243.238.142:8080/current-status -> returns most recent Ping  

GET 162.243.238.142:8080/monthly-report/{{month-name}} -> returns a full month of pings  

GET 162.243.238.142:8080/query/:year/:month?/:day?' -> query a specific day  
---eg; 162.243.238.142:8080/query/2017/01/15  

GET 162.243.238.142:8080/query/2017 -> query a year  

GET 162.243.238.142:8080/query/2017/01 -> query a month  


