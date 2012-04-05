jukebox =
	baseUrl:"http://app.jukemob.co:3000/" 
	rdioToken:null
	init: () ->
		jukebox.User.init()
	boundFuncs: []
	bind: (ev, func) ->
		if (!jukebox.boundFuncs[ev])
			jukebox.boundFuncs[ev] = []
		
		jukebox.boundFuncs[ev].push(func)
	trigger:(ev,data) ->
		if (jukebox.boundFuncs[ev])
			for func in jukebox.boundFuncs[ev]
				func(data)
		
jukebox.User =
	currentCredits:-1
	doneExistingCheck: false
	currentUserId:null
	init: ()->
		if document.cookie.indexOf("rdioToken") > -1
			varSplit = document.cookie.split(";")
			for v in varSplit
				if v.indexOf("rdioToken") >-1
					rdio = v.split("rdioToken=")[1]
					if rdio != "undefined" && rdio != "null"
						jukebox.rdioToken = v.split("rdioToken=")[1]
					break
					
					
					
					
	create: (retFunc) ->
		if !this.doneExistingCheck
			this.doExistingCheck()
			
		if this.currentUserId
			await jukebox.post "user/checkCredits", {}, defer ret
			
			jukebox.trigger("creditChange", ret.creditsRemaining)
			
			retFunc
				userid: this.currentUserId
				isNew:false
			return 
			
		await jukebox.post "user/create", {}, defer ret
		
		jukebox.trigger("creditChange", ret.creditsRemaining)
		
		newUserId = ret.userid
		
		date = new Date()
		date.setTime(date.getTime + (30*24*60*60*1000))
		console.log ret
		document.cookie = "currentUserId=" + newUserId + "; expires=" + date.toGMTString() + "; path=/"	
		jukebox.User.currentUserId = newUserId
		
		retFunc
			userid: newUserId
			isNew: true
		
	doExistingCheck: () ->
		if document.cookie.indexOf("currentUserId=") == -1
			return 
		userId = document.cookie.substr(document.cookie.indexOf("currentUserId=") + ("currentUserId=".length))
		
		#Remove following cookies
		userId = userId.split(";")[0]
		console.log userId
		if (userId != "undefined" && typeof userId != "undefined")
			this.currentUserId = userId
	
	rdioLogin: (retFunc)->
		if window.location.search != null && window.location.search != ""
			varsSplit = window.location.search.substr(1).split("&")
			
			token = ""
			verifier = ""
			
			for v in varsSplit
				if v.indexOf("oauth_token") == 0
					token = v.replace("oauth_token=","")
				
				if v.indexOf("oauth_verifier") == 0
					verifier = v.replace("oauth_verifier=","")
				
					
				#	alert token
				
					
				
				
					
					
					
			await jukebox.post "oauthtokenswitch", {token: token, verifier: verifier}, defer ret
			
			json = ret
			
			date = new Date()
			date.setTime(date.getTime + (30*24*60*60*1000))
			document.cookie = "rdioToken=" + json.token + "; expires=" + date.toGMTString() + "; path=/"
			window.location = "/"
					
			return
		
		
		
		
		await $.post jukebox.baseUrl + "rdioauth",{returnurl:"http://" + window.location.host + "/"}, defer ret
		
		date = new Date()
		date.setTime(date.getTime + (30*24*60*60*1000))
		
		document.cookie = "rdioAccessToken=" + ret.token + "; expires=" + date.toGMTString() + "; path=/"
		
		
		
		window.location = "https://www.rdio.com/oauth/authorize?oauth_token=" + ret.token

jukebox.Room =
	currentRoomId: null,
	refreshInterval: null,
	lastTrackedVersion: null,
	currentTrackList:null,
	join: (roomid, retFunc) ->
	
		
		await jukebox.post "room/join", {roomid: roomid, rdioToken: jukebox.rdioToken}, defer ret
		asJson = ret
		this.currentRoomId = asJson.roomid
		
			
		jukebox.Player.updatePlaylist(asJson.tracks)
		jukebox.trigger("playlistUpdated",asJson.tracks)
		
		if asJson.playbackToken
			jukebox.Player.load(asJson.playbackToken)
		
		jukebox.Room.refreshInterval = setInterval(() ->
			jukebox.Room.refreshPlaylist()
		,5000)
		
		retFunc
			roomid: asJson.roomid
			tracks: asJson.tracks
			name: asJson.name
	
	refreshPlaylist: () ->
		await jukebox.post "room/getplaylist", {roomid: jukebox.Room.currentRoomId}, defer ret
		
		if jukebox.Room.lastTrackedVersion != null && ret.version != jukebox.Room.lastTrackedVersion
			alert("The JukeMob app has been updated! Press OK to reload the new version.")
			window.location.reload(true);
		
		jukebox.Room.lastTrackedVersion = ret.version
		jukebox.Room.currentTrackList = ret.tracks
		jukebox.trigger("playlistUpdated",ret.tracks)
		
		jukebox.trigger("creditChange", ret.credits)
		
		
	create: (opts, retFunc) ->
		if !jukebox.User.currentUserId
			await jukebox.User.create defer newUserObj
			
		await jukebox.post "room/create", {name: opts.name}, defer ret	
		retFunc ret
		
	list: (retFunc) ->
		await jukebox.get "room/list",null, defer ret
		retFunc ret
		
	queueTrack: (trackid, retFunc, aLink) ->
		
		if (jukebox.User.currentCredits <= 0)
			console.log aLink
			doTweet = confirm("You have no credits left! You can earn more credits by tweeting about StartupBus and JukeMob (and getting your friends to retweet you!). Do it now?")
			if (doTweet)
			
				twitMsg = "I'm using @jukemobapp to control the playlist at the NYC @startupbus demo day!"
				#twitMsg = "@jukemobapp " + twitMsg
				if (aLink)
					twitMsg += " I just queued up \"{1}\""
					hashtag = "jm81" + jukebox.User.currentUserId
					trackname = $(".subtitle",aLink).html() + " - " + $(".title",aLink).html()
					msgLen = twitMsg.length + trackname.length + hashtag.length - 1
					if (msgLen > 140)
						diff = msgLen - 140
						trackname = trackname.substr(0,trackname.length - diff - 3) + "..."
					twitMsg = twitMsg.replace("{1}",trackname)
					
			
				window.open "https://twitter.com/intent/tweet?text=" + encodeURI(twitMsg) + "&hashtags=jm81" + jukebox.User.currentUserId, "tweetwindow", "width=550,height=420"
		 
		await jukebox.post "room/queuetrack", {trackid: trackid}, defer ret
		
		console.log(ret)
		if (ret.success == false && ret.reason == "alreadyvoted")
			alert("You already voted for this track!")
		
		#if (ret.success == false && ret.reason == "nocredits")
			#alert("You have no credits left! Want more? Follow @jukemobapp and tweet about us! Then tweet @jukemobapp and give us the code '8122" + jukebox.User.currentUserId + "'")
			
		
		retFunc()
		
		jsoned = ret
		if (jsoned.tracks) 
			jukebox.trigger("playlistUpdated", jsoned.tracks)
		if (jsoned.credits)
			jukebox.trigger("creditChange", jsoned.credits)

jukebox.Tracks =
	search: (searchTerm, retFunc) ->
		await jukebox.get "tracks/search", {search: searchTerm}, defer ret
		console.log ret
		retFunc(ret)

jukebox.Player =
	playerLoaded:false
	playlistData: null
	lastPlayState:null
	currentTrackId: null
	changePending: false
	load: (playbackToken) ->
		console.log "loading rdio"
		$('#api').bind 'ready.rdio', () ->
			console.log "rdio loaded" 
			jukebox.Player.playerLoaded = true
			jukebox.bind("playlistUpdated",jukebox.Player.updatePlaylist)
			jukebox.Player.changePending = true
			
			
			$(this).rdio().play(jukebox.Player.playlistData[0].trackid);
			
			$(window).unload jukebox.Player.stopped
			
			stopP = $("<span style='display: block; float:left; background: #000000; text-transform: uppercase; font-size:12px; padding: 3px 6px'>Stop playback</span>")
			
			stopP.click jukebox.Player.stopped
			
			$("#albumstuff").append stopP
			
			if jukebox.Player.pendingData
				jukebox.Player.updatePlaylist(jukebox.Player.pendingData)
	        #$(this).rdio().play(asJson.tracks[0].trackid);
	
		$('#api').bind 'playStateChanged.rdio', (e,ps) ->
			jukebox.Player.lastPlayState = ps	
	
		$('#api').bind 'playingTrackChanged.rdio', (e,playingTrack) ->
			if playingTrack != null && playingTrack.key == jukebox.Player.currentTrackId
				console.log "sametrack"
				return;
			if !playingTrack
				console.log ["notrack", jukebox.Player.lastPlayState]
				
				if jukebox.Player.lastPlayState == 2 && jukebox.Player.currentTrackId != null
					if !jukebox.Player.changePending
						console.log ["changingto", jukebox.Player.playlistData[1]]
						jukebox.Player.changePending = true
						$(this).rdio().play(jukebox.Player.playlistData[1].trackid);

				return
				
			jukebox.Player.changePending = false
			jukebox.trigger("trackChanged",playingTrack.key)	
			
			
			$("h4").bind "click", () ->
				console.log "seeking ahead"
				$('#api').rdio().seek(playingTrack.duration - 10)
				#$("#api").rdio().next()
				
			await jukebox.post "room/updatecurrenttrack", {trackid: playingTrack.key, oldTrack: jukebox.Player.currentTrackId}, defer newTracks, d
			
			jukebox.Player.currentTrackId = playingTrack.key
			
			
			console.log [newTracks, d]
			
			jukebox.trigger("playlistUpdated",newTracks)
				
			
			
		$('#api').rdio(playbackToken)
	updatePlaylist: (playlist) ->
		console.log "playlist"
		jukebox.Player.playlistData = playlist
		
		if jukebox.Player.lastPlayState == 2
			$(this).rdio().play(playlist[0].trackid);
	stopped: () ->
		jukebox.post "room/trackisstopped", {roomid: jukebox.Room.currentRoomId}
		
		
doRemote = (url, data, retFunc, t) ->
	if window.XDomainRequest && 1 == 2
		if (data == null)
			data = {}
		data["X-JukeboxUser"] = jukebox.User.currentUserId
		data["X-RdioToken"] = jukebox.rdioToken
		dataString = []
		keys = []
		keys.push(d) for d of data
		for key in keys
			
			dataString.push key + "=" + data[key]
	
		xReq = new XDomainRequest()
		alert(t)
		xReq.onload = (ret)->
			retFunc(JSON.parse(xReq.responseText))
		if (t == "GET")
			xReq.open "get", jukebox.baseUrl + url + "?" + dataString.join("&")
			xReq.send()
		else
			xReq.open "post", jukebox.baseUrl + url
			xReq.send(dataString.join("&"))
	else
		$.ajax
			url: jukebox.baseUrl + url
			data: data
			type: t
			headers:
				"X-JukeboxUser": jukebox.User.currentUserId,
				"X-RdioToken": jukebox.rdioToken
			success: (ret) ->
				if (typeof ret == "string")
					ret = JSON.parse(ret)
				retFunc(ret)

jukebox.get = (url,data,retFunc) ->
	doRemote url, data, retFunc, "GET"

jukebox.post = (url,data,retFunc) ->
	doRemote url, data, retFunc, "POST"

window.Jukebox = jukebox


jukebox.bind "creditChange", (cred)->
	jukebox.User.currentCredits = cred
