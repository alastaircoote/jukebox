var orientationchange = function() {
	window.scrollTo(0, 0);
}


window.onorientationchange = orientationchange;


if (window.devicePixelRatio && window.innerHeight < 460) {
	$("#addasapp").show();
	$("#actualapp").hide();
	window.scrollTo(0, 0);
	$("body").bind("touchstart", function(e) {
	//	e.preventDefault();
	})
}

/*$("body").bind("touchmove", function(e) {
	
	e.preventDefault();
	//e.stopPropagation();
})

$("ul[data-role='listview']").css({
	height:"300",
	"-webkit-overflow-scrolling": "touch"
})

var isListView = false
$("div[data-role='page']").bind("touchmove", function(e) {
	e.stopPropagation();
})
*/
 
Jukebox.init();
$(document).ready(function() {
	setTimeout(function () {
	//  window.scrollTo(0, 1);
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
	//	$(window).scrollTop(1)
	}
})

$("#join").bind("pageshow", function() {
	$.mobile.showPageLoadingMsg();
	Jukebox.Room.list(function(list) {
		$("#ulExistingRooms").empty()
		if (typeof list == "string") list = JSON.parse(list)
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
		$.mobile.hidePageLoadingMsg();
	})
}

var currentRoomId = -1;

$("#join").bind("pageshow", function() {
	currentRoomId = -1;
})

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

var lastCreditCount = 10000;

Jukebox.bind("creditChange", function(credits) {
	$(".creditcount").html(credits)
	if (credits > lastCreditCount) {
		alert("Whoa! You got more credits. Way to go, buddy.")
	}
	lastCreditCount = credits;
})

var template = "<li data-icon='$7'><a data-trackid='$5' data-objtype='$8' data-playlistitemid='$6' href=''><div class='votes'>$4<img src='coin.png'/></div><img src='$3'/><div class='title'>$1</div><div class='subtitle'>$2</div></a></li>";

var trackToLi = function(track) {
	if (track.playstatus == 1) return;
	
		var thisInstance = template
				.replace("$1",track.title)
				.replace("$3",track.image)
				.replace("$4",track.credits)
				.replace("$5",track.trackid)
				.replace("$6", track.playlistitemid)
				//.replace("$7","arrow-r")
				.replace("$8",track.type)
		if (track.type != "r") {
			thisInstance = thisInstance.replace("$2",track.artist)
		} else {
			thisInstance = thisInstance.replace("$2","Artist")
		}
		
		var li = $(thisInstance);
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
	if (data[0].playstatus != 1) {
		$("#songtitle").html("PAUSED");
		$("#artist").html("")
	} else {
		$("#songtitle").html(data[0].title)
		$("#artist").html(data[0].artist)
	}
	
	for(var x=1;x<data.length;x++) {
		var track = data[x]
		var li = trackToLi(track)
		
		
		
		$("#ulUpcomingTracks").append(li);
	}
	$("#ulUpcomingTracks").listview('refresh');
	
});


var searchTimeout


var doSearch = function(text) {
	if (text.length == 1) {
		return;
	}
	if (text.length < 4) {
	//	alert("too short")
	//	return;
	}
	Jukebox.Tracks.search(text, function(results) {
		$("#ulTrackSearch").empty();
		for(var x=0;x<results.length;x++) {
			var track = results[x];
			var newTrack = trackToLi(track);
			if (newTrack.attr("data-icon") == "") {
				newTrack.attr("data-icon","plus")
			} 
			$("#ulTrackSearch").append(newTrack)
			
		}
		$("#ulTrackSearch").listview('refresh');
		
	});
}

$("#join").bind("pageinit", function() {
	$("#ulExistingRooms").delegate("a","tap", function() {

		Cookie.set("currentRoom",$(this).attr("data-roomid"));
	})
})

var shownInstructions = false;

$("#room").bind("pageshow", function() {
		if (shownInstructions) return;
	
	alert("Welcome to the JukeMob room! Tap a track already in the queue to donate a credit and move it up the queue, or click the 'add' button to choose your own song.")
	shownInstructions = true;
})



$("#room").bind("pageinit", function() {
	$("#ulUpcomingTracks").delegate("a", "click", function(e) {
		e.preventDefault();
		$.mobile.showPageLoadingMsg();
		Jukebox.Room.queueTrack($(this).attr("data-trackid"), function(data) {
			// song was successfully queued
			$.mobile.hidePageLoadingMsg();
		},$(this));
	})
})

$("#search").bind("pageinit", function() {
	$("#ulTrackSearch").delegate("a", "click", function(e) {
		e.preventDefault();
		$.mobile.showPageLoadingMsg();
		if ($(this).attr("data-objtype") == "r") {
			Jukebox.Tracks.searchAlbums($(this).attr("data-trackid"), function(results) {
				
			});
			return;
		}
		Jukebox.Room.queueTrack($(this).attr("data-trackid"), function() {
			$.mobile.changePage("#room",{reverse:true})
			$.mobile.hidePageLoadingMsg();
		},$(this));
	})
})

$("#search").bind("pagebeforeshow", function() {
	$("#ulTrackSearch").empty();
	$(".ui-input-search input").val("");
})


$("#search").bind("pageinit", function() {

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


