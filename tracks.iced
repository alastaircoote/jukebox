http = require("http");
settings = require("./settings.js")
oauth = require("node-oauth").OAuth
pg = require("pg")

echoNestApiKey = "3QUQOE6XTIZ6BFUL5";

rdio = require('rdio')({
	rdio_api_key: "4bmgdzt2b27qbktxr4kseyn4",
	rdio_api_shared: "8U757b9eWC",
	callback_url: "http://localhost:8000"
})
 

this.search = (req,res) ->
	settings.doGlobals(req,res)
	
	await settings.connectDb defer db
	
	if(settings.useOffline)
		await db.query
			text:"SELECT key, data from offlinedata where key = $1"
			values: ["savedSearches_" + req.param("search")]
		, defer err, result
		
		console.log(result)
		
		if (result.rows.length == 1)
			res.end result.rows[0].data
			return
		
	await db.query
		text:"SELECT currentroom from users where userid = $1"
		values: [req.jukeboxUser]
	, defer err, result

	
	await db.query
		text:"SELECT token, secret from oauth_tokens where roomid = $1"
		values: [result.rows[0].currentroom]
	, defer err, result
	
	
	secret = result.rows[0].secret
	token = result.rows[0].token
	
	console.log [token, secret]

	
	await rdio.api token, secret, {method:"searchSuggestions", query: req.param("search"), types:"Track"}, defer err, results
		
	toSendBack = []
	for track in JSON.parse(results).result
		console.log track.canStream
		if (track.canStream == false) 
			continue
		toSendBack.push
			artist: track.artist
			image: track.icon
			title: track.name
			trackid: track.key
		
	retString = JSON.stringify toSendBack
			
	if(settings.useOffline)
		await db.query
			text:"INSERT INTO offlinedata (key, data) VALUES($1,$2)"
			values: ["savedSearches_" + req.param("search"), retString]
		, defer err, result
			
	res.end retString
	
	processTracks(JSON.parse(results).result,db)


processTracks = (tracks,db) ->
	
	allrows = []
	existing = []
	for track in tracks
		allrows.push(track.key)
		
		await db.query
			text:"SELECT trackid FROM tracks where trackid in ('" + existing.join("','") + "')"
		, defer err, result	
		
		for row in result.rows
			existing.push row.trackid
		
		
	
	for track in tracks
		if existing.indexOf(track.key) > -1
			continue
			
		sqlString = "INSERT INTO tracks (trackid,title,artist,image,length) VALUES ($1,$2,$3,$4,$5)"
		
		
		fields = [track.key, track.name,track.artist,track.icon,track.duration]
		
		await db.query
			text:sqlString
			values = fields
		, defer err, result
		
		console.log err
		# '" + fields.join("','") + "'" + "," + track.length
	
	console.log "done"

	
	
	
	#rdio.post "http://api.rdio.com/1/", req.userRdioToken, secret,"method=getPlaybackToken","application/x-www-form-urlencoded", (err, data) ->
	#	console.log "success"
	#	console.log(err)
	
	
	