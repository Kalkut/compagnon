(sand.define("DOM/ctrlaable", ["DOM/handle"], function(r) {

  var handle = r.handle;

  this.exports = function(el) { // Makes a HTMLInput get selected when you press "cmd+a" (Mac OS)
    var h = handle(el);
    h.keydown(function(e) {
      if (e.keyIdentifier && e.keyIdentifier === "Meta") {
        this._cmd = true;
      }
      if (this._cmd && e.keyCode === 65) { // cmd+a
        el.select();
      }
    }.bind(this));

    h.keyup(function(e) {
      if (e.keyIdentifier && e.keyIdentifier === "Meta") {
        this._cmd = false;
      }
    }.bind(this));
  };
    
}));
