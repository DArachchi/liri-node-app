
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var spotify = require("spotify");
var twitter = require("twitter");

var command = process.argv[2];
var argument = process.argv[3];
var output;

function checkCommand() {
	if (command === "do-what-it-says") {
		checkFile();
	}

	if (command === "movie-this") {
		findMovie();
	}

	if (command === "spotify-this-song") {
		findSong();
	}

	if (command === "my-tweets") {
		findTweets();
	}	
}

function checkFile() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log("Error occurred: " + err);
		}
		dataArray = data.split(",");
		command = dataArray[0];
		argument = dataArray[1];
		checkCommand();
	})
}

function findMovie() {
	var movieName = argument;

	if (movieName == null) {
		movieName = "mr+nobody";
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json";

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Country of Production: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);

			fs.appendFile("log.txt", "Title: " + JSON.parse(body).Title + " Release year: " + JSON.parse(body).Year + " IMDB Rating: " + JSON.parse(body).imdbRating + " Country of Production: " + JSON.parse(body).Country + " Language: " + JSON.parse(body).Language + " Plot: " + JSON.parse(body).Plot + " Actors: " + JSON.parse(body).Actors + " Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + " Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + ",", function(err) {
				if(err) {
					console.log(err);
				}
			})
		}
	})
}

function findSong() {
	var songName = argument;
	var resultNumber = 0;

	if (songName == null) {
		songName = "the sign";
		resultNumber = 4;
	}

	spotify.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		}
		var requestedTrack = data.tracks.items[resultNumber];
		console.log("Artist Name: " + requestedTrack.artists[0].name);
		console.log("Song Name: " + requestedTrack.name)
		console.log("Spotify Preview Link: " + requestedTrack.preview_url)
		console.log("Album Name: " + requestedTrack.album.name)

		fs.appendFile("log.txt", "Artist Name: " + requestedTrack.artists[0].name + " Song Name: " + requestedTrack.name + " Spotify Preview Link: " + requestedTrack.preview_url + " Album Name: " + requestedTrack.album.name + ",", function(err) {
			if(err) {
				console.log(err);
			}
		})

	});
}

function findTweets() {
	var client = new twitter ({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	})
	var params = {screen_name: "bhavyabhalla"};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			console.log(error);
		} else {
			for (var i=0; i<20; i++) {
				if (tweets[i]) {
					var currentTweetData = tweets[i].created_at + " " + tweets[i].text;
					console.log(currentTweetData);
					fs.appendFile("log.txt", currentTweetData + ",", function(err) {
						if(err) {
							console.log(err);
						}
					})
				}
			}
		}
	});
}

console.log("******************************");
checkCommand();