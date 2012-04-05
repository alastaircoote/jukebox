pg = require("pg")
url = require("url")
oauth = require("node-oauth").OAuth

self = this
this.useOffline = true

this.pgConnectionString = "tcp://jukeuser:juke@127.0.0.1/jukebox"

this.version = 1.1;


this.connectDb = (ret) =>
	await pg.connect this.pgConnectionString, defer client, err
	
	if err
		console.log err
	else
		ret client

this.doGlobals = (req,ret) ->
	ret.header("Access-Control-Allow-Origin","*")
	ret.header("Access-Control-Allow-Headers", "X-JukeboxUser, X-RdioToken")
	if  req.header("X-RdioToken") != 'null'
		req.userRdioToken = req.header("X-RdioToken")
	if req.param("X-RdioToken") != null &&  req.param("X-RdioToken") != "null"
		req.userRdioToken = req.param "X-RdioToken"
		
	req.jukeboxUser = req.header("X-JukeboxUser")
	
	if req.param("X-JukeboxUser") != null
		req.jukeboxUser = req.param "X-JukeboxUser"
	
	ret.contentType("application/json")
	
this.oauthStart = (req,res) =>
	self.doGlobals(req,res)
	
	oa= self.makeRdioProvider()
	

	#await oa.getOAuthRequestToken {oauth_callback: req.body.returnurl }, defer e,d,f
	
	await oa.getRequestToken defer err, key, secret

	
	await this.connectDb defer client
	
	await client.query
		text: "DELETE FROM oauth_tokens WHERE token = $1"
		values:[key]
	, defer err, result
	
	await client.query
		text: "INSERT INTO oauth_tokens (token,secret) values($1,$2)"
		values:[key,secret]
	, defer err, result
	
	res.end JSON.stringify
		token: key
	#oa.post "http://api.rdio.com/oauth/request_token?oauth_callback=oob", null, null,null, (e,d) ->
	#	console.log [e,d]

this.oauthAccessSwitch = (req,res) ->
	self.doGlobals(req,res)
	oa = self.makeRdioProvider()
	
	
	await self.connectDb defer client
	
	await client.query
		text: "SELECT secret from oauth_tokens WHERE token = $1"
		values:[req.body.token]
	, defer err, result
	
#	console.log])
	
	console.log [req.body.token, result.rows[0].secret, req.body.verifier]
	
	
	await oa.getAccessToken req.body.token, result.rows[0].secret, req.body.verifier, defer r,t,y
	
	console.log([r,t,y])
	
	await client.query
		text: "INSERT INTO oauth_tokens (token,secret) values($1,$2)"
		values:[t,y]
	, defer err, result
	
	console.log [err, result]
	
	
	res.end JSON.stringify
		token: t

	
this.makeRdioProvider = () ->
	return require('rdio')({
		rdio_api_key: "4bmgdzt2b27qbktxr4kseyn4",
		rdio_api_shared: "8U757b9eWC",
		callback_url: "http://app.jukemob.co/"
	},oauth)
	

this.getPlaybackToken = () ->
	self.doGlobals(req,res)

	oa = self.makeRdioProvider()
	
	await client.query
		text: "SELECT secret from oauth_tokens WHERE token = $1"
		values:[req.userRdioToken]
	, defer err, result
	
	console.log req.url
#	oa.getPlaybackToken token, secret
	
this.userRoomMaps = []
	