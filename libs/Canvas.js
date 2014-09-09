sand.define('drawing/Canvas',['drawing/Buttons'], function (req) {
  Function.prototype.curry = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    return function () { return self.apply([],args.concat(Array.prototype.slice.call(arguments)));};
  }

  Array.prototype.each = function (f) {
    for (var i = 0, n = this.length; i < n; i++){
      f(this[i],i);
    }
  }

  Array.prototype.last = function () {
    return this[this.length-1];
  }

  var Buttons = req.Buttons;

  var trace = function (canvas,path){
    var context = canvas.getContext('2d');
    context.strokeStyle = path.color;
    context.lineWidth = path.size;
    context.globalAlpha = path.alpha;
    context.globalCompositeOperation = path.compo;
    context.beginPath();
    context.moveTo(path.points[0][0], path.points[0][1]);

    path.points.each(function(point,i) {
      if (i)context.lineTo(point[0],point[1]);
    })

    context.stroke();
    context.closePath();
  }

  return Seed.extend({

    '+init' : function(obj) {


     this.canvas = obj.canvas;
     this.canvas.style.border = '1px solid #000000'
     this.context = this.canvas.getContext("2d");

     this.clicking = false;

	        //Tableau des noms de couleur, taille et outils
	        this.idColor = obj.idColor;
         this.idSize = obj.idSize;
         this.idTool = obj.idTool;


         this.paths = obj.paths || [];


        	//Tableau des valeurs de couleur, taille et outils
        	this.tableColor = obj.tableColor;
        	this.tableSize = obj.tableSize;
        	this.tableTool = obj.tableTool;
        	
        	//Taille,outil,couleur courante
        	this.curSize = obj.curSize;
        	this.curColor = obj.curColor;
        	this.curTool = obj.curTool;
        	this.cancel = this.paths.length;

        	this.bg = document.createElement('canvas');
        	this.bg.width = this.canvas.width;
        	this.bg.height = this.canvas.height;
        	this.bg.style.border = '1px solid #000000';
        	this.bg_ctx = this.bg.getContext('2d');

          var div = document.createElement('div');

          this.fg = this.canvas;
          this.fg.style.position = "absolute"
          this.fg.style.zIndex = "1"
          this.fg_ctx = this.fg.getContext('2d');

          div.appendChild(this.fg);
          div.appendChild(this.bg);
          this.el = div;
          this.el.className = "drawing-canvas";

          var draw = this;

          this.canvas.onmousedown = function(e) { 
            var x = (e.pageX - $(this.canvas).offset().left);
            var y = (e.pageY - $(this.canvas).offset().top);

            var o = {type : this.curTool, size : this.curSize, color : this.curColor, points : [[x,y]]};

            if (draw.curTool === 'crayon'){
              o.alpha = 0.4;
              o.compo = "source-over";
            }else if (draw.curTool === 'feutre'){
              o.alpha = 0.4;
              o.compo = "source-over";
            }else if (draw.curTool === 'marqueur'){
              o.alpha = 1;
              o.compo = "source-over";
            }else if (draw.curTool === 'gomme') {
              o.alpha = 1;
              o.compo = "destination-out";
            }

            if (this.paths.length > this.cancel) {
              for(var i = 0, n = this.paths.length - this.cancel; i<n; i++){
               this.paths.pop();
             }
           }
           this.paths.push(o);

           this.cancel = this.paths.length;
           draw.clicking = true;

         }.bind(this);


         this.canvas.onmouseup = function(e) {

           this.clicking = false;
           trace(this.bg,this.paths.last())
           this.fire('canvas:newPath',this.paths.last());

         }.bind(this)

         this.canvas.onmouseleave = function(e) {
           draw.clicking = false;
         };


         this.canvas.onmousemove = function(e) {
           if(draw.clicking){
            var x = (e.pageX - $(this.canvas).offset().left);
            var y = (e.pageY - $(this.canvas).offset().top);

            this.paths.last().points.push([x,y])
            this.fg_ctx.clearRect(0, 0, this.fg.width, this.fg.height);
            if(this.curTool == "gomme") trace(this.bg,this.paths.last());
            else trace(this.fg,this.paths.last());
          }
        }.bind(this);

      },

    	//Ajoute ou enlève une bordure
    	addBorder : function () { 
        this.canvas.style.border = '1px solid #000000';
        this.bg.style.border = '1px solid #000000'; 
      },

    	removeBorder : function () {
        this.canvas.style.border = null; 
        this.bg.style.border = null;
      },

    	//Met à jour la taille du canvas
    	updateCanvas : function (width,height) {
       this.canvas.width = width;
       this.canvas.height = height;
       console.log('Canvas updated : Width is ' + width + ' px and height is ' + height + ' px')
     },

     undo : function () {
      if (this.paths.length && this.cancel) {
       this.cancel--;
       this.bg_ctx.clearRect(0, 0, this.bg.width, this.bg.height);
       this.fg_ctx.clearRect(0, 0, this.fg.width, this.fg.height);
       for (var i = 0; i < this.cancel; i++){
        console.log(this.paths[i])
        if(this.paths[i] === "clear") {
          this.bg_ctx.clearRect(0, 0, this.bg.width, this.bg.height);
          this.fg_ctx.clearRect(0, 0, this.fg.width, this.fg.height); 
        }else trace(this.bg,this.paths[i]);
      }
    };
  },

  redo : function () {
    if (this.cancel < this.paths.length) {
      if(this.paths[this.cancel] === "clear") {
          this.bg_ctx.clearRect(0, 0, this.bg.width, this.bg.height);
          this.fg_ctx.clearRect(0, 0, this.fg.width, this.fg.height); 
        }else trace(this.bg,this.paths[this.cancel]);
      this.cancel++;
    };
    console.log(this.paths);
    console.log(this.cancel)
  },

  clear : function () {
    this.bg_ctx.clearRect(0, 0, this.bg.width, this.bg.height);
    this.fg_ctx.clearRect(0, 0, this.fg.width, this.fg.height);
    this.paths.push("clear");
    this.cancel = this.paths.length;
    console.log(this.paths);
  },

  setToolAt : function(tool){
    this.curTool = tool;
  },

  setToolButtons : function(){
    this.toolButtons = new Buttons(this.tableTool.length,this.tableTool);

    for(var i = 0, n = this.tableTool.length; i < n; i++){
     this.toolButtons.table[i].onclick = function(i) {
      this.setToolAt(this.tableTool[i])
    }.bind(this).curry(i);
  }
},

setUndoRedoButtons : function(){
  this.undoRedoButtons = new Buttons(3,["Annuler","Rétablir"]);

  this.undoRedoButtons.table[0].onclick = function() {
    this.undo();
    console.log('Annulé')
  }.bind(this);

  this.undoRedoButtons.table[1].onclick = function() {
    this.redo()
  }.bind(this);
},

setSizeButtons : function () {
  this.sizeButtons = new Buttons(this.tableSize.length,this.idSize);

  for(var i = 0, n = this.tableSize.length; i < n; i++){
    this.sizeButtons.table[i].onclick = function(i) {
      this.curSize = this.tableSize[i];
    }.bind(this).curry(i);
  }
},

redraw : function () {
  for (var i = 0; i < this.paths.length; i++){
        trace(this.bg,this.paths[i])
      }
},

setResponsive : function () {
  this.fg.style.height = "100%";
  this.fg.style.width = "100%";
  this.bg.style.top = "0px";
  this.bg.style.width = "100%";
}


});
});