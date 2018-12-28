/* Magic Mirror
 * Module: MMM-Tube
 *
 * By Cowboysdude 
 *  WITH BIG assist by Sam, Thank you again!!!  
 */
const NodeHelper = require('node_helper');
const request = require('request');
const parser = require('xml2js').parseString;

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },
    results: [],
    playlist_index: 0,
    playlist_loading: false,
    startTimer: function(routine, timeout) {
        setTimer(() => { //getting a  setTimer is not defined error 
            routine;
        }, timeout);

    },

    getTube: function() {
        //var playlist = this.config.playlist;
        // if we are not loading a list now
        if (this.paylist_loading == false) {
            // and there are more to load
            if (this.playlist_index < this.config.playlist.length) {
                // start a timer to handle more later
                startTimer(getTube, 1000);
                // load one now
                getUrl('https://www.youtube.com/feeds/videos.xml?playlist_id=' + this.config.playlist[this.playlist_index++]);
            }
        } else
            // loading, wait til it finishes
            this.startTimer(this.getTube, 1000);
    },



    getUrl: function(url) {
        // inidcate we are loading, prevent recursion
        this.playlist_loading = true;
        request({
            url: this.getTube(),
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                parser(body, (err, result) => {
                    if (result.hasOwnProperty('feed')) {
                        var entries = result.feed.entry;

                        for (var i = 0, entry; entry = entries[i]; i++) this.results.push({
                            'tLink': entry.link[0].$.href,
                            'title': entry.title[0],
                            'id': entry['yt:videoId'][0],
                            'pic': entry['media:group'][0]['media:thumbnail'][0].$.url,
                            'video': i

                        });
                        // if we are donw with all the playlist entries
                        if (this.playlist_index == this.config.playlist.length) {
                            //console.log(results); 
                            // send the list to the module 
                            this.sendSocketNotification("TUBE_RESULT", this.results);
                        }
                    }
                });
            }
            // all done with this url, error or not
            this.playlist_loading = false;
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_TUBE') {
            // if we are not loading any playlists
            if (this.playlist_loading == false) {
                // clear the list
                this.results = [];
                // start over
                this.playlist_index = 0;
                // go load the url list
                this.getTube();
            }
        }
    }
});
