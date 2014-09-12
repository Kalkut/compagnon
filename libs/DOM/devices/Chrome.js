(sand.define("DOM/devices/Chrome", [
    "DOM/devices/Firefox"
  ],
  function(r) {

  var Chrome = r.Firefox.extend({

    attachScroll : function() {
      this.node.addEventListener("mousewheel", function(e) {
        e = this.wrap(e);
        e.scale = (e.wheelDelta < 0) ? 2 : 0.5;
        this.fire("scroll", [e]);
      }.bind(this))
    }
  });
 
  return Chrome;
 
}));
