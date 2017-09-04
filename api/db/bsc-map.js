'use strict';
 function Map(){
 	this.dictionary = [
        {
            "name":"pearl-lagoon",
            "ip":"10.99.0.10"
        },
        {
            "name":"bluefields",
            "ip": "190.107.210.237"
        }
    ]
 }
 
 module.exports = {
 	retrieve: function(){
 		return new Map();
 	}
 }
