




return

await Jukebox.User.rdioLogin defer ret 
$("#info").append($("<p>Checking for user</p>"))
await Jukebox.User.create defer userinfo
if (userinfo.isNew)
	$("#info").append($("<p>Created user " + userinfo.userid + "</p>"))	
else
	$("#info").append($("<p>Found user " + userinfo.userid + "</p>"))

await Jukebox.Room.join 1, defer roominfo
$("#info").append($("<p>Joined room " + roominfo.roomid + "</p>"))
$("#info").append($("<p>Upcoming tracks: " + roominfo.tracks.join(", ") + "</p>"))


$("#search").bind "submit", (e) ->
	e.preventDefault()
	searchFor = $("#txtSearch").val()
	await Jukebox.Tracks.search searchFor, defer ret
	#console.log ret
	