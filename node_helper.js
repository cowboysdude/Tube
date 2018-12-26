/* Magic Mirror
 * Module: MMM-Tube
 *
 * By Cowboysdude
 * 
 */
const NodeHelper = require('node_helper');
const request = require('request');
const parser = require('xml2js').parseString;

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

    getUrl: function() {
        var url = null;
        var playlist = this.config.playlist;
        for (var i = 0; i < playlist.length; i++) {
            playlist.forEach(function(url) {

                var url = 'https://www.youtube.com/feeds/videos.xml?playlist_id=' + playlist[i];
            });
        }
    },

    getTube: function(url) {
        request({
            url: 'https://www.youtube.com/feeds/videos.xml?playlist_id=RDnmGSHZYZ74c',
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                parser(body, (err, result) => {
                    if (result.hasOwnProperty('feed')) {
                        var entries = JSON.parse(JSON.stringify(result.feed.entry));
                             var results = []; 	
                        for (var i = 0, entry; entry = entries[i]; i++) results.push({
                            'tLink': entry.link[0].$.href,
                            'title': entry.title[0],
                            'id': entry['yt:videoId'][0],
                            'pic': entry['media:group'][0]['media:thumbnail'][0].$.url
                        });
//////////////////////the code below this returns an object like this {'video': '0'} through however many videos there are
// what I would like to do with this object is inject it into each object above.  My return on the above looks like this
// [ { tLink: 'https://www.youtube.com/watch?v=MpkI7GW2V34',
//    title: 'The Christmas Shoes',
//    id: 'MpkI7GW2V34',
//    pic: 'https://i2.ytimg.com/vi/MpkI7GW2V34/hqdefault.jpg' } ]  
// there are more then 1 video this is just an example of what it looks like.....what I'd like to do is this:
//  [ { tLink: 'https://www.youtube.com/watch?v=MpkI7GW2V34',
//    title: 'The Christmas Shoes',
//    id: 'MpkI7GW2V34',
//    pic: 'https://i2.ytimg.com/vi/MpkI7GW2V34/hqdefault.jpg'   
//    video: '0' }]  <-- with each video being numbered so next video object would be video: "1" etc...
// This is probably easy but it's just stumping me :)
///////////////////////////////////////////////////////////////////////////////////////////////////
			    
	         	    var items = Object.keys(results);
			  items.forEach(value => { 
                          const item = {
			  'video': value
			  }
	                });
                        console.log(results);
					 
                        this.sendSocketNotification("TUBE_RESULT", results);
                    }
                });
            }
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_TUBE') {
            this.getTube(payload);
        }
    }
});
