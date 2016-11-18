var express = require('express');
var app = express();
var db = require('./db/util.js');

app.get('/current-status', function(req,res){
	db.util().getCurrentStatus();
    
})

app.listen(8080,function(){
	console.log("listening on port 8080");
});



