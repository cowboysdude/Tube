/* Magic Mirror
 * Module: MMM-Tube
 *
 * By cowboysdude
 * 
 */
var $, jQuery;

Module.register("MMM-Tube", {

    // Module config defaults.
    defaults: {
        updateInterval: 60 * 1000, // every 10 minutes
        animationSpeed: 10,
        initialLoadDelay: 875, // 0 seconds delay
        retryDelay: 1500,
        channel: "",
        playlist: "",
        useChannel: false,
        maxWidth: "400px",
        fadeSpeed: 7 
    },

    getStyles: function() {
        return ["jquery.fancybox.min.css"];
    },

    WordWrap: function(str, width, brk, cut) {
        brk = brk || 'n';
        width = width || 75;
        cut = cut || false;
        if (!str) {
            return str;
        }
        var regex = '.{1,' + width + '}(\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\S+?(\s|$)');
        return str.match(RegExp(regex, 'g')).join(brk);
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("CONFIG", this.config);

        // Set locale. 
        this.today = "";
        this.tube = [];
        this.updateInterval = null;
        this.scheduleUpdate();
		this.loaded = false;
    },


    getDom: function() {

        var wrapper = document.createElement("null");

        //loading all external js files this way//		
		
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = "modules/MMM-Tube/jquery-3.3.1.min.js";
        document.body.appendChild(scriptElement);

        var scriptElement2 = document.createElement('script');
        scriptElement2.type = 'text/javascript';
        scriptElement2.src = "modules/MMM-Tube/jquery.fancybox.js";
        document.body.appendChild(scriptElement2);

		//Done loading external js files//

        var tube = this.tube;
		 
		
		   var contain = document.createElement("div");
		  contain.setAttribute("style", "margin-left:auto;","margin-right:auto;");
		   wrapper.appendChild(contain);
        
          tube.forEach(function(video, i) { 
  
  
            var titel = document.createElement(null);
            titel.addEventListener("click", () => showvid(this));
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
           $(this).parent().find("a").trigger('click');
           });
    });
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
        this.sendSocketNotification("GET_TUBE");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TUBE_RESULT") {
            this.processTube(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
