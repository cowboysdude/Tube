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
        updateInterval: 120 * 60 * 1000, // every 10 minutes
        animationSpeed: 10,
        initialLoadDelay: 875, // 0 seconds delay
        retryDelay: 1500,
        channel: "",
        playlist: "",
        useChannel: false,
        maxWidth: "400px",
        fadeSpeed: 7,
        rotateInterval: 5 * 1000,
        readInterval: 240 * 1000
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
        this.activeItem = 0;
        this.rotateInterval = null;
        this.updateInterval = null;
        this.scheduleUpdate();
    },


    getDom: function() {

        var wrapper = document.createElement("null");


        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = "modules/MMM-Tube/jquery-3.3.1.min.js";
        document.body.appendChild(scriptElement);

        var scriptElement2 = document.createElement('script');
        scriptElement2.type = 'text/javascript';
        scriptElement2.src = "modules/MMM-Tube/jquery.fancybox.js";
        document.body.appendChild(scriptElement2);


        var tube = this.tube;
        var Keys = Object.keys(this.tube);
        if (Keys.length > 0) {
            if (this.activeItem >= Keys.length) {
                this.activeItem = 0;
            }
            var tube = this.tube[Keys[this.activeItem]];
            console.log(tube);

           var titel = document.createElement("div");
			titel.addEventListener("click", () => showvid(this));
			titel.innerHTML = `<div class="card">
        <a data-fancybox data-width="840" data-height="560" href="https://www.youtube.com/watch?v=${tube.id}">
            <img class="card-img-top" src="https://img.youtube.com/vi/${tube.id}/mqdefault.jpg">
        </a> 
            <p class="card-text">
                ${tube.title}
            </p> 
		</div>`;
			wrapper.appendChild(titel);

            var scriptElement3 = document.createElement('script');
            scriptElement3.type = 'text/javascript';
            scriptElement3.src = "modules/MMM-Tube/fire.js";
            document.body.appendChild(scriptElement3);

  ////////this is where I'm having a hard time figuring it out //////////////////////
  /* when I start the video it stops the rotateinterval...so I used the 'dblclick' to restart it because if I didn't 
     then when I click on video to start it stops the rotate then restarts it again at the same time              */
            function showvid(thisvid) {
                thisvid.intpause();
                document.addEventListener("dblclick", () => thisvid.intresume());
            };
////////////////////////////////////// Here /////////////////////////////////////////////
        }

        return wrapper;
    },

    intpause: function() {
        console.log("stopping rotateInterval");
        clearInterval(this.rotateInterval);
    },

    intresume: function() {
        console.log("restarting rotateInterval");
        this.scheduleCarousel();
    },

    processTube: function(data) {
        this.today = data.Today;
        this.tube = data;
		
        this.loaded = true;
		console.log(this.tube);
    },

    scheduleCarousel: function() {
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
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
        if (this.rotateInterval == null) {
            this.scheduleCarousel();

            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});