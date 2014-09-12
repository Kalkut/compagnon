sand.define('DOM/select', function() {
  
  var off = function() {
    document.onselectstart = function(e) {
      e.halt();
      return false;
    }.wrap();
  };
  
  return {
    on : function() {
      document.onselectstart = null;
    },
    off : off
  }
  
});
