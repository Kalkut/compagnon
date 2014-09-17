sand.define('Compagnon/Drawing', [
  'Compagnon/Item',
  'drawing/Canvas',
  'DOM/toDOM'
], function (r) {
  
  return r.Item.extend({
    '+init' : function (input) {//color:pic
      this.type = "drawing";
      this.el.className += " drawing";
      
      this.canvas = new r.Canvas({
        canvas : $('<canvas></canvas>').attr({width : window.innerWidth*0.48, height : window.innerHeight*0.366 })[0],
        curSize : 5,
        curTool : "marqueur",
        curColor : '#408486',
        paths : (input && input.paths) ? input.paths : []
      });

      this.canvas.on('edit', function() {
        this.fire('edit');
      }.bind(this), this);

      if(input && input.paths) {
        this.canvas.paths = input.paths;
        this.canvas.redraw();
      }

      this.canvas.removeBorder();
      
      this.legend.addEventListener("keyup", function () {
      })

      this.canvas.on("canvas:newPath", function (paths) {
        if(this.actions && this.cancel) {
          for(var i = 0; i <= this.cancel; i++ ) {
            this.actions.pop();
          }
          this.cancel = 0;
        }
        this.fire('item:isDrawing', paths)
        this.actions.push('draw');
      }.bind(this));

      this.canvas.el.addEventListener("mouseup", function () {
        this.preview = this.canvas.bg.toDataURL();
        this.fire('Item:snapshotTaken',this.canvas.bg.toDataURL())
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

    undo : function () {
      if(this.actions) {
        this.actions[this.actions.length - 1 - this.cancel] === "type" ? document.execCommand("undo") : this.canvas.undo()
        this.cancel++;
      }
    },

    redo : function () {
      if(this.actions) {
        this.cancel--
        this.actions[this.actions.length - 1 - this.cancel] === "type" ? document.execCommand("redo") : this.canvas.redo()
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
        legend : this.input.legend
      }
    }
  })
})