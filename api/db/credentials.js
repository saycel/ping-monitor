'use strict';
 function Credentials(){
 	this.cellularDB = {
 		"host": 'localhost',
 		"user": '',
 		"password": '',
 		"database": ''
 	}
 	this.appDB = {
 		"host": 'rhizortc.specialstories.org',
 		"user": '',
 		"password": '',
 		"database": ''
 	}
 }

 module.exports = {
 	retrieve: function(){
 		return new Credentials();
 	}
 }