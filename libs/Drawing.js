sand.define('Compagnon/Drawing',['Compagnon/Item','drawing/Canvas'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {//color:pic
      this.type = "drawing";
      this.el.className += " drawing";
      
      this.canvas = new r.Canvas({
        canvas : $('<canvas></canvas>').attr({width : window.innerWidth*0.676, height : window.innerHeight*0.353 })[0],
        curSize : 5,
        curTool : "marqueur",
        curColor : '#7c9cbc',
        paths : (input && input.paths) ? input.paths : []
      });

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
        this.fire('Item:snapshotTaken',this.canvas.bg.toDataURL())
      }.bind(this));

      this.el.appendChild(this.canvas.el);
      this.el.appendChild(this.legend);
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
    }
  })
})