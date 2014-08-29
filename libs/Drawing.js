sand.define('Compagnon/Drawing',['Compagnon/Item','drawing/Canvas'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {//color:pic
      this.type = "drawing";
      this.el.className += " drawing";
      
      this.canvas = new r.Canvas({
        canvas : $('<canvas></canvas>').attr({width : window.innerWidth*0.894, height : window.innerHeight*0.38 })[0],
        curSize : 5,
        curTool : "marqueur",
        curColor : '#7c9cbc',
        paths : (input && input.paths) ? input.paths : []
      });

      if(input && input.paths) {
        this.canvas.paths = input.paths;
        this.canvas.redraw();
      }

      this.canvas.on("canvas:newPath", function (paths) {
        this.fire('item:isDrawing', paths)
      }.bind(this));

      this.el.appendChild(this.canvas.el);
      this.el.appendChild(this.legend);

    }
  })
})