/* Magic Mirror
 * Module: MMM-Tube
 *
 * Node_helper written by sdetweil
 *  THANK YOU, Fantastic work!  
 */
const NodeHelper = require('node_helper');
const request = require('request');
const parser = require('xml2js').parseString;

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
        self = this;
    },
    self: 0,
    results: [],

    youtube_playlist_url_root: 'https://www.youtube.com/feeds/videos.xml?playlist_id=',
    loadInProgress: false,
    playlist_index: 0,
    playlist_loading: false,
    playlist_entries: 0,

    // get the list of playlists one at time. no overlap
    getTube: function() {
        //console.log("get tube list");

        //if we are not loading a list now
        if (self.playlist_loading == false) {
            //console.log("not loading a playlist now");	
            // and there are more to load
            if (self.playlist_index < self.config.playlist.length) {
                // start a timer to handle more later
                setTimeout(self.getTube, 1000);
                //console.log("starting a playlist pull");
                // load one now
                self.getUrl(self.youtube_playlist_url_root + self.config.playlist[self.playlist_index++]);
            } else {
                self.loadInProgress = false;
                //console.log("playlist loading completed");
            }
        } else {
            //console.log("waiting");
            // loading, wait til it finishes
            setTimeout(self.getTube, 1000);
        }
    },

    // load and process one url of playlist entries
    getUrl: function(urlstring) {
        // inidcate we are loading, prevent recursion
        self.playlist_loading = true;
        request({
            url: urlstring,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                //console.log("have playlist results");
                parser(body, (err, result) => {
                    //console.log("have parse results");
                    if (!err && result.hasOwnProperty('feed')) {
                        //console.log("have feed="+ result.feed.entry.length);
                        var entries = result.feed.entry;
                        for (var i = 0, entry; entry = entries[i]; i++) {
                            //console.log("pushing entry"); 

                            self.results.push({
                                'tLink': entry.link[0].$.href,
                                'title': entry.title[0],
                                'id': entry['yt:videoId'][0],
                                'pic': entry['media:group'][0]['media:thumbnail'][0].$.url,
                                'video': self.playlist_entries++

                            });
                        }

                        // if we are donw with all the playlist entries
                        if (self.playlist_index == self.config.playlist.length) {

                            //console.log("playlist results="+self.results); 
                            // send the list to the module 
                            self.sendSocketNotification("TUBE_RESULT", self.results);
                        }
                    }
                });
            } else
            if (self.config.debug == true) {
                console,
                log("err==" + err);
            }
            // all done with this url, error or not
            self.playlist_loading = false;
            //console.log("done pushing entries for playlist");
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_TUBE') {
            //console.log(" get playlist entries");
            // if we are not loading any playlists
            if (this.loadInProgress == false) {
                //console.log(" starting list pull");
                // clear the list
                this.results = [];
                // reset index for voice
                this.playlist_entries = 0;
                // start over
                this.playlist_index = 0;
                // indicate loading URL list
                this.loadInProgress = true;
                // go load the url list
                this.getTube();
            } else
                console.log("pulling list");
        }
    }
});
