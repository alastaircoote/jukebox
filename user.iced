pg = require("pg")
settings = require("./settings.js")

this.create = (req,res) ->
	settings.doGlobals req,res
	await settings.connectDb defer db
	await db.query
		text:"INSERT INTO users (totalcredits) VALUES (20) returning userid"
	, defer err, result
	
	console.log(result)
	
	res.end JSON.stringify
		error: false,
		userid: result.rows[0].userid,
		creditsRemaining: 20
		
this.checkCredits = (req,res) ->
	settings.doGlobals req,res
	await settings.connectDb defer db
	await db.query
		text:"SELECT totalcredits - (SELECT count(*) from playlistvotes where userid = users.userid) as creditsleft  from users where userid = $1"
		values:[req.jukeboxUser]
	, defer err, result
	
	res.end JSON.stringify
	 	creditsRemaining: result.rows[0].creditsleft