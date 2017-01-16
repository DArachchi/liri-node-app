
var fs = require("fs");
var request = require("request");
var spotify = require("spotify");
var twitter = require("twitter");

var command = process.argv[2];
var argument = process.argv[3];

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

	});
}

function findTweets() {

}

console.log("******************************");
checkCommand();