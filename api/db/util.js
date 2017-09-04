'use strict';
var _ = require('underscore');
var mysql      = require('mysql');
var credentials = require("./credentials")
var map = require("./hardware-map.js")
var cellularConnection = createDBConnection("cellularDB")
var appConnection = createDBConnection("appDB")

function createDBConnection(db){
	var con = mysql.createConnection({
 	 host     : credentials.retrieve()[db].host,
	 user     : credentials.retrieve()[db].user,
 	 password : credentials.retrieve()[db].password,
 	 database : credentials.retrieve()[db].database
	}); 
	
	return con;

}


function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


function parseCallTime(rows){
	var grouped = _.groupBy(rows,function(n){return n.callid})
	var totalMs = 0
	_.each(grouped, function(value, key, obj){
		var s = _.sortBy(value, function(o) { return o.time; })
		var t = _.last(s).time - s[0].time
		totalMs = totalMs + t;
		

	})
	return millisToMinutesAndSeconds(totalMs)
}


function handleDisconnect(db) {
  	if (db == "cellularDB"){
	  cellularConnection = createDBConnection(db)                                        // the old one cannot be reused.

	  cellularConnection.connect(function(err) {              // The server is either down
	    if(err) {                                     // or restarting (takes a while sometimes).
	      console.log('error when connecting to db:', err);
	      setTimeout(function(){handleDisconnect(db)}, 2000); // We introduce a delay before attempting to reconnect,
	    }                                     // to avoid a hot loop, and to allow our node script to
	  });                                     // process asynchronous requests in the meantime.
	                                          // If you're also serving http, display a 503 error.
	  cellularConnection.on('error', function(err) {
	    console.log('db error', err);
	    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
	      handleDisconnect(db);                         // lost due to either server restart, or a
	    } else {                                      // connnection idle timeout (the wait_timeout
	      throw err;                                  // server variable configures this)
	    }
	  });
	}
	if(db == "appDB" ){
	  appConnection = createDBConnection(db)                                        // the old one cannot be reused.

	  appConnection.connect(function(err) {              // The server is either down
	    if(err) {                                     // or restarting (takes a while sometimes).
	      console.log('error when connecting to db:', err);
	      setTimeout(function(){handleDisconnect(db)}, 2000); // We introduce a delay before attempting to reconnect,
	    }                                     // to avoid a hot loop, and to allow our node script to
	  });                                     // process asynchronous requests in the meantime.
	                                          // If you're also serving http, display a 503 error.
	  appConnection.on('error', function(err) {
	    console.log('db error', err);
	    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
	      handleDisconnect(db);                         // lost due to either server restart, or a
	    } else {                                      // connnection idle timeout (the wait_timeout
	      throw err;                                  // server variable configures this)
	    }
	  });
	}

}

handleDisconnect("cellularDB");
handleDisconnect("appDB");


function Util(){
	this.description = "Utility for parsing the database"

}


Util.prototype.getCurrentStatus = function(bsc,callback){
	var json;
    var this_bsc = _.findWhere(map.retrieve().dictionary,{name:bsc})
    if (this_bsc != undefined){
	    cellularConnection.query("SELECT * FROM pings where ip ='"+ this_bsc.ip +"'", function(err, rows, fields) {
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
	    cellularConnection.query("select * from pings where monthname(date) ='" + month + "' and ip='"+this_bsc.ip+"'", function(err, rows, fields) {
  		    if (err) throw err;
  		    if (rows.length == 0){
  			    callback("no data from this month")
  		    }else{
  			    callback(rows)
  		    }
	    });
    }
}


// App


Util.prototype.getTotalMinutes = function(install,callback){
	var json;
    var installation = _.findWhere(map.retrieve().dictionary,{name:install})
    
    if (installation != undefined){
	    var r
	    appConnection.query("SELECT method, callid, time FROM acc where src_user =" + installation.acc + " or dst_user = " + installation.acc + " order by callid", function(err, rows, fields) {
  		    if (err) throw err;
		    callback({"totalMinutes": parseCallTime(rows)})
	    });
    }
    if (install == "all"){
    	appConnection.query("SELECT method, callid, time FROM acc callid", function(err, rows, fields) {
  		    if (err) throw err;
		    callback({"totalMinutes": parseCallTime(rows)})
	    });
    }
}

Util.prototype.getTotalCalls = function(install,callback){
	var json;
    var installation = _.findWhere(map.retrieve().dictionary,{name:install})
    
    if (installation != undefined){
	    var r
	    appConnection.query("SELECT time FROM acc where src_user = " + installation.acc + " or dst_user = " + installation.acc + " group by callid order by callid", function(err, rows, fields) {
  		    if (err) throw err;
		    callback({"totalCalls": rows.length})
	    });
    }
    if (install == "all"){
	    appConnection.query("SELECT time FROM acc group by callid order by callid", function(err, rows, fields) {
  		    if (err) throw err;
		    callback({"totalCalls": rows.length})
	    });
    }
}



Util.prototype.query = function(bsc,year,month,day,callback){
	var date = this.parseArguments(year,month,day);
	console.log(date)
	var this_bsc = _.findWhere(map.retrieve().dictionary,{name:bsc})
    if (this_bsc != undefined){
		cellularConnection.query("SELECT * FROM pings WHERE date LIKE '"+date+"%' and ip='"+this_bsc.ip+"'", function(err, rows, fields) {
				if (err) throw err;	
				callback(rows);
		});
	}
}
Util.prototype.appQuery = function(install,year,month,day,callback){
	var date = this.parseArguments(year,month,day);
	var installation = _.findWhere(map.retrieve().dictionary,{name:install})
    var g = {}
 
    if (installation != undefined){
	    appConnection.query("SELECT method, callid, time FROM acc WHERE time LIKE '"+date+"%' and src_user='"+installation.acc+"' or dst_user='"+installation.acc+"'", function(err, rows, fields) {
  		    if (err) throw err;
  		 	g = _.groupBy(rows,function(n){return n.callid})
  		 
		    callback({
		    	"totalMinutes": parseCallTime(rows),
		    	"totalCalls":_.keys(g).length
			})
	    });
	}
	if (install == "all"){
	    appConnection.query("SELECT method, callid, time FROM acc WHERE time LIKE '"+date+"%'", function(err, rows, fields) {
  		    if (err) throw err;
  		    g = _.groupBy(rows,function(n){return n.callid})
		    callback({
		    	"totalMinutes": parseCallTime(rows),
		    	"totalCalls":_.keys(g).length
			})
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
