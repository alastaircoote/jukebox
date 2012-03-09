// Generated by IcedCoffeeScript 1.2.0j
(function() {
  var iced, oauth, pg, self, url, __iced_k,
    __slice = [].slice,
    _this = this;

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

  url = require("url");

  oauth = require("node-oauth").OAuth;

  self = this;

  this.useOffline = true;

  this.pgConnectionString = "tcp://jukeuser:juke@127.0.0.1/jukebox";

  this.connectDb = function(ret) {
    var client, err, ___iced_passed_deferral, __iced_deferrals;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/settings.iced",
        funcname: "connectDb"
      });
      pg.connect(_this.pgConnectionString, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            client = arguments[0];
            return err = arguments[1];
          };
        })(),
        lineno: 12
      }));
      __iced_deferrals._fulfill();
    })(function() {
      if (err) {
        return console.log(err);
      } else {
        return ret(client);
      }
    });
  };

  this.doGlobals = function(req, ret) {
    ret.header("Access-Control-Allow-Origin", "*");
    ret.header("Access-Control-Allow-Headers", "X-JukeboxUser, X-RdioToken");
    req.userRdioToken = req.header("X-RdioToken");
    req.jukeboxUser = req.header("X-JukeboxUser");
    return ret.contentType("application/json");
  };

  this.oauthStart = function(req, res) {
    var client, err, key, oa, result, secret, ___iced_passed_deferral, __iced_deferrals;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    self.doGlobals(req, res);
    oa = self.makeRdioProvider();
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/settings.iced",
        funcname: "oauthStart"
      });
      oa.getRequestToken(__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            err = arguments[0];
            key = arguments[1];
            return secret = arguments[2];
          };
        })(),
        lineno: 37
      }));
      __iced_deferrals._fulfill();
    })(function() {
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/settings.iced",
          funcname: "oauthStart"
        });
        _this.connectDb(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return client = arguments[0];
            };
          })(),
          lineno: 39
        }));
        __iced_deferrals._fulfill();
      })(function() {
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/settings.iced",
            funcname: "oauthStart"
          });
          client.query({
            text: "DELETE FROM oauth_tokens WHERE token = $1",
            values: [key]
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return result = arguments[1];
              };
            })(),
            lineno: 44
          }));
          __iced_deferrals._fulfill();
        })(function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/settings.iced",
              funcname: "oauthStart"
            });
            client.query({
              text: "INSERT INTO oauth_tokens (token,secret) values($1,$2)",
              values: [key, secret]
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return result = arguments[1];
                };
              })(),
              lineno: 49
            }));
            __iced_deferrals._fulfill();
          })(function() {
            return res.end(JSON.stringify({
              token: key
            }));
          });
        });
      });
    });
  };

  this.oauthAccessSwitch = function(req, res) {
    var client, err, oa, r, result, t, y, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    self.doGlobals(req, res);
    oa = self.makeRdioProvider();
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/settings.iced",
        funcname: "oauthAccessSwitch"
      });
      self.connectDb(__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return client = arguments[0];
          };
        })(),
        lineno: 61
      }));
      __iced_deferrals._fulfill();
    })(function() {
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/alastair/Projects/jukebox/settings.iced",
          funcname: "oauthAccessSwitch"
        });
        client.query({
          text: "SELECT secret from oauth_tokens WHERE token = $1",
          values: [req.body.token]
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return result = arguments[1];
            };
          })(),
          lineno: 68
        }));
        __iced_deferrals._fulfill();
      })(function() {
        console.log([req.body.token, result.rows[0].secret, req.body.verifier]);
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/alastair/Projects/jukebox/settings.iced",
            funcname: "oauthAccessSwitch"
          });
          oa.getAccessToken(req.body.token, result.rows[0].secret, req.body.verifier, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                r = arguments[0];
                t = arguments[1];
                return y = arguments[2];
              };
            })(),
            lineno: 73
          }));
          __iced_deferrals._fulfill();
        })(function() {
          console.log([r, t, y]);
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/alastair/Projects/jukebox/settings.iced",
              funcname: "oauthAccessSwitch"
            });
            client.query({
              text: "INSERT INTO oauth_tokens (token,secret) values($1,$2)",
              values: [t, y]
            }, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  err = arguments[0];
                  return result = arguments[1];
                };
              })(),
              lineno: 80
            }));
            __iced_deferrals._fulfill();
          })(function() {
            console.log([err, result]);
            return res.end(JSON.stringify({
              token: t
            }));
          });
        });
      });
    });
  };

  this.makeRdioProvider = function() {
    return require('rdio')({
      rdio_api_key: "2dmfysv2aaz972mjczvwvzyn",
      rdio_api_shared: "bpP2UZyhZA",
      callback_url: "http://localhost:8000"
    }, oauth);
  };

  this.getPlaybackToken = function() {
    var err, oa, result, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    self.doGlobals(req, res);
    oa = self.makeRdioProvider();
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: "/Users/alastair/Projects/jukebox/settings.iced",
        funcname: "getPlaybackToken"
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
        lineno: 105
      }));
      __iced_deferrals._fulfill();
    })(function() {
      return console.log(req.url);
    });
  };

  this.userRoomMaps = [];

}).call(this);
