'use strict';
 function Map(){
 	this.dictionary = [
        {
            "name":"pearl-lagoon",
            "ip":"10.99.0.10"
        },
        {
            "name":"google",
            "ip": "8.8.8.8"
        }
    ]
 }
 
 module.exports = {
 	retrieve: function(){
 		return new Map();
 	}
 }
