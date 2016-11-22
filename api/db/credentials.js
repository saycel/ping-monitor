'use strict';
 function Credentials(){
 	this.host = 'localhost';
 	this.user = 'dmehrotra';
 	this.password = 'raj*1989';
 	this.database = 'xxxpings';
 }
 
 module.exports = {
 	retrieve: function(){
 		return new Credentials();
 	}
 }