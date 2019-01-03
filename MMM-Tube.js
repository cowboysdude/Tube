/* Magic Mirror
 * Module: MMM-Tube
 *
 * Main.js by cowboysdude
 * 
 */
var $, jQuery;


Module.register('MMM-Tube', {

    // Module config defaults.
    defaults: {
        updateInterval: 60 * 1000, // every 10 minutes
        animationSpeed: 10,
        initialLoadDelay: 875, // 0 seconds delay
        retryDelay: 1500, 
        playlist: '',
        useChannel: false,
        maxWidth: '400px',
        fadeSpeed: 7,
        debug: false,
        rotateInterval: 5 * 1000,
        items: 5		
    },
self:0,

    getStyles: function() {
        return ['jquery.fancybox.min.css', 'custom.css'];
    },

    getScripts: function() {
        return ['jquery-3.3.1.min.js','jquery.fancybox.js'];
    },
    // Define start sequence.
    start: function() {
        Log.info('Starting module: ' + this.name);
	self=this;
        this.sendSocketNotification('CONFIG', this.config);

        // Set locale. 
        this.today = '';
        this.tube = [];
        this.updateInterval = null;
        this.scheduleUpdate();
        this.loaded = false;
        this.activeItem = 0;
        this.rotateInterval = null;
    },

    scheduleCarousel: function() {
        console.log('Rotating next items');
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    getDom: function() {

        var wrapper = document.createElement('div');

	var w= document.createElement('div');
	  w.setAttribute("class","horizontal-scroll-wrapper squares");
	  wrapper.appendChild(w);
        var tube = this.tube;
        console.log(tube);
        
	var keys = Object.keys(this.tube);
	
 
        if (keys.length > 0) { 
            if (this.activeItem >= keys.length) {  // do we care about the active entry? if you can scroll?
                this.activeItem = 0;	 	   // are you autoplaying, and centering the 'currently playing'?		
            }
	    for(var i=0;i<keys.length;i++){
		var v=document.createElement('div');
			v.setAttribute("class","tooltip");    

		var a = document.createElement("a");
			a.height="320";
			a.width="640";
			a.href="https://www.youtube.com/watch?v="+this.tube[keys[i]].id;
			var video = this.tube[keys[i]]; 
			a.addEventListener('click', self.showvid(video));
		
		var img=document.createElement("img");
			img.height="320";
			img.width="640";
			img.src="https://img.youtube.com/vi/"+this.tube[keys[i]].id+"/mqdefault.jpg";
			var s = document.createElement("span");
			s.class="tooltiptext"
			s.innerHTML=this.tube[keys[i]].title;
			img.appendChild(s);

		a.appendChild(img);
		v.appendChild(a);
		w.appendChild(v);
	    }
`<div class="horizontal-scroll-wrapper squares">
  <div>item 1</div>
  <div>item 2</div>
  <div>item 3</div>
  <div>item 4</div>
  <div>item 5</div>
  <div>item 6</div>
  <div>item 7</div>
  <div>item 8</div>
</div>`
       /*         `<div class="item">
				<div class="tooltip">
             <a data-fancybox data-width="640" data-height="320" width="640" height="320" href="https://www.youtube.com/watch?v=${video.id}">
             <img class="card-img-top" width="640" height="320" src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg">
             </a>          
             <span class="tooltiptext">${video.title}</span>
             </div> 
		     </div>`; */
            //wrapper.appendChild(titel);
		 
           
		   $('.video-deck .card-body').on('click', function() {
			Log.log("in click");
                $(this).parent().find('a').trigger('click');
          
		     });

		  }

         
   	console.log(wrapper.innerHTML);
	
        return wrapper;
    }, 

        //borrowed from MMM-TouchNews modified to fit my needs//
	 showvid:  function(thisvid) {
            clearInterval(thisvid.rotateInterval);
            $(document).on('afterClose.fb', () => self.scheduleCarousel(thisvid));
        }, 

    processTube: function(data) {
        this.today = data.Today;
        this.tube = data;
        this.loaded = true;
    },
   
    scheduleUpdate: function() {
        setInterval(() => {
            this.getTube();
        }, this.config.updateInterval);
        this.getTube(this.config.initialLoadDelay);
    },

    getTube: function() {
        this.sendSocketNotification('GET_TUBE');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'TUBE_RESULT') {
	    Log.log("videos="+JSON.stringify(payload));
            this.processTube(payload);
        }
		  if (this.rotateInterval == null) {
            this.scheduleCarousel();
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
