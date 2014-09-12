(sand.define("DOM/devices/tuio", function(devices, app){
  
  //TO DO => recode me
  return;
  
  var l = app;
  
  app.number = 0;
  app.registeredTouches = [];
  
  if (l.UA === "ipad" || l.UA === "tuio") { //hack
    document.addEventListener("touchstart", function() {
       //e.preventDefault();
    });
    document.addEventListener("touchmove", function(e) { //MCB
      e.preventDefault();
      // cancels scroll & zoom default behavior
    });
  }
  
  l.devices.tuio = l.MVC.Controller.extend({
    
    binds : ["_touchstart", "_touchmove", "_touchend", "_drag"],
    
    "+init" : function(o) {
      console.log("new tuio device");
      
      this.id = o.id;
      this.number = app.number++;
      
      var svg = o.svg, node = o.node;
      //this._bounds = this._bounds || {};
      if (svg) {
        this.attach = function(evt, f) {
          node[evt](f);
        }
      }
      else {
        this.attach = function(evt, f) {
          node.addEventListener(evt, f);
        }
        this.detach = function(evt, f) {
          node.removeEventListener(evt, f);
        }
      }
        
      this.attach("touchstart", this._touchstart);
      this.attach("touchmove", this._touchmove);
      this.attach("touchend", this._touchend);
      this.attach("touchcancel", this._touchend);
    },
    
    changeDraged : function(e, newHandle) {
      this.fire("drag:end", [e]);
      newHandle.device._touchstart(e); // simulates touchstart
      this.toDrag = newHandle.device;
    },
    
    _drag : function(e) {
      if (l.drag) return;
      l.drag = this;
      this.toDrag = this;
      this.moved = true;
    },
    
    _touchstart : function(e) {
      console.log("touchstart"+this.id);
      e = this.wrap(e);
      
      if (!this.intouch) { // NOTE first touch (can have first touch with touches.length > 1)
        this.intouch = true;
        this.moved = false;
        this._drag(e);
        
        this._tmpScale = 1;
        this._tmpTr = [0, 0];

        this._sp = e.xy; // starting pos
        
        this.fire("down", [e]);
        this.fire("drag:start", [e]);
      }
      
      else {
        this._tmpScale = this._tmpScale || 1;
        this._sd = e.dist;

      //if (this._lastTr) {
        this._tmpTr = this._lastTr || [0, 0];
        this._sp = e.xy;
      //}
      }
      
      //MCB
      //e.halt();
    },
    
    _touchmove : function(e) {
      console.log("touchmove"+this.id);
      if (l.drag !== this) return;
      e = this.wrap(e);
      
      this.moved = true;

      if (e.dist) { // 2 fingers
        if (this._sd) {
          e.scale = this._tmpScale*e.dist/this._sd;
          this._lastScale = e.scale;
        }
        else {
          this._sd = e.dist;
        }
      }
      else {
        e.scale = this._tmpScale;
      }

      if (this._sp && this._tmpTr) {
        e.translate = this._tmpTr.add(e.xy.minus(this._sp));
      }
      this._lastTr = e.translate;
      
      console.log("sd"+this._sd);
      console.log("e.dist"+e.dist);
      console.log("tmpScale"+this._tmpScale);
      console.log("lastScale"+this._lastScale);
      console.log("startingpos"+JSON.stringify(this._sp));
      console.log("xy"+JSON.stringify(e.xy));
      console.log("tmptr"+JSON.stringify(this._tmpTr));
      console.log("translate"+JSON.stringify(e.translate));

      this.toDrag.fire("iScroll:change", [e]);
      //MCBthis.toDrag.fire("drag:drag", [e]);

      e.halt();
    },
    
    _touchend : function(e) {
      console.log("touchend"+this.id+",moved?"+this.moved);
      e = this.wrap(e);
      
      if (this.moved) {
        if (e.touches.length) { // new scroll
          this._sp = e.xy;
          this._sd = e.dist;
          this._tmpScale = this._lastScale;
          this._tmpTr = this._lastTr;
        }
        else { // end of scroll
          this.intouch = false;
          e.end = true;
          this._sp = false;
          this._sd = false;
          this._tmpTr = null;
          this._tmpScale = null;
          this._lastScale = null;
          this._lastTr = null;
          this.moved = false;
          this.fire("drag:end", [e]);
          this.fire("iScroll:end", [e]);
          
          l.drag = false;
        }
      }
      
      else {
        e.xy = this._sp;
        this.intouch = false;
        this._sp = false;
        this._sd = false;
        this._tmpTr = null;
        this._tmpScale = null;
        this._lastScale = null;
        this._lastTr = null;
        this.moved = false;
      }
      
      // bit ugly but seems necessary, change with caution
      this.onOver(e);
    },
    
    draged : function(e) {
      this._drag(e);
      this.moved = true;
    },
      
    onOver : function(e) {
      try {  
      console.log(this.id);
      console.log("bounds over?"+JSON.stringify(this._bounds));
      if (this._bounds.over) {
        if (this._overed) {
          this._overed = false;
          this.fire('out', [e]);
          //this.fire("click", [e]);
          this._clicked = true;
        }
        else if (this._clicked) {
          this._clicked = false;
          this.fire("out", [e]);
        }
        else {
          this._overed = true;
          this.fire("over", [e]);
        }
      }
      else {
        this.fire("click", [e]);
      }
      } catch (e) { console.log(e); }
    },
    
    wrapKey : function(e) {
      
      var keyCode = e.keyCode;
      e = this.wrap(e);
      e.shift = (keyCode === 16);
      e.enter = (keyCode === 13);

      return (e);
    },
      
    wrap : function(e) {
      var res = {};

      res.touches = e.touches || [];

      if (e.touches)
      {
        var n, x = 0, y = 0;

        if (n = e.touches.length) 
        {
          for (var i = n; i--; )
          {
            x += e.touches[i].pageX;
            y += e.touches[i].pageY;
          }

          res.x = x/n;
          res.y = y/n;
          res.xy = [res.x, res.y];

          if (e.touches.length > 1)
          {
            res.dist = Math.sqrt(Math.pow(e.touches[0].pageX-e.touches[1].pageX, 2)+Math.pow(e.touches[0].pageY-e.touches[1].pageY, 2));
          }
          //else e.falsh = true;
        }
      }

      res.halt = function() {
          e.stopPropagation();
          e.preventDefault();
        };

      return (res);
    }
 
  });
    
}, { requires : ["devices"] }));
