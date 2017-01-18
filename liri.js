
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
			output = "Title: " + JSON.parse(body).Title + "\r\nRelease year: " + JSON.parse(body).Year + "\r\nIMDB Rating: " + JSON.parse(body).imdbRating + "\r\nCountry of Production: " + JSON.parse(body).Country + "\r\nLanguage: " + JSON.parse(body).Language + "\r\nPlot: " + JSON.parse(body).Plot + "\r\nActors: " + JSON.parse(body).Actors + "\r\nRotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + "\r\nRotten Tomatoes URL: " + JSON.parse(body).tomatoURL;

			outputData();
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
		output = "Artist Name: " + requestedTrack.artists[0].name + "\r\nSong Name: " + requestedTrack.name + "\r\nSpotify Preview Link: " + requestedTrack.preview_url + "\r\nAlbum Name: " + requestedTrack.album.name + ",";

		outputData();

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
			output = "";
			for (var i=0; i<20; i++) {
				if (tweets[i]) {
					var currentTweetData = tweets[i].created_at + " " + tweets[i].text + "\r\n";
					output = output + currentTweetData;
				}
			}
			outputData();
		}
	});
}

function outputData() {
	console.log(output);

	fs.appendFile("log.txt", output + ",\r\n", function(err) {
		if(err) {
			console.log(err);
		}
	})
}

console.log("******************************");
checkCommand();