// Generated by IcedCoffeeScript 1.2.0j
(function() {
  var doQueryCheck, getPlaylist, iced, pg, settings, url, __iced_k,
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

  pg = require("pg");

  settings = require("./settings.js");

  url = require("url");

  this.join = function(req, res) {
    var client, err, oa, playbackToken, rdiores, result, roomresult, rowExists, tracksresult, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    settings.doGlobals(req, res);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/rooms.iced",
        funcname: "join"
      });
      pg.connect(settings.pgConnectionString, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            client = arguments[0];
            return err = arguments[1];
          };
        })(),
        lineno: 11
      }));
      __iced_deferrals._fulfill();
    })(function() {
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/rooms.iced",
          funcname: "join"
        });
        client.query({
          text: "SELECT COUNT(*) as rowcount FROM rooms where roomid = $1",
          values: [req.body.roomid]
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return result = arguments[1];
            };
          })(),
          lineno: 16
        }));
        __iced_deferrals._fulfill();
      })(function() {
        rowExists = result.rows[0].rowcount === 1;
        if (!rowExists) {
          res.contentType("application/json");
          return __iced_k(res.end(JSON.stringify({
            error: true,
            message: "room does not exist"
          })));
        } else {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/rooms.iced",
              funcname: "join"
            });
            client.query({
              text: "UPDATE users set currentroom = $1 where userid = $2",
              values: [req.body.roomid, req.jukeboxUser]
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return result = arguments[1];
                };
              })(),
              lineno: 30
            }));
            __iced_deferrals._fulfill();
          })(function() {
            (function(__iced_k) {
              if (req.body.rdioToken) {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                    funcname: "join"
                  });
                  client.query({
                    text: "UPDATE oauth_tokens set roomid = $1 where token = $2",
                    values: [req.body.roomid, req.body.rdioToken]
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        return result = arguments[1];
                      };
                    })(),
                    lineno: 36
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                      funcname: "join"
                    });
                    client.query({
                      text: "SELECT * from rooms where roomid = $1",
                      values: [req.body.roomid]
                    }, __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          err = arguments[0];
                          return roomresult = arguments[1];
                        };
                      })(),
                      lineno: 43
                    }));
                    __iced_deferrals._fulfill();
                  })(__iced_k);
                });
              } else {
                return __iced_k();
              }
            })(function() {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                  funcname: "join"
                });
                getPlaylist(req.body.roomid, client, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return tracksresult = arguments[0];
                    };
                  })(),
                  lineno: 45
                }));
                __iced_deferrals._fulfill();
              })(function() {
                req.session.currentRoomId = req.body.roomid;
                playbackToken = null;
                (function(__iced_k) {
                  if (roomresult.rows[0].master === parseInt(req.jukeboxUser)) {
                    oa = settings.makeRdioProvider();
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                        funcname: "join"
                      });
                      client.query({
                        text: "SELECT secret from oauth_tokens WHERE token = $1",
                        values: [req.userRdioToken]
                      }, __iced_deferrals.defer({
                        assign_fn: (function() {
                          return function() {
                            err = arguments[0];
                            return result = arguments[1];
                          };
                        })(),
                        lineno: 57
                      }));
                      __iced_deferrals._fulfill();
                    })(function() {
                      (function(__iced_k) {
                        __iced_deferrals = new iced.Deferrals(__iced_k, {
                          parent: ___iced_passed_deferral,
                          filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                          funcname: "join"
                        });
                        oa.getPlaybackToken(req.userRdioToken, result.rows[0].secret, "localhost", __iced_deferrals.defer({
                          assign_fn: (function() {
                            return function() {
                              err = arguments[0];
                              return rdiores = arguments[1];
                            };
                          })(),
                          lineno: 59
                        }));
                        __iced_deferrals._fulfill();
                      })(function() {
                        console.log(rdiores);
                        return __iced_k(playbackToken = JSON.parse(rdiores).result);
                      });
                    });
                  } else {
                    return __iced_k();
                  }
                })(function() {
                  return __iced_k(res.end(JSON.stringify({
                    error: false,
                    roomid: parseInt(req.body.roomid),
                    name: roomresult.rows[0].name,
                    playbackToken: playbackToken,
                    tracks: tracksresult
                  })));
                });
              });
            });
          });
        }
      });
    });
  };

  getPlaylist = function(roomid, db, retFunc) {
    var err, result, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/rooms.iced",
        funcname: "getPlaylist"
      });
      db.query({
        text: "SELECT *,(SELECT count(*) from playlistvotes where playlistvotes.playlistitemid = r.playlistitemid) as credits from room_playlists as r inner join tracks as t on r.trackid = t.trackid where roomid = $1 and NOT playstatus = 2 order by playstatus desc, credits desc, addeddate asc",
        values: [roomid]
      }, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            err = arguments[0];
            return result = arguments[1];
          };
        })(),
        lineno: 77
      }));
      __iced_deferrals._fulfill();
    })(function() {
      return retFunc(result.rows);
    });
  };

  this.updateCurrentTrack = function(req, res) {
    var db, err, result, room, tracksresult, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    settings.doGlobals(req, res);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/rooms.iced",
        funcname: "updateCurrentTrack"
      });
      settings.connectDb(__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return db = arguments[0];
          };
        })(),
        lineno: 84
      }));
      __iced_deferrals._fulfill();
    })(function() {
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/rooms.iced",
          funcname: "updateCurrentTrack"
        });
        db.query({
          text: "SELECT currentroom from users where userid = $1",
          values: [req.jukeboxUser]
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return result = arguments[1];
            };
          })(),
          lineno: 89
        }));
        __iced_deferrals._fulfill();
      })(function() {
        room = result.rows[0].currentroom;
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/rooms.iced",
            funcname: "updateCurrentTrack"
          });
          db.query({
            text: "UPDATE room_playlists SET playstatus = 2 where trackid = $2 and roomid = $1",
            values: [room, req.body.oldTrack]
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return result = arguments[1];
              };
            })(),
            lineno: 96
          }));
          __iced_deferrals._fulfill();
        })(function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/rooms.iced",
              funcname: "updateCurrentTrack"
            });
            db.query({
              text: "UPDATE room_playlists SET playstatus = 0 where playstatus = 1"
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return result = arguments[1];
                };
              })(),
              lineno: 100
            }));
            __iced_deferrals._fulfill();
          })(function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                funcname: "updateCurrentTrack"
              });
              db.query({
                text: "UPDATE room_playlists SET playstatus = 1 where trackid = $1 and roomid = $2",
                values: [req.body.trackid, room]
              }, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    err = arguments[0];
                    return result = arguments[1];
                  };
                })(),
                lineno: 105
              }));
              __iced_deferrals._fulfill();
            })(function() {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                  funcname: "updateCurrentTrack"
                });
                getPlaylist(room, db, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      return tracksresult = arguments[0];
                    };
                  })(),
                  lineno: 107
                }));
                __iced_deferrals._fulfill();
              })(function() {
                return res.end(JSON.stringify(tracksresult));
              });
            });
          });
        });
      });
    });
  };

  this.create = function(req, res) {
    var db, err, newRowId, result, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    settings.doGlobals(req, res);
    if (!doQueryCheck(req.body, ["name"])) {
      res.end(JSON.stringify({
        error: true,
        message: "correct parameters not supplied"
      }));
    }
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/rooms.iced",
        funcname: "create"
      });
      settings.connectDb(__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return db = arguments[0];
          };
        })(),
        lineno: 119
      }));
      __iced_deferrals._fulfill();
    })(function() {
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/rooms.iced",
          funcname: "create"
        });
        db.query({
          text: "INSERT INTO rooms (name, latitude, longitude) values ($1,1,1) returning roomid",
          values: [req.param("name")]
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return result = arguments[1];
            };
          })(),
          lineno: 124
        }));
        __iced_deferrals._fulfill();
      })(function() {
        newRowId = result.rows[0].roomid;
        return res.end(JSON.stringify({
          name: req.param("name"),
          roomid: newRowId
        }));
      });
    });
  };

  this.list = function(req, res) {
    var db, err, result, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    settings.doGlobals(req, res);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/rooms.iced",
        funcname: "list"
      });
      settings.connectDb(__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return db = arguments[0];
          };
        })(),
        lineno: 137
      }));
      __iced_deferrals._fulfill();
    })(function() {
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/rooms.iced",
          funcname: "list"
        });
        db.query({
          text: "SELECT name, roomid FROM rooms"
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return result = arguments[1];
            };
          })(),
          lineno: 141
        }));
        __iced_deferrals._fulfill();
      })(function() {
        return res.end(JSON.stringify(result.rows));
      });
    });
  };

  this.queueTrack = function(req, res) {
    var creditsLeft, creditsResult, db, donotneedthis, err, itemid, result, room, trackId, trackresult, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    settings.doGlobals(req, res);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/rooms.iced",
        funcname: "queueTrack"
      });
      settings.connectDb(__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return db = arguments[0];
          };
        })(),
        lineno: 147
      }));
      __iced_deferrals._fulfill();
    })(function() {
      trackId = req.body.trackid;
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/rooms.iced",
          funcname: "queueTrack"
        });
        db.query({
          text: "SELECT totalcredits - (SELECT count(*) from playlistvotes where userid = users.userid) as creditsleft  from users where userid = $1",
          values: [req.jukeboxUser]
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return creditsResult = arguments[1];
            };
          })(),
          lineno: 154
        }));
        __iced_deferrals._fulfill();
      })(function() {
        creditsLeft = creditsResult.rows[0].creditsleft;
        console.log(creditsLeft);
        if (creditsLeft === 0) {
          res.end(JSON.stringify({
            success: false,
            reason: "nocredits"
          }));
          return;
        }
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/rooms.iced",
            funcname: "queueTrack"
          });
          db.query({
            text: "SELECT currentroom from users where userid = $1",
            values: [req.jukeboxUser]
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return result = arguments[1];
              };
            })(),
            lineno: 170
          }));
          __iced_deferrals._fulfill();
        })(function() {
          room = result.rows[0].currentroom;
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/rooms.iced",
              funcname: "queueTrack"
            });
            db.query({
              text: "SELECT playlistitemid from room_playlists where trackid = $1 and roomid = $2",
              values: [trackId, room]
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return trackresult = arguments[1];
                };
              })(),
              lineno: 177
            }));
            __iced_deferrals._fulfill();
          })(function() {
            console.log(err);
            (function(__iced_k) {
              if (trackresult.rows.length === 0) {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                    funcname: "queueTrack"
                  });
                  db.query({
                    text: "INSERT into room_playlists (roomid, trackid,addeddate) VALUES ($1,$2,$3) returning playlistitemid",
                    values: [room, trackId, new Date().toISODateString()]
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        return trackresult = arguments[1];
                      };
                    })(),
                    lineno: 185
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  return __iced_k(console.log(err));
                });
              } else {
                return __iced_k();
              }
            })(function() {
              itemid = trackresult.rows[0].playlistitemid;
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                  funcname: "queueTrack"
                });
                db.query({
                  text: "INSERT INTO playlistvotes (userid, playlistitemid) VALUES ($1,$2)",
                  values: [req.jukeboxUser, itemid]
                }, __iced_deferrals.defer({
                  assign_fn: (function() {
                    return function() {
                      err = arguments[0];
                      return trackresult = arguments[1];
                    };
                  })(),
                  lineno: 194
                }));
                __iced_deferrals._fulfill();
              })(function() {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                    funcname: "queueTrack"
                  });
                  getPlaylist(room, db, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        return result = arguments[0];
                      };
                    })(),
                    lineno: 197
                  }));
                  __iced_deferrals._fulfill();
                })(function() {
                  res.end(JSON.stringify({
                    success: true,
                    tracks: result,
                    credits: creditsLeft - 1
                  }));
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "/Users/alastair/Projects/jukebox/rooms.iced",
                    funcname: "queueTrack"
                  });
                  db.query({
                    text: "UPDATE users set creditsleft = (creditsleft - 1) WHERE userid = $1",
                    values: [req.jukeboxUser]
                  }, __iced_deferrals.defer({
                    assign_fn: (function() {
                      return function() {
                        err = arguments[0];
                        return donotneedthis = arguments[1];
                      };
                    })(),
                    lineno: 210
                  }));
                  __iced_deferrals._fulfill();
                });
              });
            });
          });
        });
      });
    });
  };

  doQueryCheck = function(params, fields) {
    var par, _i, _len;
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      par = fields[_i];
      if (!params[par]) {
        console.log(par);
        return false;
      }
    }
    return true;
  };

}).call(this);
