require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var song = new Spotify(keys.spotify); 
var client = new Twitter(keys.twitter);
var inputSearch = process.argv;
var songArray = [];
for (i = 3; i < inputSearch.length; i++) {
  songArray.push(inputSearch[i]);
}
var commaString = songArray.toString();
var userSong = commaString.replace(/,/g, " ");
var movieName = commaString.replace(/,/g, "-");
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

var params = { screen_name: '@dog_rates' };

var input = process.argv[2];

if (input === "my-tweets") {
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var x = 0; x < tweets.length; x++) {

        console.log("Created: " + tweets[x].created_at);
        console.log("Tweet: " + tweets[x].text);
        console.log("---------------------------------");
      }

    }

  });


}
else if (input === "spotify-this-song"){
  if (userSong === ""){
    song.search({ type: 'track', query: 'The Sign' }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
     
    console.log(data); 
    });

  }
  song.search({ type: 'track', query: userSong }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(data); 
  });
}

else if (input === "movie-this") {
  if (movieName === "") {
    request("http://www.omdbapi.com/?t=Mr.-Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("Title: " + JSON.parse(body).Title);
        console.log("This movie was made in " + JSON.parse(body).Year);
        console.log("IMBD rated this movie " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes rated this movie " + JSON.parse(body).Ratings[1].Value);
        console.log("This movie was produced in " + JSON.parse(body).Country);
        console.log("In this movie they speak " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("This movie starred " + JSON.parse(body).Actors);


      }
    })
  }
  else {
    request(queryUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        console.log("Title: " + JSON.parse(body).Title);
        console.log("This movie was made in " + JSON.parse(body).Year);
        console.log("IMBD rated this movie " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes rated this movie " + JSON.parse(body).Ratings[1].Value);
        console.log("This movie was produced in " + JSON.parse(body).Country);
        console.log("In this movie they speak " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("This movie starred " + JSON.parse(body).Actors);
        
        



      }
    })
  }
}
