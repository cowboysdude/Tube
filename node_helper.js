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

    getTube: function(url) {
        request({
            url: 'https://www.youtube.com/feeds/videos.xml?channel_id=' + this.config.channel,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                parser(body, (err, result) => {
                    if (result.hasOwnProperty('feed')) {
                        var entries = JSON.parse(JSON.stringify(result.feed.entry)),
                            results = [];
                        for (var i = 0, entry; entry = entries[i]; i++) results.push({
                            'tLink': entry.link[0].$.href,
                            'title': entry.title[0],
                            'id': entry['yt:videoId'][0],
                            'pic': entry['media:group'][0]['media:thumbnail'][0].$.url
                        });
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