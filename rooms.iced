pg = require("pg")
settings = require("./settings.js") 
url = require("url")

this.join = (req,res) ->  
	settings.doGlobals req,res
	

	await pg.connect settings.pgConnectionString, defer client, err
	
	
	await client.query
		text: "SELECT COUNT(*) as rowcount FROM rooms where roomid = $1"
		values: [req.body.roomid]
	, defer err, result
	
	rowExists = result.rows[0].rowcount == 1;
	
	if (!rowExists)
		res.contentType("application/json")
		res.end JSON.stringify
			error: true
			message: "room does not exist"
	
	else
		await client.query
			text: "UPDATE users set currentroom = $1 where userid = $2"
			values: [req.body.roomid, req.jukeboxUser]
		, defer err, result
		
		if req.body.rdioToken
			await client.query
				text: "UPDATE oauth_tokens set roomid = $1 where token = $2"
				values: [req.body.roomid, req.body.rdioToken]
			, defer err, result
		
			await client.query
				text:"SELECT * from rooms where roomid = $1"
				values: [req.body.roomid]
			, defer err, roomresult
		
		
	
		await getPlaylist req.body.roomid, client, defer tracksresult
		
		req.session.currentRoomId = req.body.roomid
		playbackToken = null
		
		if roomresult.rows[0].master == parseInt(req.jukeboxUser)
		
			oa = settings.makeRdioProvider()
		
			await client.query
				text: "SELECT secret from oauth_tokens WHERE token = $1"
				values:[req.userRdioToken]
			, defer err, result
		
			await oa.getPlaybackToken req.userRdioToken, result.rows[0].secret, "localhost", defer err, rdiores
			
			console.log rdiores
			
			playbackToken = JSON.parse(rdiores).result
			
		
		res.end JSON.stringify
			error: false
			roomid: parseInt req.body.roomid
			name: roomresult.rows[0].name
			playbackToken: playbackToken
			tracks: tracksresult

getPlaylist = (roomid, db, retFunc) ->
	await db.query
		text:"SELECT *,(SELECT count(*) from playlistvotes where playlistvotes.playlistitemid = r.playlistitemid) as credits from room_playlists as r inner join tracks as t on r.trackid = t.trackid where roomid = $1 and NOT playstatus = 2 order by playstatus desc, credits desc, addeddate asc"
		values: [roomid]
	, defer err, result

	retFunc(result.rows)

this.updateCurrentTrack = (req,res)->
	settings.doGlobals req,res
	
	await settings.connectDb defer db
	
	await db.query
		text:"SELECT currentroom from users where userid = $1"
		values:[req.jukeboxUser]
	, defer err, result
	
	room = result.rows[0].currentroom
	
	await db.query
		text:"UPDATE room_playlists SET playstatus = 2 where trackid = $2 and roomid = $1"
		values:[room, req.body.oldTrack]
	, defer err, result
	
	await db.query
		text:"UPDATE room_playlists SET playstatus = 0 where playstatus = 1"
	, defer err, result
	
	await db.query
		text:"UPDATE room_playlists SET playstatus = 1 where trackid = $1 and roomid = $2"
		values:[req.body.trackid, room]
	, defer err, result
	
	await getPlaylist room, db, defer tracksresult
	
	res.end JSON.stringify tracksresult

		
this.create = (req,res) ->
	settings.doGlobals req,res
	if (!doQueryCheck(req.body,["name"]))
		res.end JSON.stringify
			error: true
			message: "correct parameters not supplied"
	
	await settings.connectDb defer db

	await db.query
		text:"INSERT INTO rooms (name, latitude, longitude) values ($1,1,1) returning roomid"
		values: [req.param("name")]
	, defer err, result
	
	newRowId = result.rows[0].roomid
	
	#res.contentType("application/json")
	res.end JSON.stringify
		name: req.param("name")
		roomid: newRowId
	
this.list = (req,res) ->
	
	settings.doGlobals req,res
	 
	await settings.connectDb defer db

	await db.query
		text:"SELECT name, roomid FROM rooms"
	, defer err, result
	
	res.end JSON.stringify result.rows
	
this.queueTrack = (req,res) ->
	settings.doGlobals req,res
	await settings.connectDb defer db
	
	trackId = req.body.trackid
	
	await db.query
		text:"SELECT totalcredits - (SELECT count(*) from playlistvotes where userid = users.userid) as creditsleft  from users where userid = $1"
		values:[req.jukeboxUser]
	, defer err, creditsResult
	
	creditsLeft = creditsResult.rows[0].creditsleft
	
	console.log creditsLeft
	
	if (creditsLeft == 0)
		res.end JSON.stringify
			success:false
			reason: "nocredits"
		return;
	
	
	await db.query
		text:"SELECT currentroom from users where userid = $1"
		values:[req.jukeboxUser]
	, defer err, result
	
	room = result.rows[0].currentroom
	
	await db.query
		text:"SELECT playlistitemid from room_playlists where trackid = $1 and roomid = $2"
		values:[trackId, room]
	, defer err, trackresult
	
	console.log err
	
	if trackresult.rows.length == 0
		await db.query
			text:"INSERT into room_playlists (roomid, trackid,addeddate) VALUES ($1,$2,$3) returning playlistitemid"
			values:[room, trackId, new Date().toISODateString()]
		, defer err, trackresult
		
		console.log err
	itemid = trackresult.rows[0].playlistitemid

	await db.query
		text:"INSERT INTO playlistvotes (userid, playlistitemid) VALUES ($1,$2)"
		values:[req.jukeboxUser, itemid]
	, defer err, trackresult


	await getPlaylist room, db, defer result

	
	res.end JSON.stringify
		success: true
		tracks: result
		credits: creditsLeft - 1
		
	await db.query
		text:"UPDATE users set creditsleft = (creditsleft - 1) WHERE userid = $1"
		values:[req.jukeboxUser]
	, defer err, donotneedthis

	
	
	
doQueryCheck = (params, fields) ->
	for par in fields
		if !params[par]
			console.log par
			return false
	return true
