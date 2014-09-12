(sand.define("DOM/devices/ie", function(devices, app){
  
  //TO DO recode me
  return;
  
  var l = app;
  
  l.devices.ie = l.devices.firefox.extend({

    attachScroll : function()
    {
      this.node.attachEvent("onmousewheel", function(e) {
        e = this.wrap(e);
        e.scale = (e.wheelDelta < 0) ? 2 : 0.5;
        this.fire("scroll", [e]);
      }.bind(this))
    },

    wrap : function(e)
    {
      e = e || window.event;
      e.halt = function() {
        e.returnValue = false;
        e.cancelBubble = true;
      }.bind(this)
      e.xy = [e.clientX,e.clientY];

      return e;
    }

  });
    
}, { requires : "devices.firefox" }));
