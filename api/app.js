var express = require('express');
var app = express();
var db = require('./db/util.js');

app.get('/:bsc/current-status', function(req,res){
	db.util().getCurrentStatus(req.params.bsc,function(ping){
		res.json(ping)
	}); 
})

app.get('/:bsc/monthly-report/:month', function(req,res){
	db.util().getMonthlyReport(req.params.bsc,req.params.month,function(ping){
		res.json(ping)
	}); 
})


app.get('/:bsc/query/:year/:month?/:day?', function(req,res){
	db.util().query(req.params.bsc,req.params.year,req.params.month,req.params.day,function(ping){
		res.json(ping)
	});	
})

app.listen(8080,function(){
	console.log("listening on port 8080");
});



