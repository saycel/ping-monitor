'use strict';
var _ = require('underscore');
var mysql      = require('mysql');
var credentials = require("./credentials")

var connection = mysql.createConnection({
  host     : credentials.retrieve().host,
  user     : credentials.retrieve().user,
  password : credentials.retrieve().password,
  database : credentials.retrieve().database
});


function Util(){
	this.description = "Utility for parsing the database"
}


Util.prototype.getCurrentStatus = function(callback){
	var json;
	connection.query('SELECT * FROM results', function(err, rows, fields) {
  		if (err) throw err;
  		console.log('most recent ping: ', rows[rows.length - 1]);
		var data = rows[rows.length - 1]
		json = {
			"raw":data,
			"date":data.date,
			"loss": data.loss.split(' ')[1] + " packet loss round-trip",
			"response": data.ResponseTime
		}
		callback(json)
	});		
}
Util.prototype.getMonthlyReport = function(callback){
	var json;
	connection.query("select * from results where monthname(date) = 'November'", function(err, rows, fields) {
  		if (err) throw err;
  		eval(require('locus'))
		
		callback(json)
	});		
}

module.exports = {
	util: function(){
		return new Util();
	}
}