Jukebox.init();

$("#createRoom").click(function() {
	if (Jukebox.rdioToken == null) {
		//You can't create a room unless you are logged in through Rdio (to play music)
		alert("You must be logged in through Rdio to create a room. Click OK to log in, then try to create again.")
		Jukebox.User.rdioLogin();
		return;
	}
	
	Jukebox.Room.create({
		name: $("#roomname").val()
	}, function(retDetails) {
		// The room has been created
		debugBox.write("created room #" + retDetails.roomid)
		joinRoom(retDetails.roomid)
	});
	
});

var joinRoom= function(roomid) {
	Jukebox.Room.join(roomid, function(room) {
		debugBox.write("joined room " + room.name)
		
		loadRoom(room);
		
	})
}

var currentPlaylist = null;

Jukebox.bind("playlistUpdated", function(data) {
	currentPlaylist = data;
	$("#upcomingtracks").empty();
	for(var x=0;x<data.length;x++) {
		var newLi = trackToLi(data[x]);
		
		var creditSpan = $("<span class='credits'> (" + data[x].credits + " credits)</span>")
		
		
		if (x ==-1) {
			$("#nowplaying").append(newLi)
		} else {
			newLi.append(creditSpan)
			$("#upcomingtracks").append(newLi)
		}
	}
})

Jukebox.bind("creditChange", function(credits) {
	$("#totalcredits").html(credits)
})

Jukebox.bind("trackChanged", function(trackid) {
	$("#nowplaying").empty();
	var existingLis = $("#upcomingtracks li");
	for (var x=0;x<existingLis.length;x++) {
		var li = $("a", existingLis[x]);
		if (li.attr("data-trackid") == trackid) {
			$("span.credits",existingLis[x]).remove()
			$("#nowplaying").append(existingLis[x])
		}
	}
})

var loadRoom = function(room){
	$("#divCreateOrJoinRoom").hide();
	$("#divRoom").show();
	
	$("#h4roomtitle").html(room.name)
}


$(document).ready(function() {
	Jukebox.Room.list(function(list) {
		$("#ulExistingRooms").empty()
		for(var x=0; x<list.length;x++) {
			if (list[x].playstatus == 1) {
				continue;
			}
			var template = "<li><a href='' data-roomid='$2'>$1</a></li>"
				.replace("$1", list[x].name)
				.replace("$2", list[x].roomid)
			
			$("#ulExistingRooms").append($(template));
		}
		
		
		
		
	})
});

$("#ulExistingRooms").delegate("a", "click", function(e) {
	e.preventDefault()
	var roomId = $(this).attr("data-roomid");
	if (Jukebox.User.currentUserId == null) {
		Jukebox.User.create(function() {
			joinRoom(roomId)
		})
	} else {
	joinRoom(roomId)
	}
})




/* Room stuff */

$("#search").bind("submit", function(e) {
	e.preventDefault()
	Jukebox.Tracks.search($("#txtSearch").val(), function(results) {
		$("#searchresults").empty();
		for(var x=0;x<results.length;x++) {
			
				
			$("#searchresults").append(trackToLi(results[x]));
		}
	})
	
})

var trackToLi = function(track) {
	var template = "<li><a href='' data-trackid='$1'><img class='albumart' src='$2'/><span>$3<span> - <span>$4</span>"
		.replace("$1", track.trackid)
		.replace("$2", track.image)
		.replace("$3", track.artist)
		.replace("$4", track.title)
	return $(template)
}


$("#searchresults, #upcomingtracks").delegate("a", "click", function(e) {
	e.preventDefault()
	Jukebox.Room.queueTrack($(this).attr("data-trackid"), function() {
		// song was successfully queued
	});
})






var debugBox = {
	tBox: null,
	init: function() {
		debugBox.tBox = $("<textarea/>");
		debugBox.tBox.css({
			position: "fixed",
			bottom:0,
			width: "100%",
			height: 150,
			left:0,
			display:"none"
		});
		
		$("body").append(debugBox.tBox)
	},
	write: function(text) {
		debugBox.tBox.val(debugBox.tBox.val() + "\n" + text);
	}
}

debugBox.init()