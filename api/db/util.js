'use strict';
var _ = require('underscore');
var mysql      = require('mysql');
var credentials = require("./credentials")
var map = require("./bsc-map.js")
var connection = mysql.createConnection({
  host     : credentials.retrieve().host,
  user     : credentials.retrieve().user,
  password : credentials.retrieve().password,
  database : credentials.retrieve().database
});


function handleDisconnect() {
  connection = mysql.createConnection({
 	 host     : credentials.retrieve().host,
	 user     : credentials.retrieve().user,
 	 password : credentials.retrieve().password,
 	 database : credentials.retrieve().database
	}); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


function Util(){
	this.description = "Utility for parsing the database"
}


Util.prototype.getCurrentStatus = function(bsc,callback){
	var json;
    var this_bsc = _.findWhere(map.retrieve().dictionary,{name:bsc})
    if (this_bsc != undefined){
	    connection.query("SELECT * FROM pings where ip ='"+ this_bsc.ip +"'", function(err, rows, fields) {
  		    if (err) throw err;
  		    console.log('most recent ping: ', rows[rows.length - 1]);
		    var data = rows[rows.length - 1]
		    callback(data)
	    });
    }
}
Util.prototype.getMonthlyReport = function(bsc,month,callback){
	var json;
    var this_bsc = _.findWhere(map.retrieve().dictionary,{name:bsc})
    if (this_bsc != undefined){
	    connection.query("select * from pings where monthname(date) ='" + month + "' and ip='"+this_bsc.ip+"'", function(err, rows, fields) {
  		    if (err) throw err;
  		    if (rows.length == 0){
  			    callback("no data from this month")
  		    }else{
  			    callback(rows)
  		    }
	    });
    }
}
Util.prototype.query = function(bsc,year,month,day,callback){
	var date = this.parseArguments(year,month,day);
	console.log(date)
	var this_bsc = _.findWhere(map.retrieve().dictionary,{name:bsc})
    if (this_bsc != undefined){
		connection.query("SELECT * FROM pings WHERE date LIKE '"+date+"%' and ip='"+this_bsc.ip+"'", function(err, rows, fields) {
				if (err) throw err;	
				callback(rows);
		});
	}
}
Util.prototype.parseArguments = function(year,month,day){
	
	// this is really ugly way to solve this but im really tired. 
	var date;
	if (month != null){
		if (day != null){
			date = year + "-" + month + "-" + day;
		}else{
			date = year + "-" + month;
		}
	}else{
		date = year;
	}
	return date;
	
}

module.exports = {
	util: function(){
		return new Util();
	}
}
