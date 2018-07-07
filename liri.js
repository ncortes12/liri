//variavle for require npm packages
require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var song = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//user name for twitter searches
var params = { screen_name: '@dog_rates' };
//user inputs 
var input = process.argv[2];
var inputSearch = process.argv;
//formating user inputs so they can be used to search the api's
var songArray = [];
for (i = 3; i < inputSearch.length; i++) {
  songArray.push(inputSearch[i]);
}
var commaString = songArray.toString();
var userSong = commaString.replace(/,/g, " ");
var movieName = commaString.replace(/,/g, "-");
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
var y = 0;



//function to perform the twitter search
function tweets() {
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var x = 0; x < tweets.length; x++) {
        
        var tweetOutput = "\nCreated: " + tweets[x].created_at + "\n" + 
        "\nTweet: " + tweets[x].text + "\n";
        console.log(tweetOutput);
        fs.appendFile("log.txt" , tweetOutput, function(err){
          if (err) {
            console.log(err);
          }
        })
      }
    }
  });
}
//function to perform the spotify search
function spotSong() {
  song.search({ type: 'track',  query: userSong }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
    for (var y = 0; y < data.tracks.items.length; y++){
    var songOutput = "\nArtist: " + data.tracks.items[y].album.artists[0].name + "\n" + 
    "\nAlbum: " + data.tracks.items[y].album.name + "\n" + 
    "\nSong Title: " + data.tracks.items[y].name + "\n" + 
    "\nLink to song: " + data.tracks.items[y].preview_url + "\n" + 
    "---------------------------------------" + "\n";
    console.log(songOutput)
    fs.appendFile("log.txt" , songOutput, function(err){
      if (err) {
        console.log(err);
      }
    })
    }
  });
}
//function to perform the OMDB search
function movieThis() {
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var movieOutput = "\nTitle: " + JSON.parse(body).Title + "\n" + 
      "\nThis movie was made in " + JSON.parse(body).Year + "\n" + 
      "\nIMBD rated this movie " + JSON.parse(body).imdbRating + "\n" + 
      "\nRotten Tomatoes rated this movie " + JSON.parse(body).Ratings[1].Value + "\n" +
      "\nThis movie was produced in " + JSON.parse(body).Country + "\n" + 
      "\nIn this movie they speak " + JSON.parse(body).Language + "\n" + 
      "\nPlot: " + JSON.parse(body).Plot + "\n" + 
      "\nThis movie starred " + JSON.parse(body).Actors + "\n"
      console.log(movieOutput);
      fs.appendFile("log.txt" , movieOutput, function(err){
        if (err) {
          console.log(err);
        }
      })
    }
  })
}

//if else statements to evaluate user input and run correct api search
if (input === "my-tweets") {
  tweets();
}

else if (input === "spotify-this-song") {
  if (userSong === "") {
    userSong = 'The Sign';
    y=14;
    song.search({ type: 'track',  query: userSong }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      var songOutput = "\nArtist: " + data.tracks.items[y].album.artists[0].name + "\n" + 
      "\nAlbum: " + data.tracks.items[y].album.name + "\n" + 
      "\nSong Title: " + data.tracks.items[y].name + "\n" + 
      "\nLink to song: " + data.tracks.items[y].preview_url + "\n" + 
      "---------------------------------------" + "\n";
      console.log(songOutput)
      fs.appendFile("log.txt" , songOutput, function(err){
        if (err) {
          console.log(err);
        }
      })
      
    });
  }
  else {
    spotSong();
  }
}
else if (input === "movie-this") {
  if (movieName === "") {
    queryUrl = "http://www.omdbapi.com/?t=mr.-nobody&y=&plot=short&apikey=trilogy"
    movieThis();
}
  else {
    movieThis();
  }
}
//do what it says search that takes command from random.txt file
else if (input === "do-what-it-says"){
  fs.readFile("random.txt" , "utf8" ,function (error,text){
  if (error) {
    return console.log(error);
  }
  //putting random.txt file into an array
  var dataArr = text.split(",");
  console.log(dataArr);
if (dataArr[0] === "my-tweets"){
  tweets();
}
else if (dataArr[0] === "movie-this"){
  queryUrl = "http://www.omdbapi.com/?t=" + dataArr[1] + "&y=&plot=short&apikey=trilogy"; 
  movieThis();
}
else if (dataArr[0] === "spotify-this-song"){
  userSong = dataArr[1];
    spotSong();
}
})
}
