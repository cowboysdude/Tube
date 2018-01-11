/* Magic Mirror
  * Module: MMM-Tube
  *
  * By cowboysdude
  * 
  */
 Module.register("MMM-Tube", {

     // Module config defaults.
     defaults: {
         updateInterval: 10 * 60 * 1000, // every 10 minutes
         animationSpeed: 10,
         initialLoadDelay: 875, // 0 seconds delay
         retryDelay: 1500,
         channel: "UCEcNXmr7DYq1XxpWHSxaN0w",
         maxWidth: "400px",
         fadeSpeed: 7,
         rotateInterval: 60 *  60 * 1000,
     },

     // Define required scripts.
    // getScripts: function() {
    //      return ["https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js","video.js"];
    //  },

      getStyles: function() {
          return ["MMM-Tube.css"];
     },

     // Define start sequence.
     start: function() {
         Log.info("Starting module: " + this.name);
         this.sendSocketNotification("CONFIG", this.config);

         // Set locale. 
         this.today = "";
         this.tube = {};
         this.activeItem = 0;
         this.rotateInterval = null;
         this.updateInterval = null;
         this.scheduleUpdate();
                                                                                                                                      
     }, 
     
    
     getDom: function() { 
     
    var wrapper = document.createElement("div"); 
     
         var tube = this.tube;
		    var Keys = Object.keys(this.tube);
		    if (Keys.length > 0) {
		        if (this.activeItem >= Keys.length) {
		            this.activeItem = 0;
		        }
		        var tube = this.tube[Keys[this.activeItem]]; 
		        
console.log(tube);  
         
		   var video = document.createElement(null); 
		   video.innerHTML= "<a href='#openModal'>OPEN MODAL</a>"; 
		   wrapper.appendChild(video);
		   
		   var holder = document.createElement("div"); 
		   holder.setAttribute("id","openModal");
         holder.setAttribute("class","modalDialog");
         holder.innerHTML=  "<div><a href='#close' title='Close' class='close'>X</a><h2>"+tube.title+"</h2><p>This is a sample modal box that can be created using the powers of CSS3.</p></div>"; 		   
         wrapper.appendChild(holder);
		   
		   
		   	
		   }
		   
	  
         return wrapper;

     },
      

     processTube: function(data) {
         this.today = data.Today;
         this.tube = data; 
         this.loaded = true;
     },
     
      scheduleCarousel: function() {
         console.log("Scheduling videos...");
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