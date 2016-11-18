'use strict';

var _ = require('underscore');
function Util(){
	this.description = "Utility for parsing the database"
}
Util.prototype.getCurrentStatus = function(){
	eval(require('locus'))
	// var work = {sessions:[0]};
	// _.each(not_home_networks, function(n){
	// 	if (n.sessions.length > work.sessions.length){
	// 		work = n;
	// 	}
	// })
	// work.work = true;
	// return work;
}

module.exports = {
	util: function(){
		return new Util();
	}
}