sand.define('DOM/devices/Firefox', [
  'Seed'
],
  function(r) {

  var drag = null, detach = null;
  var mousemove;
  var id = 0, evtId = 0;

  var Firefox = r.Seed.extend({
    
    cancelDrag : function() {
      //console.log('cancelDrag', this.id);
      this.detach("mouseup");
      this.detach("mousemove");
      $(document).unbind('mousemove', mousemove);
      //document.onmousemove = null;
      document.onmouseup = null;
      drag = null;
      //console.log('cancelDrag end');
    },
    
    detachAll : function() {
      for (var i in this.attached) this.detach(i);
    },
      
    init : function(o) {
      this.id = ++id;
      var svg = o.svg, node = o.node;
      this.node = node;
      
      this.attached = {};
      
      if (svg) {
        this.attach = function(evt, f) {
          if (node.each) {
            node.each(function(n) {
              if (!n.attach) {
                n[evt](f);
              }
              else n.attach(evt, f);
            });
          }
          else {
            if (node.attach) node.attach(evt, f);
            else node[evt](f);
          }
          this[evt] = f;
        }.bind(this);

        this.detach = function(evt) {
          if (node.each) {
            node.each(function(n) {
              if (!n.detach) {
                //n[evt](function() {});
                n['un' + evt](this[evt]);
              }
              else n.detach(evt);
            }.bind(this));
          }
          else {
            if (node.detach) {
              node.detach(evt);
            }
            else node["un"+evt](this[evt]);
          }
        };
        this.svg = true;
      }
      else
      {
        this.attach = function(evt, f) {
          //nde["on"+evt] = f;
          
          this.attached[evt] = true;
          if(false && node["on"+evt]) {
            console.log('please dont happen!');
            var oldF = node["on"+evt];
            node["on"+evt] = (function() {
                var evt2 = evt;
                return function() {
                  var a = oldF.apply(this,arguments);
                  // respect return false convention
                  if(a !== false){
                    f.apply(this,arguments);
                  }
                }
            })();
          } else {
            if (node.each) {
              node.each(function(n) {
                n["on"+evt] = f;
              })
            }
            else node["on"+evt] = f;
          }
          
          this.attached[evt] = true;
        }.bind(this);

        this.detach = function(evt) {
          if (node.each) {
            node.each(function(n) {
              n["on"+evt] = null;
            });
          }
          else node["on"+evt] = null;
          
          this.attached[evt] = false;
        };
      }
      this.preventSelect = !!o.preventSelect;
      this.$listeners = {};
      this.$observers = [];
    },
    
    changeDraged : function(e, newHandle) {
      this.undrag(e);
      newHandle.draged(e);
    },

    wrapKey : function(e) {
    
      e = this.wrap(e);
      e.shift = (e.keyCode === 16);
      e.enter = (e.keyCode === 13);
      e.escape = (e.keyCode === 27);
      e.backspace = (e.keyCode === 8);
      return (e);
      
    },

    wrap : function(e) {
    
      e.halt = function() {
        e.stopPropagation();
        e.preventDefault();
      }.bind(this);
      e.xy = [e.clientX,e.clientY];
      //e.x = e.clientX; MCB
      //e.y = e.clientY;
      e.rightClick = ((e.which && e.which === 3) || (e.button && e.button == 2));

      return e;
    },

    scroll : {name : "DOMMouseScroll"},

    scrollWrap : function(f, scope) {
     var self = this;
     return function(e){
        f.call(scope, {scale : (e.deltaY > 0) ? 2 : 0.5, xy : [e.clientX, e.clientY], e : self.wrap(e)});
      };
    },

    attachScroll : function() {
      this.node.addEventListener("wheel", function(e) {
        e = this.wrap(e);
        e.scale = (e.deltaY > 0) ? 2 : 0.5;
        this.fire("scroll", [e]);
      }.bind(this) ,true);
    },

    undrag : function(e, o) {
      ++evtId;
      
      //console.log('undrag', this.id);
      
      e = this.wrap(e);
      if (!this.right) this.fire("drag:end", [e]);
      if (!this.moved && !this.right) {
        this.fire("click", [e]);
      }

      this.detach("mousemove");
      this.detach("mouseup");
      
      $(document).unbind('mousemove', mousemove);
      //document.onmousemove = null;
      document.onmouseup = null;

      drag = false;
      detach = false;
      
      if (this.right) return;
      o && o.end && o.end(e);
    },

    draged : function(e, o) {
      if (!o) o = {};
      o.force = true;
      this._drag(e, o);
      this.moved = true;
    },

    _drag : function(e, o) {
      if (drag) return; // && (!o || !o.force)
      
      //console.log('drag', this.id);
      if (this.preventSelect) {
        // cursor text on Chrome (see http://stackoverflow.com/questions/2745028/chrome-sets-cursor-to-text-while-dragging-why)
        e.preventDefault();
      }
      
      drag = this.node;
      e = this.wrap(e);
      this.moved = false;

      var f1 = function(e) {
        if (this.right) return;
        e = this.wrap(e);
        this.moved = true;
        this.fire("drag:drag", [e]);

        e.halt();
      }.bind(this);
      
      mousemove = f1;
      
      $(document).bind('mousemove', mousemove);
      this.attach("mousemove", f1);

      document.onmouseup = function(e) {
        this.undrag(e, o);
      }.bind(this);
      
      this.attach("mouseup", function(e) {
        document.onmouseup(e);
        // world's worst hack
        // sometimes drags are overriden (see vertice & multipleSelect),
        // so the mouseup of the first attachment must be the one of the lastest, which is always document.onmouseup
        // most of the times this function is the same as this.undrag.bind(this)
      }.bind(this));
      
      if (e.which === 3 || e.rightClick) {
        this.right = true;
        this.fire('rightclick', [e]); // right click
      }
      else {
        this.right = false;
        this.fire("drag:start", [e, o]);
      }
      //MCB
      //e.halt();
    },


    //tomove
    isDescendantOf : function(parent) {
      var node = this.node;
      while (node !== null) {
        if (node == parent){
          return true;
        }
        node = node.parentNode;
      }
    },

    isAncestorOf : function(child) {
      var rec = function(node) {
        var childs = node.childNodes;
        for (var i = childs.length;i--;) {
          if (childs[i] === child || rec(childs[i])) {
            return true;
          }
        }
        return false;
      };
      return rec(this.node);
    },

    on : function(evtName, f, scope) {
      var group;

      if (evtName === "drag:start"||evtName === "drag:drag"||evtName==="drag:end") group = "drag";
      else group = evtName;

      if (!this["isListeningTo"+group.capitalize()]) {
        if (group === "drag") {
          this.attach("mousedown", this._drag.bind(this));
        }
        else if (evtName === "click") {
          if (typeof(this.isListeningToDrag) === "undefined") {
            this.attach("click", function(e) {
              e = this.wrap(e);
              this.fire("click", [e]);
            }.bind(this));
          }
        }
        else if (evtName === "dblclick") {
          if (typeof(this.isListeningToDrag) === "undefined") {
            this.attach("click", function(e) {
              e = this.wrap(e);
              var d = new Date();
              if (this._lastClickDate && d - this._lastClickDate < 250) { // dblclick
                if (this._clickTimeout) clearTimeout(this._clickTimeout);
                this.fire("dblclick", [e]);
                this._lastClickDate = null;
              }
              else {
                this._clickTimeout = setTimeout(function() {
                  this.fire("click", [e]);
                }.bind(this), 10);
                this._lastClickDate = new Date();
              }
              e.halt();
            }.bind(this));
          }
          else {
            this.on("click", function(args) {

              var e = args[0];
              var d = new Date();

              if (this._lastClickDate && d - this._lastClickDate < 250) { // dblclick
                if (this._clickTimeout) clearTimeout(this._clickTimeout);
                this.fire("dblclick", [e]);
                this._lastClickDate = null;
              }

              this._lastClickDate = new Date();

            }.bind(this));
          }
        }
        else if (evtName === "over") {
          this.attach("mouseover", function(e) {
            e = this.wrap(e);
            this.fire("over", [e]);
          }.bind(this));
        } else if (evtName === "out") {
          this.attach("mouseout", function(e) {
            e = this.wrap(e);
            this.fire("out", [e]);
          }.bind(this));
        }
        else if (evtName === "keyDown") {
          this.attach("keydown", function(e) {
            e = this.wrapKey(e);
            this.fire("keyDown", [e]);
          }.bind(this));
        }
        else if (evtName === "keyUp") {
          this.attach("keyup", function(e) {
            e = this.wrapKey(e);
            this.fire("keyUp", [e]);
          }.bind(this));
        }
        else if (evtName === "scroll"){
          this.attachScroll();
        }
        else if (evtName === "contextmenu") {
          this.attach("contextmenu", function(e){
            e = this.wrap(e);
            this.fire("contextmenu", [e]);
          }.bind(this));
        } else if (evtName === "mousedown") {//mousedown can halt() parent drag
          this.attach("mousedown", function(e){
            e = this.wrap(e);
            this.fire("mousedown", [e]);
          }.bind(this));
        } else if (evtName === "mouseup") {//mouseup can halt() parent drag
          this.attach("mouseup", function(e){
            e = this.wrap(e);
            this.fire("mouseup", [e]);
          }.bind(this));
        }

        this["isListeningTo"+group.capitalize()] = true;
      }

      return (r.Seed.prototype.on.call(this, evtName, f, this));
    }

  });
  
  return Firefox;

});
