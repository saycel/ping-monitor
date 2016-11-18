'use strict';
function Credentials(){
	this.host = 'localhost';
	this.user = 'me';
	this.password = 'secret';
	this.database = 'my_db';

}

module.exports = {
	retrieve: function(){
		return new Credentials();
	}
}
