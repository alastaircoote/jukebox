var tracks = require("./tracks.js");
var express = require("express");
var rooms = require("./rooms.js");
var user = require("./user.js");
var settings = require("./settings.js");

Date.prototype.toISODateString = function(){
	var d = this;
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'};


var app = express.createServer();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "keyboard cat" }));

app.post("/room/join", rooms.join);
app.post("/room/create", rooms.create);
app.get("/room/list", rooms.list);
app.post("/room/queuetrack", rooms.queueTrack); 
app.post("/room/updatecurrenttrack", rooms.updateCurrentTrack); 
app.post("/user/checkCredits", user.checkCredits);
app.post("/user/create", user.create);

app.get("/tracks/search", tracks.search);

app.post("/rdioauth", settings.oauthStart)

app.post("/oauthtokenswitch", settings.oauthAccessSwitch)

app.options(/.*/, function(req,res){
	settings.doGlobals(req,res)
	res.end(null)
})

app.listen(3000);