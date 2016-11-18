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


Util.prototype.getCurrentStatus = function(){
	connection.connect();
	connection.query('SELECT * FROM results', function(err, rows, fields) {
  		if (err) throw err;
  		console.log('The solution is: ', rows[0]);
	});	
	connection.end();
}

module.exports = {
	util: function(){
		return new Util();
	}
}