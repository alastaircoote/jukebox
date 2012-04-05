// Generated by IcedCoffeeScript 1.2.0j
(function() {
  var doRemote, iced, jukebox, __iced_k,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {

      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) return this.continuation(this.ret);
      };

      _Class.prototype.defer = function(defer_params) {
        var _this = this;
        ++this.count;
        return function() {
          var inner_params, _ref;
          inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (defer_params != null) {
            if ((_ref = defer_params.assign_fn) != null) {
              _ref.apply(null, inner_params);
            }
          }
          return _this._fulfill();
        };
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    }
  };
  __iced_k = function() {};

  jukebox = {
    baseUrl: "http://app.jukemob.co:3000/",
    rdioToken: null,
    init: function() {
      return jukebox.User.init();
    },
    boundFuncs: [],
    bind: function(ev, func) {
      if (!jukebox.boundFuncs[ev]) jukebox.boundFuncs[ev] = [];
      return jukebox.boundFuncs[ev].push(func);
    },
    trigger: function(ev, data) {
      var func, _i, _len, _ref, _results;
      if (jukebox.boundFuncs[ev]) {
        _ref = jukebox.boundFuncs[ev];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          func = _ref[_i];
          _results.push(func(data));
        }
        return _results;
      }
    }
  };

  jukebox.User = {
    currentCredits: -1,
    doneExistingCheck: false,
    currentUserId: null,
    init: function() {
      var rdio, v, varSplit, _i, _len, _results;
      if (document.cookie.indexOf("rdioToken") > -1) {
        varSplit = document.cookie.split(";");
        _results = [];
        for (_i = 0, _len = varSplit.length; _i < _len; _i++) {
          v = varSplit[_i];
          if (v.indexOf("rdioToken") > -1) {
            rdio = v.split("rdioToken=")[1];
            if (rdio !== "undefined" && rdio !== "null") {
              jukebox.rdioToken = v.split("rdioToken=")[1];
            }
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    create: function(retFunc) {
      var date, newUserId, ret, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      if (!this.doneExistingCheck) this.doExistingCheck();
      (function(__iced_k) {
        if (_this.currentUserId) {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
              funcname: "create"
            });
            jukebox.post("user/checkCredits", {}, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return ret = arguments[0];
                };
              })(),
              lineno: 40
            }));
            __iced_deferrals._fulfill();
          })(function() {
            jukebox.trigger("creditChange", ret.creditsRemaining);
            retFunc({
              userid: _this.currentUserId,
              isNew: false
            });
            return;
            return __iced_k();
          });
        } else {
          return __iced_k();
        }
      })(function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
            funcname: "create"
          });
          jukebox.post("user/create", {}, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return ret = arguments[0];
              };
            })(),
            lineno: 49
          }));
          __iced_deferrals._fulfill();
        })(function() {
          jukebox.trigger("creditChange", ret.creditsRemaining);
          newUserId = ret.userid;
          date = new Date();
          date.setTime(date.getTime + (30 * 24 * 60 * 60 * 1000));
          console.log(ret);
          document.cookie = "currentUserId=" + newUserId + "; expires=" + date.toGMTString() + "; path=/";
          jukebox.User.currentUserId = newUserId;
          return retFunc({
            userid: newUserId,
            isNew: true
          });
        });
      });
    },
    doExistingCheck: function() {
      var userId;
      if (document.cookie.indexOf("currentUserId=") === -1) return;
      userId = document.cookie.substr(document.cookie.indexOf("currentUserId=") + "currentUserId=".length);
      userId = userId.split(";")[0];
      console.log(userId);
      if (userId !== "undefined" && typeof userId !== "undefined") {
        return this.currentUserId = userId;
      }
    },
    rdioLogin: function(retFunc) {
      var date, json, ret, token, v, varsSplit, verifier, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        var _i, _len;
        if (window.location.search !== null && window.location.search !== "") {
          varsSplit = window.location.search.substr(1).split("&");
          token = "";
          verifier = "";
          for (_i = 0, _len = varsSplit.length; _i < _len; _i++) {
            v = varsSplit[_i];
            if (v.indexOf("oauth_token") === 0) {
              token = v.replace("oauth_token=", "");
            }
            if (v.indexOf("oauth_verifier") === 0) {
              verifier = v.replace("oauth_verifier=", "");
            }
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
              funcname: "rdioLogin"
            });
            jukebox.post("oauthtokenswitch", {
              token: token,
              verifier: verifier
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return ret = arguments[0];
                };
              })(),
              lineno: 99
            }));
            __iced_deferrals._fulfill();
          })(function() {
            json = ret;
            date = new Date();
            date.setTime(date.getTime + (30 * 24 * 60 * 60 * 1000));
            document.cookie = "rdioToken=" + json.token + "; expires=" + date.toGMTString() + "; path=/";
            window.location = "/";
            return;
            return __iced_k();
          });
        } else {
          return __iced_k();
        }
      })(function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
            funcname: "rdioLogin"
          });
          $.post(jukebox.baseUrl + "rdioauth", {
            returnurl: "http://" + window.location.host + "/"
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return ret = arguments[0];
              };
            })(),
            lineno: 113
          }));
          __iced_deferrals._fulfill();
        })(function() {
          date = new Date();
          date.setTime(date.getTime + (30 * 24 * 60 * 60 * 1000));
          document.cookie = "rdioAccessToken=" + ret.token + "; expires=" + date.toGMTString() + "; path=/";
          return window.location = "https://www.rdio.com/oauth/authorize?oauth_token=" + ret.token;
        });
      });
    }
  };

  jukebox.Room = {
    currentRoomId: null,
    refreshInterval: null,
    lastTrackedVersion: null,
    currentTrackList: null,
    join: function(roomid, retFunc) {
      var asJson, ret, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
          funcname: "join"
        });
        jukebox.post("room/join", {
          roomid: roomid,
          rdioToken: jukebox.rdioToken
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ret = arguments[0];
            };
          })(),
          lineno: 131
        }));
        __iced_deferrals._fulfill();
      })(function() {
        asJson = ret;
        _this.currentRoomId = asJson.roomid;
        jukebox.Player.updatePlaylist(asJson.tracks);
        jukebox.trigger("playlistUpdated", asJson.tracks);
        if (asJson.playbackToken) jukebox.Player.load(asJson.playbackToken);
        jukebox.Room.refreshInterval = setInterval(function() {
          return jukebox.Room.refreshPlaylist();
        }, 5000);
        return retFunc({
          roomid: asJson.roomid,
          tracks: asJson.tracks,
          name: asJson.name
        });
      });
    },
    refreshPlaylist: function() {
      var ret, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
          funcname: "refreshPlaylist"
        });
        jukebox.post("room/getplaylist", {
          roomid: jukebox.Room.currentRoomId
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ret = arguments[0];
            };
          })(),
          lineno: 153
        }));
        __iced_deferrals._fulfill();
      })(function() {
        if (jukebox.Room.lastTrackedVersion !== null && ret.version !== jukebox.Room.lastTrackedVersion) {
          alert("The JukeMob app has been updated! Press OK to reload the new version.");
          window.location.reload(true);
        }
        jukebox.Room.lastTrackedVersion = ret.version;
        jukebox.Room.currentTrackList = ret.tracks;
        jukebox.trigger("playlistUpdated", ret.tracks);
        return jukebox.trigger("creditChange", ret.credits);
      });
    },
    create: function(opts, retFunc) {
      var newUserObj, ret, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        if (!jukebox.User.currentUserId) {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
              funcname: "create"
            });
            jukebox.User.create(__iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return newUserObj = arguments[0];
                };
              })(),
              lineno: 168
            }));
            __iced_deferrals._fulfill();
          })(__iced_k);
        } else {
          return __iced_k();
        }
      })(function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
            funcname: "create"
          });
          jukebox.post("room/create", {
            name: opts.name
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                return ret = arguments[0];
              };
            })(),
            lineno: 169
          }));
          __iced_deferrals._fulfill();
        })(function() {
          return retFunc(ret);
        });
      });
    },
    list: function(retFunc) {
      var ret, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
          funcname: "list"
        });
        jukebox.get("room/list", null, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ret = arguments[0];
            };
          })(),
          lineno: 173
        }));
        __iced_deferrals._fulfill();
      })(function() {
        return retFunc(ret);
      });
    },
    queueTrack: function(trackid, retFunc, aLink) {
      var diff, doTweet, hashtag, jsoned, msgLen, ret, trackname, twitMsg, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      if (jukebox.User.currentCredits <= 0) {
        console.log(aLink);
        doTweet = confirm("You have no credits left! You can earn more credits by tweeting about StartupBus and JukeMob (and getting your friends to retweet you!). Do it now?");
        if (doTweet) {
          twitMsg = "I'm using @jukemobapp to control the playlist at the NYC @startupbus demo day!";
          if (aLink) {
            twitMsg += " I just voted up \"{1}\"";
            hashtag = "jm81" + jukebox.User.currentUserId;
            trackname = $(".subtitle", aLink).html() + " - " + $(".title", aLink).html();
            msgLen = twitMsg.length + trackname.length + hashtag.length - 1;
            if (msgLen > 140) {
              diff = msgLen - 140;
              trackname = trackname.substr(0, trackname.length - diff - 3) + "...";
            }
            twitMsg = twitMsg.replace("{1}", trackname);
          }
          window.open("https://twitter.com/intent/tweet?text=" + encodeURI(twitMsg) + "&hashtags=jm81" + jukebox.User.currentUserId, "tweetwindow", "width=550,height=420");
        }
      }
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
          funcname: "queueTrack"
        });
        jukebox.post("room/queuetrack", {
          trackid: trackid
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ret = arguments[0];
            };
          })(),
          lineno: 199
        }));
        __iced_deferrals._fulfill();
      })(function() {
        console.log(ret);
        if (ret.success === false && ret.reason === "alreadyvoted") {
          alert("You already voted for this track!");
        }
        retFunc();
        jsoned = ret;
        if (jsoned.tracks) jukebox.trigger("playlistUpdated", jsoned.tracks);
        if (jsoned.credits) return jukebox.trigger("creditChange", jsoned.credits);
      });
    }
  };

  jukebox.Tracks = {
    search: function(searchTerm, retFunc) {
      var ret, ___iced_passed_deferral, __iced_deferrals,
        _this = this;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced",
          funcname: "search"
        });
        jukebox.get("tracks/search", {
          search: searchTerm
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ret = arguments[0];
            };
          })(),
          lineno: 218
        }));
        __iced_deferrals._fulfill();
      })(function() {
        console.log(ret);
        return retFunc(ret);
      });
    }
  };

  jukebox.Player = {
    playerLoaded: false,
    playlistData: null,
    lastPlayState: null,
    currentTrackId: null,
    changePending: false,
    load: function(playbackToken) {
      console.log("loading rdio");
      $('#api').bind('ready.rdio', function() {
        var stopP;
        console.log("rdio loaded");
        jukebox.Player.playerLoaded = true;
        jukebox.bind("playlistUpdated", jukebox.Player.updatePlaylist);
        jukebox.Player.changePending = true;
        $(this).rdio().play(jukebox.Player.playlistData[0].trackid);
        $(window).unload(jukebox.Player.stopped);
        stopP = $("<span style='display: block; float:left; background: #000000; text-transform: uppercase; font-size:12px; padding: 3px 6px'>Stop playback</span>");
        stopP.click(jukebox.Player.stopped);
        $("#albumstuff").append(stopP);
        if (jukebox.Player.pendingData) {
          return jukebox.Player.updatePlaylist(jukebox.Player.pendingData);
        }
      });
      $('#api').bind('playStateChanged.rdio', function(e, ps) {
        return jukebox.Player.lastPlayState = ps;
      });
      $('#api').bind('playingTrackChanged.rdio', function(e, playingTrack) {
        var d, newTracks, ___iced_passed_deferral, __iced_deferrals,
          _this = this;
        ___iced_passed_deferral = iced.findDeferral(arguments);
        if (playingTrack !== null && playingTrack.key === jukebox.Player.currentTrackId) {
          console.log("sametrack");
          return;
        }
        if (!playingTrack) {
          console.log(["notrack", jukebox.Player.lastPlayState]);
          if (jukebox.Player.lastPlayState === 2 && jukebox.Player.currentTrackId !== null) {
            if (!jukebox.Player.changePending) {
              console.log(["changingto", jukebox.Player.playlistData[1]]);
              jukebox.Player.changePending = true;
              $(this).rdio().play(jukebox.Player.playlistData[1].trackid);
            }
          }
          return;
        }
        jukebox.Player.changePending = false;
        jukebox.trigger("trackChanged", playingTrack.key);
        $("h4").bind("click", function() {
          console.log("seeking ahead");
          return $('#api').rdio().seek(playingTrack.duration - 10);
        });
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/html/js/jukebox.iced"
          });
          jukebox.post("room/updatecurrenttrack", {
            trackid: playingTrack.key,
            oldTrack: jukebox.Player.currentTrackId
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                newTracks = arguments[0];
                return d = arguments[1];
              };
            })(),
            lineno: 279
          }));
          __iced_deferrals._fulfill();
        })(function() {
          jukebox.Player.currentTrackId = playingTrack.key;
          console.log([newTracks, d]);
          return jukebox.trigger("playlistUpdated", newTracks);
        });
      });
      return $('#api').rdio(playbackToken);
    },
    updatePlaylist: function(playlist) {
      console.log("playlist");
      jukebox.Player.playlistData = playlist;
      if (jukebox.Player.lastPlayState === 2) {
        return $(this).rdio().play(playlist[0].trackid);
      }
    },
    stopped: function() {
      return jukebox.post("room/trackisstopped", {
        roomid: jukebox.Room.currentRoomId
      });
    }
  };

  doRemote = function(url, data, retFunc, t) {
    var d, dataString, key, keys, xReq, _i, _len;
    if (window.XDomainRequest && 1 === 2) {
      if (data === null) data = {};
      data["X-JukeboxUser"] = jukebox.User.currentUserId;
      data["X-RdioToken"] = jukebox.rdioToken;
      dataString = [];
      keys = [];
      for (d in data) {
        keys.push(d);
      }
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        dataString.push(key + "=" + data[key]);
      }
      xReq = new XDomainRequest();
      alert(t);
      xReq.onload = function(ret) {
        return retFunc(JSON.parse(xReq.responseText));
      };
      if (t === "GET") {
        xReq.open("get", jukebox.baseUrl + url + "?" + dataString.join("&"));
        return xReq.send();
      } else {
        xReq.open("post", jukebox.baseUrl + url);
        return xReq.send(dataString.join("&"));
      }
    } else {
      return $.ajax({
        url: jukebox.baseUrl + url,
        data: data,
        type: t,
        headers: {
          "X-JukeboxUser": jukebox.User.currentUserId,
          "X-RdioToken": jukebox.rdioToken
        },
        success: function(ret) {
          if (typeof ret === "string") ret = JSON.parse(ret);
          return retFunc(ret);
        }
      });
    }
  };

  jukebox.get = function(url, data, retFunc) {
    return doRemote(url, data, retFunc, "GET");
  };

  jukebox.post = function(url, data, retFunc) {
    return doRemote(url, data, retFunc, "POST");
  };

  window.Jukebox = jukebox;

  jukebox.bind("creditChange", function(cred) {
    return jukebox.User.currentCredits = cred;
  });

}).call(this);
