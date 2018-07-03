require("dotenv").config();
var spotify = new Spotify(keys.spotify); 
var client = new Twitter(keys.twitter); 

var input  = process.argv[2];
