var express = require('express');
var app = express();
var db = require('./db/util.js');

app.use(express.static('public'));
//app.use(express.static('imgs'));
app.set('view engine', 'ejs');

app.get('/graph', function(req, res){
	res.sendFile('graph.html',{root:'public'});
});
app.get('/',function(req,res){
	res.redirect('/reports/1d');
})
app.get('/reports/:time', function(req, res){
	var time = req.params.time;
	res.render('reports.ejs', {data:time});
});

// Cellular Routes

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

// Dial-In Application Routes

app.get('/app/:install/total-minutes', function(req,res){
	db.util().getTotalMinutes(req.params.install,function(minutes){
		res.json(minutes)
	}); 
})
app.get('/app/:install/total-calls', function(req,res){
	db.util().getTotalCalls(req.params.install,function(calls){
		res.json(calls)
	}); 
})
app.get('/app/:install/:year/:month?/:day?', function(req,res){
	db.util().appQuery(req.params.install,req.params.year,req.params.month,req.params.day,function(calls){
		res.json(calls)
	});	
})

app.listen(3000,function(){
	console.log("listening on port 8080");
});
