sand.define('Compagnon/Image',['Compagnon/Item','Case'], function (r) {
  return r.Item.extend({

    '+init' : function (input) {
      this.type = "image";
      this.el.className += " image";

      this.imgCase = new r.Case({
        width : window.innerWidth*0.48*1.5, 
        height : window.innerHeight*0.366*1.5,
        imgSrc : input.link || '',
        type : 'img'
      });

      this.src = input.link;

      this.preview = input.link || '';

      if(input.imgLeft && input.imgTop && input.imgWidth && input.imgHeight && input.imgRect) this.setState({
        rect : input.imgRect,
        left : input.imgLeft,
        top : input.imgTop,
        width : input.imgWidth,
        height : input.imgHeight
      })

      this.imgCase.on('case:imageMovedPx', function () {
        this.fire('edit',this.getData())
      }.bind(this))

      this.el.appendChild(this.imgCase.div);
      this.el.appendChild(this.legend);

      this.imgCase.on('caseAction', function(act) {
        var action = {'action' : 'itemAction', 'item' : this, "type" : "caseAction" }
        this.fire('action',action);
        this.actions.push(action);
        //console.log(action)
      }.bind(this))
    },

    getData : function() {
      return {
        id : this.id,
        type : 'image',
        src : this.src,
        legend : this.input.legend,
        imgLeft : this.imgCase.img.style.left,
        imgTop : this.imgCase.img.style.top,
        imgWidth : this.imgCase.img.style.width,
        imgHeight : this.imgCase.img.style.height,
        imgRect : this.imgCase.imgRect,
        actions : this.actions,
        link : this.src,
        cancel : this.cancel
      }
    },

    /*undo : function () {
      this.noFireAllowed = true;
      if(this.actions) {
        this.actions[this.actions.length - 1 - this.cancel].type === "type" ? this.legend.innerHTML = this.actions[this.actions.length - 1 - this.cancel].sLegend  :  this.imgCase.undo(this.actions[this.actions.length - 1 - this.cancel].sLegend || null)
        this.cancel++;
      }
    },

    redo : function () {
      this.noFireAllowed = true;
      if(this.actions && this.cancel > 0) {
        this.cancel--
        this.actions[this.actions.length - 1 - this.cancel].type === "type" ? this.legend.innerHTML = this.actions[this.actions.length - 1 - this.cancel].eLegend  :  this.imgCase.redo(this.actions[this.actions.length - 1 - this.cancel].sLegend || null)
      }
    },*/

    undo : function () {
      if(this.actions[this.actions.length - this.cancel - 1]) {
        this.cancel++;
        this.actions[this.actions.length - this.cancel].type === "type" ? this.legend.innerHTML = this.actions[this.actions.length - 1 - this.cancel].sLegend  :  this.imgCase.undo()
      }
    },

    redo : function () {
      if(this.actions[this.actions.length - this.cancel + 1]) {
        this.cancel--;
        this.actions[this.actions.length - this.cancel].type === "type" ? this.legend.innerHTML = this.actions[this.actions.length - 1 - this.cancel].eLegend  :  this.imgCase.redo()
      }
    },

    setState : function (state) {
      this.imgCase.setState(state);
    }
  })
})