'use strict';
 function Credentials(){
 	this.host = 'localhost';
 	this.user = 'root';
 	this.password = 'sayc3l!';
 	this.database = 'statistics';
 }

 module.exports = {
 	retrieve: function(){
 		return new Credentials();
 	}
 }
