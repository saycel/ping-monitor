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
        },
	{
	    "name":"research",
	    "ip":"10.99.0.7"
	}
    ]
 }
 
 module.exports = {
 	retrieve: function(){
 		return new Map();
 	}
 }
