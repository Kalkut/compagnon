(sand.define("DOM/state", ["DOM/handle"], function(r) {
  
  return {};
  var handle = r.handle;

  var h = handle(document), s = {};
  return s;
  h.keydown(function(e) {
    if (e.shift) {
      s.shifted = true;
    }
    else if (e.keyCode === 91) { // ctrl
      s.ctrled = true;
    }
  });

  h.keyup(function(e) {
    if (e.shift) {
      s.shifted = false;
    }
    else if (1 || e.keyCode === 91) {
      s.ctrled = false;
    }
  });
  
  
  this.exports = s;
    
}));
