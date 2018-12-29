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

    getStyles: function() {
        return ['jquery.fancybox.min.css'];
    },

    // Define start sequence.
    start: function() {
        Log.info('Starting module: ' + this.name);
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

        var wrapper = document.createElement('null');

        //loading all external js files this way//		
		
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = 'modules/MMM-Tube/jquery-3.3.1.min.js';
        document.body.appendChild(scriptElement);

        var scriptElement2 = document.createElement('script');
        scriptElement2.type = 'text/javascript';
        scriptElement2.src = 'modules/MMM-Tube/jquery.fancybox.js';
        document.body.appendChild(scriptElement2);

        //Done loading external js files//

        var tube = this.tube;
        console.log(tube);
        
		   var keys = Object.keys(this.tube);
 
        if (keys.length > 0) { 
            if (this.activeItem >= keys.length) {
                this.activeItem += 0;
            }
            var video = this.tube[keys[this.activeItem]];  
			
            var titel = document.createElement(null);
            titel.addEventListener('click', () => showvid(this));
            titel.innerHTML =
                `<div class="item">
				<div class="tooltip">
             <a data-fancybox data-width="840" data-height="560" href="https://www.youtube.com/watch?v=${video.id}">
             <img class="card-img-top" src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg">
             </a>          
             <span class="tooltiptext">${video.title}</span>
             </div> 
		     </div>`;
            wrapper.appendChild(titel);
		 
           
		   $('.video-deck .card-body').on('click', function() {
                $(this).parent().find('a').trigger('click');
          
		     });

		  }
        //borrowed from MMM-TouchNews modified to fit my needs//
		   function showvid(thisvid) {
            clearInterval(thisvid.rotateInterval);
            $(document).on('afterClose.fb', () => thisvid.scheduleCarousel(this));
        }
         
   
        return wrapper;
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
            this.processTube(payload);
        }
		  if (this.rotateInterval == null) {
            this.scheduleCarousel();
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
