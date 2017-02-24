'use strict';
 function Credentials(){
 	this.host = 'localhost';
 	this.user = 'saycel';
 	this.password = 'sayc3l!';
 	this.database = 'xpings';
 }
 
 module.exports = {
 	retrieve: function(){
 		return new Credentials();
 	}
 }
