'use strict';
function Credentials(){
	this.host = '#######';
	this.user = '###############';
	this.password = '##########################';
	this.database = '#########################';
}

module.exports = {
	retrieve: function(){
		return new Credentials();
	}
}
