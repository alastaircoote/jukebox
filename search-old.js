var url = require("url");
var http = require("http");

var echoNestApiKey = "3QUQOE6XTIZ6BFUL5";



this.artist = function(req,response) {
	
	var searchName = url.parse(req.url,true).query.name;

	fetchUrlAndPipe({
			host:"developer.echonest.com",
			path: "/api/v4/song/search?api_key=" + echoNestApiKey + "&sort=artist_familiarity-desc&title=" + encodeURIComponent(searchName),
			port:80,
			method:"GET"
	},response);

}


var fetchUrlAndPipe = function(urlobj, response) {
	var serverReq = http.request(urlobj, function(res) {

		var chunkData = []

		res.on("data", function(chunk){
			//chunkData.push(chunk);
			response.write(chunk);
		});
		res.on("end", function() {
///			response.end(chunkData.join(""));
			response.end();
		})
	});
	
	serverReq.end();
}