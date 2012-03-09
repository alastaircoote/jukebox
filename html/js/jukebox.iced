jukebox =
	baseUrl:"http://localhost:3000/"
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
	
	doneExistingCheck: false
	currentUserId:null
	init: ()->
		if document.cookie.indexOf("rdioToken") > -1
			varSplit = document.cookie.split(";")
			for v in varSplit
				if v.indexOf("rdioToken") >-1
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
		
		document.cookie = "currentUserId=" + newUserId + "; expires=" + date.toGMTString() + "; path=/"	
		
		retFunc
			userid: newUserId
			isNew: true
		
	doExistingCheck: () ->
		if document.cookie.indexOf("currentUserId=") == -1
			return 
		userId = document.cookie.substr(document.cookie.indexOf("currentUserId=") + ("currentUserId=".length))
		
		#Remove following cookies
		userId = userId.split(";")[0]
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
		jukebox.trigger("playlistUpdated",ret)
		
		
	create: (opts, retFunc) ->
		if !jukebox.User.currentUserId
			await jukebox.User.create defer newUserObj
			
		await jukebox.post "room/create", {name: opts.name}, defer ret	
		retFunc ret
		
	list: (retFunc) ->
		await jukebox.get "room/list",null, defer ret

		retFunc ret
		
	queueTrack: (trackid, retFunc) ->
		await jukebox.post "room/queuetrack", {trackid: trackid}, defer ret
		
		console.log(ret)
		if (ret.success == false && ret.reason == "alreadyvoted")
			alert("You already voted for this track!")
		
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
		$('#api').bind 'ready.rdio', () ->
			jukebox.Player.playerLoaded = true
			jukebox.bind("playlistUpdated",jukebox.Player.updatePlaylist)
			jukebox.Player.changePending = true
			$(this).rdio().play(jukebox.Player.playlistData[0].trackid);
				
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
		
		
doRemote = (url, data, retFunc, t) ->
	$.ajax
		url: jukebox.baseUrl + url
		data: data
		type: t
		headers:
			"X-JukeboxUser": jukebox.User.currentUserId,
			"X-RdioToken": jukebox.rdioToken
		success: retFunc

jukebox.get = (url,data,retFunc) ->
	doRemote url, data, retFunc, "GET"

jukebox.post = (url,data,retFunc) ->
	doRemote url, data, retFunc, "POST"

window.Jukebox = jukebox