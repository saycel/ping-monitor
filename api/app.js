var express = require('express');
var app = express();
var db = require('./db/util.js');

app.get('/current-status', function(req,res){
	db.util().getCurrentStatus(function(ping){
		res.json(ping)
	}); 
})

app.get('/monthly-report/:month', function(req,res){
	db.util().getMonthlyReport(req.params.month,function(ping){
		res.json(ping)
	}); 
})


app.get('/query/:year/:month?/:day?', function(req,res){
	db.util().query(req.params.year,req.params.month,req.params.day,function(ping){
		res.json(ping)
	});	
})

app.listen(8080,function(){
	console.log("listening on port 8080");
});



