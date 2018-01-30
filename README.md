# Analytics API's
This API is a central server that can query our various tools and deployments.  It is built to b flexible so that we can add more equipment and analytics endpoints as necessary.

## Call Statistics API
If there is power and backhaul is connected, the Call Statistics API will return the total number of calls made in Pearl Cel, as well as the Total Minutes spent on the phone.
   - `GET http://http://saycel.net/pearlcel/calls`
    -- Returns the total number of calls made with Pearl Cel.  
    - `GET http://http://saycel.net/pearlcel/minutes`
    -- Returns the total number of minutes spent. 
    
## Uptime API

The Uptime API queries our Base Station Controllers and Servers in Pearl Lagoon and Bluefields. All queries can take pearl-lagoon, research, or bluefields as the first parameter, depending on what you are trying to query. 
    - `GET http://saycel.net/pearl-lagoon/current-status`
    -- Returns the current status of Pearl Lagoon BSC.  
    - `GET http://saycel.net/pearl-lagoon/monthly-report/january`
    -- Returns a JSON Array of uptimes for the month of January.  This is used for graphs and visualizations
    - `GET http://saycel.net/pearl-lagoon/query/2017/01/15` 
    -- This will return a single days worth of pings.  This is helpful for debugging uptime retroactively.
   
## WebPh.one API
The Webphone API queries usage of the WebPhone.  Can take pearlcel, or rhizomatica as an argument. 
- `GET "http://saycel.net/app/all/2017-2018` 
-- This will return the Number of Calls and Minutes of Talk Time for 2017 and 2018.

