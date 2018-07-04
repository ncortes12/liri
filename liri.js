require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var song = new spotify(keys.spotify); 
var client = new Twitter(keys.twitter); 


var params = {screen_name: '@Nicole48342454'};

var input  = process.argv[2];

if (input === "my-tweets"){
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          console.log(tweets);
        }
        else{console.log("working");}
      });


}
else if (input === "spotify-this-song"){
  song.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    console.log(data);
});
}
