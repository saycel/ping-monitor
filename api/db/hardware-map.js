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
            "name":"saycel",
            "acc": "385485876"
        },


    ]
 }
 
 module.exports = {
 	retrieve: function(){
 		return new Map();
 	}
 }

