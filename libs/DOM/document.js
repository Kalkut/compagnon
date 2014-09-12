
(sand.define("DOM/document", ["DOM/handle", "DOM/state", "Seed"], function(r) {

  var handle = r.handle,
    h = handle(document);
        
  return new (r.Seed.extend({
    
    _downs : [],
    _ups : [],

    on : function(evt, f, scope){
      return h.on(evt, f, scope);
    },
    
    keyup : function(f) {
      this._ups.push(f);
    },
    
    keydown : function(f) {
      this._downs.push(f);
    },
    
    clear : function() {
      this._downs = [];
      this._ups = [];
      /*h = handle(document); // we clear the bindings
      
      [
        'onmousemove',
        'onmouseup',
        'onmousedown',
        'onmouseover',
        'onkeyup',
        'onkeydown',
        'onkeypress'
      ].each(function(e) { document[e] = null; }); // and also the previous event attachments*/
    },
    
    "+init" : function() {
      this.state = r.state;
      // We replace old state module for retrocompatibility
      try {
        h.keydown(function(e) {
          if (e.shift) {
            r.state.shifted = true;
          }
          else if (e.keyCode === 91 || e.keyCode === 17) { // cmd, ctrl
            r.state.ctrled = true;
          }
          else if (e.keyCode === 32) { // space
            r.state.space = true;
          }
          else if (e.keyCode === 8) { // backspace
            e.backspace = true;
          }
          else if (e.keyCode > 47 && e.keyCode < 106) e.char = true;
          else if (e.keyCode === 37) e.fleche = 'left';
          else if (e.keyCode === 38) e.fleche = 'top';
          else if (e.keyCode === 39) e.fleche = 'right';
          else if (e.keyCode === 40) e.fleche = 'bottom';
          else if (e.keyCode === 27) e.escape = true;
          
          this._downs.each(function(f) {
            f(e);
          });
        }.bind(this));

        h.keyup(function(e) {
          if (e.shift) {
            r.state.shifted = false;
          }
          else if (1 || e.keyCode === 91) {
            r.state.ctrled = false;
          }
          
          if (e.keyCode === 32) {
            r.state.space = false;
          }
          
          this._ups.each(function(f) {
            f(e);
          });
        }.bind(this));
      } catch(e) {}
    }
  }));
  
}));
