var express = require('express');
var app = express();
var db = require('./db/util.js');
var mysql      = require('mysql');
var credentials = require("./db/credentials")

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'me',
//   password : 'secret',
//   database : 'my_db'
// });



app.get('/current-status', function(req,res){
	eval(require('locus'))
	db.util.getCurretStatus();

})

app.listen(8080,function(){
	console.log("listening on port 8080");
});



