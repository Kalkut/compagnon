sand.define('Compagnon/Image',['Compagnon/Item','Case'], function (r) {
  return r.Item.extend({

    '+init' : function (input) {
      this.type = "image";
      this.el.className += " image";

      this.imgCase = new r.Case({
        width : window.innerWidth*0.48, 
        height : window.innerHeight*0.366,
        imgSrc : input.link || '',
        type : 'img'
      });

      this.src = input.link;

      this.preview = input.link || '';

      this.el.appendChild(this.imgCase.div);
      this.el.appendChild(this.legend);
    },

    getData : function() {
      return {
        id : this.id,
        type : 'image',
        src : this.src,
        legend : this.input.legend
      }
    }

  })
})