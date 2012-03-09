// Generated by IcedCoffeeScript 1.2.0j
(function() {
  var echoNestApiKey, http, iced, oauth, pg, processTracks, rdio, settings, __iced_k,
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

  http = require("http");

  settings = require("./settings.js");

  oauth = require("node-oauth").OAuth;

  pg = require("pg");

  echoNestApiKey = "3QUQOE6XTIZ6BFUL5";

  rdio = require('rdio')({
    rdio_api_key: "4bmgdzt2b27qbktxr4kseyn4",
    rdio_api_shared: "8U757b9eWC",
    callback_url: "http://localhost:8000"
  });

  this.search = function(req, res) {
    var db, err, result, results, retString, secret, toSendBack, token, track, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    settings.doGlobals(req, res);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/tracks.iced",
        funcname: "search"
      });
      settings.connectDb(__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return db = arguments[0];
          };
        })(),
        lineno: 19
      }));
      __iced_deferrals._fulfill();
    })(function() {
      (function(__iced_k) {
        if (settings.useOffline) {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/tracks.iced",
              funcname: "search"
            });
            db.query({
              text: "SELECT key, data from offlinedata where key = $1",
              values: ["savedSearches_" + req.param("search")]
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return result = arguments[1];
                };
              })(),
              lineno: 25
            }));
            __iced_deferrals._fulfill();
          })(function() {
            console.log(result);
            if (result.rows.length === 1) {
              res.end(result.rows[0].data);
              return;
            }
            return __iced_k();
          });
        } else {
          return __iced_k();
        }
      })(function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/tracks.iced",
            funcname: "search"
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
            lineno: 37
          }));
          __iced_deferrals._fulfill();
        })(function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/tracks.iced",
              funcname: "search"
            });
            db.query({
              text: "SELECT token, secret from oauth_tokens where roomid = $1",
              values: [result.rows[0].currentroom]
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return result = arguments[1];
                };
              })(),
              lineno: 43
            }));
            __iced_deferrals._fulfill();
          })(function() {
            secret = result.rows[0].secret;
            token = result.rows[0].token;
            console.log([token, secret]);
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/alastair/Projects/jukebox/tracks.iced",
                funcname: "search"
              });
              rdio.api(token, secret, {
                method: "searchSuggestions",
                query: req.param("search"),
                types: "Track"
              }, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    err = arguments[0];
                    return results = arguments[1];
                  };
                })(),
                lineno: 51
              }));
              __iced_deferrals._fulfill();
            })(function() {
              var _i, _len, _ref;
              toSendBack = [];
              _ref = JSON.parse(results).result;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                track = _ref[_i];
                console.log(track.canStream);
                if (track.canStream === false) continue;
                toSendBack.push({
                  artist: track.artist,
                  image: track.icon,
                  title: track.name,
                  trackid: track.key
                });
              }
              retString = JSON.stringify(toSendBack);
              (function(__iced_k) {
                if (settings.useOffline) {
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "/Users/alastair/Projects/jukebox/tracks.iced",
                      funcname: "search"
                    });
                    db.query({
                      text: "INSERT INTO offlinedata (key, data) VALUES($1,$2)",
                      values: ["savedSearches_" + req.param("search"), retString]
                    }, __iced_deferrals.defer({
                      assign_fn: (function() {
                        return function() {
                          err = arguments[0];
                          return result = arguments[1];
                        };
                      })(),
                      lineno: 70
                    }));
                    __iced_deferrals._fulfill();
                  })(__iced_k);
                } else {
                  return __iced_k();
                }
              })(function() {
                res.end(retString);
                return processTracks(JSON.parse(results).result, db);
              });
            });
          });
        });
      });
    });
  };

  processTracks = function(tracks, db) {
    var allrows, err, existing, fields, result, row, sqlString, track, values, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    allrows = [];
    existing = [];
    (function(__iced_k) {
      var _i, _len, _ref, _results, _while;
      _ref = tracks;
      _len = _ref.length;
      _i = 0;
      _results = [];
      _while = function(__iced_k) {
        var _break, _continue, _next;
        _break = function() {
          return __iced_k(_results);
        };
        _continue = function() {
          ++_i;
          return _while(__iced_k);
        };
        _next = function(__iced_next_arg) {
          _results.push(__iced_next_arg);
          return _continue();
        };
        if (!(_i < _len)) {
          return _break();
        } else {
          track = _ref[_i];
          allrows.push(track.key);
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/tracks.iced",
              funcname: "processTracks"
            });
            db.query({
              text: "SELECT trackid FROM tracks where trackid in ('" + existing.join("','") + "')"
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return result = arguments[1];
                };
              })(),
              lineno: 86
            }));
            __iced_deferrals._fulfill();
          })(function() {
            var _j, _len2, _ref2;
            _ref2 = result.rows;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              row = _ref2[_j];
              existing.push(row.trackid);
            }
            return _next();
          });
        }
      };
      _while(__iced_k);
    })(function() {
      (function(__iced_k) {
        var _i, _len, _ref, _results, _while;
        _ref = tracks;
        _len = _ref.length;
        _i = 0;
        _results = [];
        _while = function(__iced_k) {
          var _break, _continue, _next;
          _break = function() {
            return __iced_k(_results);
          };
          _continue = function() {
            ++_i;
            return _while(__iced_k);
          };
          _next = function(__iced_next_arg) {
            _results.push(__iced_next_arg);
            return _continue();
          };
          if (!(_i < _len)) {
            return _break();
          } else {
            track = _ref[_i];
            (function(__iced_k) {
              if (existing.indexOf(track.key) > -1) {
                (function(__iced_k) {
                  _continue();
                })(__iced_k);
              } else {
                return __iced_k();
              }
            })(function() {
              sqlString = "INSERT INTO tracks (trackid,title,artist,image,length) VALUES ($1,$2,$3,$4,$5)";
              fields = [track.key, track.name, track.artist, track.icon, track.duration];
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/alastair/Projects/jukebox/tracks.iced",
                  funcname: "processTracks"
                });
                db.query({
                  text: sqlString
                }, values = fields, __iced_deferrals.defer({
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
                return _next(console.log(err));
              });
            });
          }
        };
        _while(__iced_k);
      })(function() {
        return console.log("done");
      });
    });
  };

}).call(this);
