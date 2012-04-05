https = require("https")
settings = require("./settings.js")

opts=
	host: "stream.twitter.com"
	port: 443
	path: "/1/statuses/filter.json?track=jukemobapp"
	method: "GET"
	auth: "jukemobapp:jukeyou!"

req = https.request opts, (res) ->
	res.setEncoding('binary') 
	res.on "data", (d) ->
		json = JSON.parse(d)
		processJSON(json)

#req.end()

processJSON = (json)->
	for hashtag in json.entities.hashtags
		if hashtag.text.indexOf("jm") == 0
			# is a token
			userid = hashtag.text.substr(4)
			await settings.connectDb defer db
			
			await db.query
				text:"UPDATE users set totalcredits = totalcredits + 20 where userid = $1"
				values:[userid]
			, defer err, result
			
			console.log err
			


dummyJson = {
    "text": "@jukemobapp la la",
    "coordinates": null,
    "retweet_count": 0,
    "in_reply_to_user_id": 516755902,
    "in_reply_to_status_id_str": null,
    "created_at": "Thu Apr 05 19:45:03 +0000 2012",
    "id_str": "187989246710251521",
    "contributors": null,
    "favorited": false,
    "source": "<a href=\"http://www.tweetdeck.com\" rel=\"nofollow\">TweetDeck</a>",
    "in_reply_to_user_id_str": "516755902",
    "in_reply_to_status_id": null,
    "entities": {
        "urls": [],
        "user_mentions": [
            {
                "indices": [
                    0,
                    11
                ],
                "screen_name": "jukemobapp",
                "id_str": "516755902",
                "name": "JukeMob",
                "id": 516755902
            }
        ],
        "hashtags":[{"text":"jm81495","indices":[129,137]}]
    },
    "place": null,
    "geo": null,
    "in_reply_to_screen_name": "jukemobapp",
    "truncated": false,
    "user": {
        "profile_background_image_url": "http://a0.twimg.com/profile_background_images/11128094/P1010855-1b.jpg",
        "listed_count": 20,
        "statuses_count": 1160,
        "profile_background_image_url_https": "https://si0.twimg.com/profile_background_images/11128094/P1010855-1b.jpg",
        "profile_link_color": "ad622e",
        "notifications": null,
        "followers_count": 264,
        "profile_image_url_https": "https://si0.twimg.com/profile_images/564055797/photo_normal.jpeg",
        "profile_image_url": "http://a0.twimg.com/profile_images/564055797/photo_normal.jpeg",
        "screen_name": "_alastair",
        "default_profile": false,
        "contributors_enabled": false,
        "geo_enabled": true,
        "created_at": "Thu Dec 11 20:33:07 +0000 2008",
        "profile_background_color": "010101",
        "description": "Grew up in the UK, lived in Canada, now in NYC- part of the @recordsetter team and creator of @taxonomyapp. @StartupBus veteran; I also take photos.",
        "id_str": "18059424",
        "is_translator": false,
        "profile_background_tile": false,
        "url": "http://blog.untogether.co.uk",
        "time_zone": "Central Time (US & Canada)",
        "profile_sidebar_fill_color": "252429",
        "show_all_inline_media": false,
        "default_profile_image": false,
        "lang": "en",
        "profile_sidebar_border_color": "181A1E",
        "protected": false,
        "location": "Brooklyn, New York",
        "follow_request_sent": null,
        "verified": false,
        "favourites_count": 2,
        "name": "Alastair Coote",
        "profile_use_background_image": true,
        "friends_count": 278,
        "id": 18059424,
        "following": null,
        "utc_offset": -21600,
        "profile_text_color": "666666"
    },
    "id": 187989246710251520,
    "retweeted": false
}

processJSON(dummyJson)