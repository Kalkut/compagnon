sand.define('DOM/devices/Ipad',[
    'Seed',
    "core/clone",
    "core/hardClone",
    //"core/Array/minus",
    "core/Function/bind",
    "DOM/devices/Firefox",
    'touch/Gesture'
  ], function(r) {

  Array.prototype.dist = function() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
  };
  var tolerance = 40;
  //temporary

  var touches = 0,
      number = 0,
      draggedEl = false,
      //TOMATURE:debug
      debug = this.debug&&this.debug.d,
      onTouchesMove = null,
      draggingEvts,
      onTouchesOff = null,
      drag = null;

  
  var Ipad = r.Seed.extend({
        
    '+init' : function(o) {
      console.log('new handle')
      this.number = number++;
      //console.log("building this.number", this.number);
      this.moved = false;
      
      var svg = o.svg, node = o.node;
      this.node = node;
      
      this.initEvents(svg,node);

      this.resetAttrs();
    },
  
    initEvents : function(svg,node) {
      if (svg) {
        this.attach = function(evt, f) {
          if (!node.attach) {
            node.attach(evt, f);
          }
          else node.attach(evt, f);
          this[evt] = f;
        }.bind(this);

        this.detach = function(evt) {
          if (!node.detach) {
            if (node['un' + evt]) node['un' + evt](this[evt]);
          }
          else node[evt](function() {});          
        }
      } else {
        this.attach = function(evt, f) {
          node.addEventListener(evt, f, false);
          //node['on' + evt] = f;
        };

        this.detach = function(evt) {
          node['on' + evt] = null; //node.removeEventListener(evt, f);
        }
      }

      //MCB every handle (the one used for keydown of document included) will have these events attached
      this.attach("touchstart", this._touchstart.bind(this));
      this.attach("touchmove", this._touchmove.bind(this));
      this.attach("touchend", this._touchend.bind(this));
      this.attach("touchcancel", this._touchend.bind(this));

      if (!svg) {
        this.attach('keydown', function(e) {
          this.fire('keydown', [e]);
        }.bind(this));

        this.attach('focus', function(e) {
          this.fire('focus', [e]);
        }.bind(this));
      }
    },
    
    baseDraggingAttrs : {
      dragOn : false,
      nTouches : 0,
      touches : [],
      distance : false,
      scale : 1,
      start : { // where do we start
        center : false,
        distance : false,
        centerPos : false
      },
      tr : [0,0],
      center : false
    },
    
    detachAll : function() {
      
    },
    
    
    // here, in this.params, the only real thing is touches we update other attr from 
    setAttrsFromTouches : function(touches){
      var n = touches.length,oldN = this.attrs.nTouches;
      if(n == 0) {
        this.resetAttrs();
        return;
      }
      
      var ts = touches[0] ? (touches[1] ? [touches[0],touches[1]] : [touches[0]]) : [];

      if(n == oldN) {
        
        this.setAttrsGeo(ts);
        return;
      } else {// a touche has been removed or added
       // console.log("before touch transfer : "+ts.length+"   n : "+n+ "   old N : "+oldN+" center "+this.attrs.start.center+"  tr :"+this.attrs.tr);
        
        this.touchesTransfer(ts);
        this.setAttrsGeo(ts);
        
       // console.log("after touch transfer : "+ts.length+"   n : "+n+ "   old N : "+oldN+" center "+this.attrs.start.center+"  tr :"+this.attrs.tr);
        return;
      }
      
    },
    
    resetAttrs : function() {
      this.attrs = r.hardClone(this.baseDraggingAttrs);
    },
    
    changeDraged : function(e, newHandle) {
      this._undrag(e);
      //console.log("chgDrag 1"+newHandle+newHandle.device);
      debug = true;
      newHandle.device.manageEvent(e,true);
      this.toDrag = newHandle.device;
    },
    
    // touchesTransfer is the main function of the touch device.
    //
    // when a user use 3 fingers (finger-a,finger-b,finger-c), we just consider the 2 first fingers,
    // if he removed finger-b of the two first fingers, we need to transfer the content of this.attrs, to fake that it had been created by finger-a and finger-c, we transfer the touches from [finger-a,finger-b] to [finger-a,finger-c],
    // it may also works for 4 fingers
    
    
    touchesTransfer : function(touchesAfter) {

      if(touchesAfter.length > 1){
      
        // keep the same scale by faking start distance :
        var distBefore = this.attrs.distance;
        
        var distAfter = this.getDistance(touchesAfter[0].pageX,touchesAfter[0].pageY,touchesAfter[1].pageX,touchesAfter[1].pageY);
        
        // 1/scale == start.distance/distance
        if(distBefore) {
          this.attrs.start.distance = this.attrs.start.distance/distBefore * distAfter;
        } else {
          //console.log("new distance is : "+distAfter);
          this.attrs.start.distance = distAfter;
        }
        
        var centerAfter = this.getCenter(touchesAfter[0].pageX,touchesAfter[0].pageY,touchesAfter[1].pageX,touchesAfter[1].pageY);
        
      } else {
        var centerAfter = [touchesAfter[0].pageX,touchesAfter[0].pageY];
        
      }
      
      // keep the same translation by faking start center
      var centerBefore = this.attrs.center;
     // console.log(centerBefore);
      if (centerBefore) {

        //  trBefore === trAfter
        // C1 - SC1 + (SC1 - SCP)*(1-S) === C2 - SC2 +(SC2-SCP)*(1-S)
        // SC2*(-1+(1-S)) === C1-C2 -SC1 + SC1*(-1+1-S)
        // S*SC2 === C2-C1 + S*SC1
        // SC2 = SC1 + (C2-C1)/S
        
        this.attrs.start.center = this.attrs.start.center.add(centerAfter.minus(centerBefore).multiply(1/(this.attrs.scale||1)));
        
      } else {
        this.attrs.dragOn = true;
        this.attrs.start.center = centerAfter;
        var jEl = r.jQ(this.node);
        //console.log(jEl+this.node+this.number);
        var off = jEl.offset()||[0,0];//[0,0] is for HTML Document
        
        try { //jEl svg bug
          this.attrs.start.centerPos = [(jEl.width()/2+off.left)||0,(jEl.height()/2+off.top)||0];
        } catch (e) {
          this.attrs.start.centerPos = [0,0];
        }

        

      }
      
    },
    
    
    // tches is a n-array with n>0
    setAttrsGeo : function (touches){
    
      // if there is more than 2 touches, we just consider the 2-first ones
      if(touches.length == 2){
      
        this.setDistanceAverageTranslationAndScale(touches);
        
      } else {// touches.length ==1
        //console.log("one touche"+this.attrs.scale);
        this.setTrAndCenter([touches[0].pageX,touches[0].pageY]);
        
      }

    },
    
    
    getDistance : function(x1,y1,x2,y2) {
      return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    },
    
    getCenter : function(x1,y1,x2,y2) {
      return [(x1+x2)/2,(y1+y2)/2]
    },
    
    // here touches is a 2-array
    setDistanceAverageTranslationAndScale : function(touches) {

      this.attrs.distance = this.getDistance(touches[0].pageX,touches[0].pageY,touches[1].pageX,touches[1].pageY);
      
      this.setTrAndCenter(this.getCenter(touches[0].pageX,touches[0].pageY,touches[1].pageX,touches[1].pageY));
      
      //console.log("chg this.attrs.scale  "+this.attrs.distance/this.attrs.start.distance);
      this.attrs.scale = this.attrs.distance/this.attrs.start.distance;

    },
    
    setTrAndCenter : function(point) {
    
      this.attrs.center = point;
      var st = this.attrs.start;
      this.attrs.tr = point.minus(st.center).add(st.center.minus(st.centerPos).multiply(1-(this.attrs.scale||1))).multiply(1/this.attrs.scale);
     // console.log("tr : "+this.attrs.tr+" scale : "+this.attrs.scale+"  centerPos : "+st.centerPos);
    },
    
    _undrag : function(e){
      draggedEl = false;
      draggingEvts && draggingEvts.un();
      draggingEvts = null;
      
      if(this._bounds && this._bounds["iScroll:end"]){
        this.fire("iScroll:end", [e]);
      } else {
        this.fire("drag:end", [e]);
      }
      
      this.resetAttrs();
      if(!this.moved) {
        this.fire("click",[e]);
        return;
      }

      this.moved = false;
    },
    
    _drag : function(e, o) {
      this._touchstart(e);
    },

    
    wrapTouches : function(e) {
    
      var res = e;

      res.touches = e.touches || [];
      
      res.x = this.attrs.center[0];
      res.y = this.attrs.center[1];
      res.xy = this.attrs.center;
      res.halt = function() {
          e.stopPropagation();
          e.preventDefault();
      };
      
      res.target = this.node;
      // Note : we used scaling instead of scale because of a weird bug on IPad
      res.scaling = this.attrs.scale;
      res.translate = this.attrs.tr;
      
      return res;
    },
    
    manageEvent : function(e, o) {
      var res = e;

      res.touches = e.touches || [];

      var n = res.touches.length ,oldN = this.attrs.nTouches;

      this.setAttrsFromTouches(res.touches||[]);
      this.attrs.nTouches = n;

      var evt = this.wrapTouches(e);
      
      //console.log(oldN, n, this.number);
      
      if(oldN == 0 && n > 0) {
        this._drag(evt, o);
      }

      if(oldN > 0 && n == 0) {
        this.onOff(evt, o);
      }
      
      if(oldN == n && n !== 0) {
        this.onChange(evt, o);
      }
      return evt;
    },
    
    //call in the draged device 
    onChange : function(e) {
        //console.log("onChange", this.number, this.toDrag._bounds && this.toDrag._bounds["iScroll:change"]);
        if(this.toDrag._bounds && this.toDrag._bounds["iScroll:change"]){
          //debug&&console.log("fire scroll change"+evt.scale+"  : "+this.attrs.scale);
          this.toDrag.fire("iScroll:change", [e]);
        } else {
          this.toDrag.fire("drag:drag", [e]);
        }
    },

    addTouches : function() {

    },
    
    _touchstart : function(e, o) {
      console.log('touchstart')
      e.halt = e.halt || function() {
        e.stopPropagation();
        e.preventDefault();
      };

      this.fire('mousedown', [e, o]);

      if (['INPUT', 'TEXTAREA'].include(e.target.tagName)) {
        e.stopPropagation();
        return;
      }

      if (drag) {
        return;
      }

      drag = this;
      e.xy = [e.changedTouches[0].clientX || e.changedTouches[0].pageX, e.changedTouches[0].clientY || e.changedTouches[0].pageY];

      this.gesture = new r.Gesture({ touches : e.changedTouches, e : e, noRightClick : this.noRightClick });

      this._sc = e.xy;
      /*this._timeout = setTimeout(function() { //rightclick
        this.fire('rightclick', [e]);
        this._cancel = true;
        document.ontouchmove = null;
        document.ontouchend = null;
        drag = null;
      }.bind(this), 500);*/

      this._cancel = false;

      var touchstart = function(e) {
        if (e.target !== document.getElementById('shift-button')) { //hardcode
          this.gesture.touchstart(e.changedTouches);
          e.stopPropagation();
        }
        //console.log('touchstart!');
      }.bind(this);

      var touchmove = function(e) {
        //console.log('touchmove');
        this.gesture.touchmove(e.changedTouches, e);
        //console.log('touchmove!');

        e.stopPropagation();
      }.bind(this);

      var touchend = function(e) {
        //console.log('touchend');
        this.gesture.touchend(e.changedTouches);
        //console.log('touchend!');

        e.stopPropagation();
      }.bind(this);

      document.addEventListener('touchstart', touchstart, true);
      document.addEventListener('touchmove', touchmove, true);
      document.addEventListener('touchend', touchend, true);

      document.addEventListener('touchcancel', touchend, true);

      //e.preventDefault(); //MCB //

      this.gesture.on('translate', function(tr, e) {
        var evt = {}; // we clone it because scale uses the same event & it will trigger 2 translation if we use a reference
        for (var i in e) {
          evt[i] = e[i];
        }
        evt.translation = tr;
        evt.xy = [e.touches[0].clientX || e.touches[0].pageX, e.touches[0].clientY || e.touches[0].pageY];
        evt.center = this.gesture.center;
        this.fire('drag:drag', [evt])
      }.bind(this), this);

      this.gesture.on('scale', function(scale, e) {
        e.scale = scale;
        e.center = this.gesture.center;
        this.fire('drag:drag', [e]);
      }.bind(this), this);

      this.gesture.on('longtap', function() {
        this.fire('rightclick', [e]);
      }.bind(this), this);

      this.gesture.on('tap', function() {
        this.fire('click', [e]);
      }.bind(this), this);

      this.gesture.on('destroy', function() {
        drag = null;
        document.removeEventListener('touchstart', touchstart, true);
        document.removeEventListener('touchmove', touchmove, true);
        document.removeEventListener('touchend', touchend, true);
        this.fire('drag:end', [e]);
      }.bind(this), this);

      this.fire('drag:start', [e, o]);
    },
    
    _touchmove : function(e) {
      if (this._cancel || (drag !== this)) return;
      //console.log('GO' + this.number);
      e.xy = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

      if (e.touches.length > 1) {

      }

      if (this._timeout) {
        if (this._sc.minus(e.xy).dist() > tolerance) { 
          clearTimeout(this._timeout);
          this._timeout = null;
          this.fire('drag:drag', [e]);
        }
      }
      else {
        this.fire('drag:drag', [e]);
      }

      e.preventDefault();
    },

    preventRightClick : function() {
      this.gesture.preventRightClick();
    },

    preventRightClick : function() {
      this.gesture.preventRightClick();
    },
    
    _touchend : function(e) {
      if (this._cancel || (drag !== this)) return;
      document.ontouchmove = null;
      document.ontouchend = null;
      e.xy = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

      drag = null;
      //console.log('drag to null touchend');

      if (this._timeout) { //no move
        clearTimeout(this._timeout);
        this._timeout = null;

        this.fire('click', [e]);
      }
      this.fire('drag:end', [e]);

      //e.preventDefault(); //MCB //

      /*
      e.preventDefault();
      e.stopPropagation();*/
    },

    wrapKey : function(e) {
    
      e = this.wrap(e);
      e.shift = (e.keyCode === 16);
      e.enter = (e.keyCode === 13);
      console.log(e.keyCode);
      return (e);
      
    },

    wrap : function(e) {
      e.halt = function() {
        e.stopPropagation();
        e.preventDefault();
      };

      if (e.changedTouches) { // not happening for a keyboard input
        e.xy = e.xy || [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
      }

      return e;
    },
    
    cancelDrag : function(e, cancel) {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }

      drag = null;
      console.log('canceDrag?to:' + cancel.to);
      if (cancel && cancel.to) {
        cancel.to.draged(e);
      }
    },
    
    draged : function(e, o) {
      if (!o) o = {};
      o.force = true;
      if (drag) {
        drag.cancelDrag();
        drag = null;
      }

      this._touchstart(e, o);
    }
  });

  return Ipad;

});
