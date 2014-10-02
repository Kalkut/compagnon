sand.define('Compagnon/Drawing', [
  'Compagnon/Item',
  'drawing/Canvas',
  'DOM/handle',
  'DOM/toDOM'
], function (r) {
  
  return r.Item.extend({
    '+init' : function (input) {//color:pic
      this.type = "drawing";
      this.el.className += " drawing";
      
      this.canvas = new r.Canvas({
        canvas : $('<canvas></canvas>').attr({width : window.innerWidth*0.48*1.5, height : window.innerHeight*0.366*1.5 })[0],
        curSize : 5,
        curTool : "marqueur",
        curColor : '#408486',
        paths : (input && input.paths) ? input.paths : [],
        cancel : typeof(input.canvasCancel) == "number" ? input.canvasCancel : null
      });

      if(input.paths) this.setState(input.paths);

      this.canvas.on('edit', function() {
        this.fire('edit',this.getData());
      }.bind(this), this);

      this.canvas.removeBorder();
      

      this.canvas.on("canvas:newPath", function (paths) {
        if(this.actions && this.cancel) {
          for(var i = 0; i <= this.cancel; i++ ) {
            this.actions.pop();
          }
          this.cancel = 0;
        }
        this.fire('item:isDrawing', paths);
        
      }.bind(this));


      this.canvas.on("end", function () {
        this.preview = this.canvas.bg.toDataURL();
        this.fire('Item:snapshotTaken',this.canvas.bg.toDataURL())
        this.actions.push({'type' : 'draw'});
        this.fire('action',{'action' : 'itemAction', "type" : "draw", "data" : this.getData()})
      }.bind(this));

      this.canvas.on("start", function () {
        this.legend.blur();
      }.bind(this));


      this.undoRedoClear = r.toDOM({
        tag : '.undo-redo-clear',
        children : [
        {
          tag : '.drawing-undo',
          events : {
            mousedown : function () {
              this.canvas.undo();
            }.bind(this)
          }
        },
        {
          tag : '.drawing-redo',
          events : {
            mousedown : function () {
              this.canvas.redo();
            }.bind(this)
          }
        },
        {
          tag : '.drawing-clear',
          events : {
            mousedown : function () {
              this.canvas.clear();
            }.bind(this)
          }
        }]
      })

      this.canvas.el.appendChild(this.undoRedoClear);
      this.el.appendChild(this.canvas.el);
      this.el.appendChild(this.legend);
      this.preview = this.canvas.bg.toDataURL();
      
    },

    /*undo : function () {
      this.noFireAllowed = true;
      if(this.actions[this.actions.length - this.cancel - 1 ]) {
        if(this.actions[this.actions.length - 1 - this.cancel].type === "draw") this.canvas.paths = this.actions[this.actions.length - 1 - this.cancel].ePaths.slice() || [];
        //console.log(this.canvas.paths)
        this.actions[this.actions.length - 1 - this.cancel].type === "type" ? this.legend.innerHTML = this.actions[this.actions.length - 1 - this.cancel].eLegend  : this.canvas.cRedraw(); //this.canvas.undo()
        this.cancel++;
      }
    },

    redo : function () {
      this.noFireAllowed = true;
      if(this.actions[this.actions.length - this.cancel]) {
        this.cancel--
        this.canvas.paths = this.actions[this.actions.length - 1 - this.cancel].paths.slice() || [];
        this.actions[this.actions.length - 1 - this.cancel].type === "type" ? this.legend.innerHTML = this.actions[this.actions.length - 1 - this.cancel].eLegend  : this.canvas.cRedraw(); //this.canvas.redo()
      }
    },*/

    undo : function () {
      this.noFireAllowed = true;
      if(this.actions[this.actions.length - this.cancel - 1]) {
        this.cancel++;
        if(this.actions[this.actions.length - this.cancel].type === "type"){
          this.legend.innerHTML = this.actions[this.actions.length -  this.cancel].sLegend
          this.fire('item:legendUpdated',this.legend.innerHTML);
        } else {
          this.canvas.undo()
          this.fire('Item:snapshotTaken',this.canvas.bg.toDataURL());
        }
      }
    },

    redo : function () {
      this.noFireAllowed = true;
      if(this.actions[this.actions.length - this.cancel]) {
        if(this.actions[this.actions.length - this.cancel].type === "type") {
          this.legend.innerHTML = this.actions[this.actions.length - this.cancel].eLegend;
          this.fire('item:legendUpdated',this.legend.innerHTML);
        }else {
            this.canvas.redo();
            this.fire('Item:snapshotTaken',this.canvas.bg.toDataURL());
        }
        this.cancel--;
      }
    },

    setColor : function (color) {
      this.canvas.curColor = color;
    },

    getData : function() {
      return {
        type : 'drawing',
        id : this.id,
        paths : this.canvas.paths,
        size : [this.canvas.canvas.offsetWidth, this.canvas.canvas.offsetHeight],
        legend : this.input.legend,
        actions : this.actions,
        cancel : this.cancel,
        canvasCancel : this.canvas.cancel
      }
    },

    setState : function (paths) {
      this.canvas.paths = paths;
    },

    drawState : function () {
      this.canvas.redraw();
    }
  })
})