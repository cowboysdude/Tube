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
		self=this;
    },
	self:0,
    results:[],

    youtube_playlist_url_root:'https://www.youtube.com/feeds/videos.xml?playlist_id=',
    loadInProgress:false,
    playlist_index:0,
    playlist_loading:false,
    playlist_entries:0,

    // routine to start timer
    // wait for url load to finish
    startTimer: function(routine, timeout){
		console.log("starting timer for refresh");
	setTimeout(()=> { 
	        console.log("timeout ");
            routine;
	}, timeout);
    },

    // get the list of playlists one at time. no overlap
    getTube: function() {
	console.log("get tube list");
        //var playlist = this.config.playlist;
	//if we are not loading a list now
	if(self.playlist_loading==false)
        {
		console.log("not loading a playlist now");	
	  // and there are more to load
	  if(self.playlist_index<self.config.playlist.length){
	    // start a timer to handle more later
            self.startTimer(self.getTube,1000);
			console.log("starting a playlist pull");
	    // load one now
	    self.getUrl(self.youtube_playlist_url_root + self.config.playlist[self.playlist_index++]);
	  }
	  else
	     self.loadInProgress=false;
	} 
	else {
		console.log("waiting");
	  // loading, wait til it finishes
	  self.startTimer(self.getTube,1000);  		    
	}
    },

    // load and process one url of playlist entries
    getUrl: function(urlstring) {
	// inidcate we are loading, prevent recursion
	self.playlist_loading=true;
        request({
            url: urlstring,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
				console.log("have playlist results");
                parser(body, (err, result) => {
					console.log("have parse results");
                    if (!err && result.hasOwnProperty('feed')) {
						console.log("have feed="+ result.feed.entry.length);
                         var entries = result.feed.entry; 
						for (var i = 0, entry; entry = entries[i]; i++) {
							console.log("pushing entry");
							console.log(entries); 
                        
			/* it's getting here and this is what the return looks like:
						
				pushing entry
[ { id: [ 'yt:video:yXQViqx6GMY' ],
    'yt:videoId': [ 'yXQViqx6GMY' ],
    'yt:channelId': [ 'UClS0wn3LPs9jdX_yt2g1k8w' ],
    title: [ 'Mariah Carey - All I Want For Christmas Is You' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2009-11-24T06:21:35+00:00' ],
    updated: [ '2018-12-28T03:55:33+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:E8gmARGvPlI' ],
    'yt:videoId': [ 'E8gmARGvPlI' ],
    'yt:channelId': [ 'UCm1QnxCbcLB8fQwoTDk39iQ' ],
    title: [ 'Wham! - Last Christmas (Official Video)' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2009-10-25T18:58:28+00:00' ],
    updated: [ '2018-12-28T03:54:57+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:LUjn3RpkcKY' ],
    'yt:videoId': [ 'LUjn3RpkcKY' ],
    'yt:channelId': [ 'UCHkj014U2CQ2Nv0UZeYpE_A' ],
    title: [ 'Justin Bieber - Mistletoe' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2011-10-18T23:54:00+00:00' ],
    updated: [ '2018-12-28T03:54:49+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:nlR0MkrRklg' ],
    'yt:videoId': [ 'nlR0MkrRklg' ],
    'yt:channelId': [ 'UC0VOyT2OCBKdQhF3BAbZ-1g' ],
    title: [ 'Ariana Grande - Santa Tell Me' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2014-12-13T04:00:01+00:00' ],
    updated: [ '2018-12-28T03:54:10+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:WSUFzC6_fp8' ],
    'yt:videoId': [ 'WSUFzC6_fp8' ],
    'yt:channelId': [ 'UCmv1CLT6ZcFdTJMHxaR9XeA' ],
    title: [ '[Official Video] Carol of the Bells - Pentatonix' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2012-11-14T16:32:35+00:00' ],
    updated: [ '2018-12-28T03:53:20+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:mN7LW0Y00kE' ],
    'yt:videoId': [ 'mN7LW0Y00kE' ],
    'yt:channelId': [ 'UCBnQXCJ9odFrWv9Xf-_durA' ],
    title: [ 'Dean Martin - Let it Snow!' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2008-12-03T00:16:13+00:00' ],
    updated: [ '2018-12-28T03:30:21+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:EvDxSW8mzvU' ],
    'yt:videoId': [ 'EvDxSW8mzvU' ],
    'yt:channelId': [ 'UCf71pD2cZUazek_s2V9DvRA' ],
    title: [ 'Chris Rea - Driving home for christmas' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2007-05-18T18:08:37+00:00' ],
    updated: [ '2018-12-28T03:55:16+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:ZeyHl1tQeaQ' ],
    'yt:videoId': [ 'ZeyHl1tQeaQ' ],
    'yt:channelId': [ 'UCsfdrdj6DAWmBUdPDfFTatg' ],
    title: [ 'Shakin\' Stevens - Merry Christmas Everyone (Official Video)' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2009-10-25T18:56:12+00:00' ],
    updated: [ '2018-12-28T03:12:59+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:j9jbdgZidu8' ],
    'yt:videoId': [ 'j9jbdgZidu8' ],
    'yt:channelId': [ 'UCvfcW8XVa2Kj802P4l302Yw' ],
    title: [ 'The Pogues -  Fairytale Of New York (Official Video)' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2011-12-07T16:27:02+00:00' ],
    updated: [ '2018-12-28T03:52:50+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:BEJmP8T07JU' ],
    'yt:videoId': [ 'BEJmP8T07JU' ],
    'yt:channelId': [ 'UClS0wn3LPs9jdX_yt2g1k8w' ],
    title: [ 'Mariah Carey - O Holy Night (Video)' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2009-11-08T07:26:25+00:00' ],
    updated: [ '2018-12-28T03:54:50+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:bjQzJAKxTrE' ],
    'yt:videoId': [ 'bjQzJAKxTrE' ],
    'yt:channelId': [ 'UCDfV__WDVT2XBPqoQf3_YDA' ],
    title: [ 'Do they Know it\'s Christmas ~ Band Aid 1984' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2011-12-11T09:54:29+00:00' ],
    updated: [ '2018-12-28T03:50:25+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:zNpeK7sDLzE' ],
    'yt:videoId': [ 'zNpeK7sDLzE' ],
    'yt:channelId': [ 'UCNWusKbBheusw-yvZ9kn1Ig' ],
    title: [ 'Gabrielle Aplin - The Power of Love' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2012-11-09T09:01:10+00:00' ],
    updated: [ '2018-12-28T03:49:21+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:FA5jsa1lR9c' ],
    'yt:videoId': [ 'FA5jsa1lR9c' ],
    'yt:channelId': [ 'UCc3_ZthcYkMidoyly5kr83w' ],
    title: [ 'Spice Girls - 2 Become 1 (Official Music Video)' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2009-03-07T07:13:00+00:00' ],
    updated: [ '2018-12-28T03:46:29+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:gFtb3EtjEic' ],
    'yt:videoId': [ 'gFtb3EtjEic' ],
    'yt:channelId': [ 'UCR-8egBOyVbj_bYXBkv43Ug' ],
    title: [ 'Andy Williams - It\'s The Most Wonderful Time Of The Year' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2007-12-21T16:14:15+00:00' ],
    updated: [ '2018-12-28T03:49:43+00:00' ],
    'media:group': [ [Object] ] },
  { id: [ 'yt:video:t3HJgCcSUqQ' ],
    'yt:videoId': [ 't3HJgCcSUqQ' ],
    'yt:channelId': [ 'UCy5_VL5roz50uWRKR7_gVyw' ],
    title: [ 'Rockin\' Around The Christmas Tree Lyrics' ],
    link: [ [Object] ],
    author: [ [Object] ],
    published: [ '2012-12-14T02:33:36+00:00' ],
    updated: [ '2018-12-28T03:54:08+00:00' ],
    'media:group': [ [Object] ] } ]		
									
	however it's cycling the list 15 times so if there's 15 entires it rotates through the list and returns 15 items 15 times
    then it's returning the key as the key but the value inside an array which is wrong and that's why it's not pushing the data
    past this point because when I'm trying to create the return below the values like entry.link[0].href is actually inside an
    array and cannot process using the below 'formula'
*/	
							  
							
							
			    self.results.push({
                            'tLink': entry.link[0].$.href,
                            'title': entry.title[0],
                            'id': entry['yt:videoId'][0],
                            'pic': entry['media:group'][0]['media:thumbnail'][0].$.url,
      			            'video':self.playlist_entries++
                     	   
				}); 
			 }
			 
			// if we are donw with all the playlist entries
			if(self.playlist_index==self.config.playlist.length){
				
                           console.log("playlist results="+self.results); 
			   // send the list to the module 
                           sendSocketNotification("TUBE_RESULT", self.results);
			}
                    }
                });
            } else
				 console,log("err=="+err);
	    // all done with this url, error or not
	    self.playlist_loading=false;
		console.log("done pushing entries for playlist");
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_TUBE') {
			console.log(" get playlist entries");
	    // if we are not loading any playlists
	    if(this.loadInProgress==false){
			console.log(" starting list pull");
		// clear the list
		this.results=[];
		// reset index for voice
		this.playlist_entries=0;
		// start over
	    	this.playlist_index=0;
		// indicate loading URL list
		this.loadInProgress=true;
		// go load the url list
            	this.getTube();
	    }
		else
			console.log("already pulling list");
        }
    }
});
