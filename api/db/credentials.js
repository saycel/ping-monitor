'use strict';
function Credentials(){
	this.host = 'localhost';
	this.user = 'dhruv';
	this.password = 'raj*1989';
	this.database = 'xresults';
}

module.exports = {
	retrieve: function(){
		return new Credentials();
	}
}
