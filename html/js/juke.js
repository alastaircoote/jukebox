Jukebox.init();
$(document).ready(function() {
	setTimeout(function () {
	  window.scrollTo(0, 1);
	}, 1000);
})
if (window.location.search) {
	Jukebox.User.rdioLogin();
}

$("#create").bind("pageinit",function() {
	$("#lnkRdio").click(function(e) {
		e.preventDefault();
		Jukebox.User.rdioLogin();
	});
	
	if (Jukebox.rdioToken) {
		$("#lnkRdio").hide();
		$("#divCreateFields").show();
	}
	$("#lnkCreateRoom").click(function(e) {
		e.preventDefault();
		Jukebox.Room.create({
			name: $("#roomname").val()
		}, function(retDetails) {
			// The room has been created
			console.log(["room", retDetails])
			joinRoom(retDetails.roomid)
		});
	})
	
})




$(window).bind("scroll", function() {
	if ($(window).scrollTop() == 0) {
		$(window).scrollTop(1)
	}
})

$("#join").bind("pageshow", function() {
	$.mobile.showPageLoadingMsg();
	Jukebox.Room.list(function(list) {
		$("#ulExistingRooms").empty()
		for(var x=0; x<list.length;x++) {
			
			var template = "<li><a href='#room' data-roomid='$2'>$1</a></li>"
				.replace("$1", list[x].name)
				.replace("$2", list[x].roomid)
			
			$("#ulExistingRooms").append($(template));
		}
		$("#ulExistingRooms").listview('refresh');
		$.mobile.hidePageLoadingMsg();
		
		
		
	})
});




var joinRoom= function(roomid) {
	Jukebox.Room.join(roomid, function(room) {
		currentRoomId = room.roomid;
		$("#roomtitle").html(room.name)
		$.mobile.changePage("#room")
		console.log(["isroom",room])
		$.mobile.hidePageLoadingMsg();
	})
}

var currentRoomId = -1;

$("#room").bind("pageshow", function() {
	if (currentRoomId != -1) return;
	$.mobile.showPageLoadingMsg();
	
	if (Jukebox.User.currentUserId == null) {
		Jukebox.User.create(function() {
			joinRoom(Cookie.get("currentRoom"))
		})
	} else {
		joinRoom(Cookie.get("currentRoom"))
	}
})

Jukebox.bind("creditChange", function(credits) {
	$(".creditcount").html(credits)
})

var template = "<li data-icon='none'><a data-trackid='$5' data-playlistitemid='$6' href=''><div class='votes'>$4<img src='coin.png'/></div><img src='$3'/><div class='title'>$1</div><div class='subtitle'>$2</div></a></li>";

var trackToLi = function(track) {
	if (track.playstatus == 1) return;
	var li = $(template
			.replace("$1",track.title)
			.replace("$2",track.artist)
			.replace("$3",track.image)
			.replace("$4",track.credits)
			.replace("$5",track.trackid)
			.replace("$6", track.playlistitemid)
		);
		if (track.credits == null) {
			$("div.votes",li).remove();
		}
	return li
}


Jukebox.bind("playlistUpdated", function(data) {
	$("#ulUpcomingTracks").empty();
	if (data.length == 0) {
		return;q
	}

	$("#albumart").attr("src",data[0].image)
	$("#songtitle").html(data[0].title)
	$("#artist").html(data[0].artist)
	
	
	for(var x=1;x<data.length;x++) {
		var track = data[x]
		var li = trackToLi(track)
		
		
		
		$("#ulUpcomingTracks").append(li);
	}
	$("#ulUpcomingTracks").listview('refresh');
	
});


var searchTimeout


var doSearch = function(text) {
	console.log(text)
	if (text.length < 4) {
		alert("too short")
		return;
	}
	Jukebox.Tracks.search(text, function(results) {
		$("#ulTrackSearch").empty();
		for(var x=0;x<results.length;x++) {
			var track = results[x];
			var newTrack = trackToLi(track);
			newTrack.attr("data-icon","plus")
			$("#ulTrackSearch").append(newTrack)
			
		}
		$("#ulTrackSearch").listview('refresh');
		
	});
}

$("#join").bind("pageinit", function() {
	$("#ulExistingRooms").delegate("a","click", function() {
		Cookie.set("currentRoom",$(this).attr("data-roomid"));
	})
})


$("#room").bind("pageinit", function() {
	$("#ulUpcomingTracks").delegate("a", "click", function(e) {
		e.preventDefault();
		Jukebox.Room.queueTrack($(this).attr("data-trackid"), function(data) {
			console.log(data)
			// song was successfully queued
		});
	})
})

$("#search").bind("pageinit", function() {
	$("#ulTrackSearch").delegate("a", "click", function(e) {
		e.preventDefault();
		Jukebox.Room.queueTrack($(this).attr("data-trackid"), function() {
			$.mobile.changePage("#room",{reverse:true})
		});
	})
})


$("#search").bind("pageinit", function() {
	$("#ulTrackSearch").listview('option', 'filterCallback', function(val,test) {
		console.log ([val,test])
	})
	console.log($(".ui-input-search input"))
	$(".ui-input-search input").bind("keypress",function() {
		clearTimeout(searchTimeout);
		var text = $(this).val();
		searchTimeout = setTimeout(function() {
			doSearch(text);
		},700);
	})
})

if (Jukebox.User.currentUserId == null) {
	Jukebox.User.create(function() {
	});
}


