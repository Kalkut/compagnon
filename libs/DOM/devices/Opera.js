(sand.define("DOM/devices/Opera", function(devices, app) {
  
  // TO DO recode me
  return;
  var l = app;
  
  l.devices.opera = l.devices.firefox.extend({

    wrap : function(e) {
      var d = {};
      d.halt = function() {
        e.stopPropagation();
        e.preventDefault();
      }.bind(this)
      d.xy = [e.clientX,e.clientY];
      d.x = e.clientX;
      d.y = e.clientY;
      d.rightClick = ((e.which && e.which === 3) || (e.button && e.button == 2));

      return d;
    },
  
    attachScroll : function() {
      this.node.addEventListener("mousewheel", function(e) { // hack, Opera does not allow e to be modified
        var d = this.wrap(e);
        d.scale = (e.wheelDelta < 0) ? 2 : 0.5;
        this.fire("scroll", [d]);
      }.bind(this))
    }
  });
    
}, { requires : "devices.firefox" }));
