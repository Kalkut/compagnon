sand.define('Compagnon/Image',['Compagnon/Item','Case'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {
      this.type = "image";
      this.el.className += " image";

      this.imgCase = new r.Case({
        width : window.innerWidth*0.676, 
        height : window.innerHeight*0.353,
        imgSrc : input.link || '',
        type : 'img'
      });


      this.el.appendChild(this.imgCase.div);
      this.el.appendChild(this.legend);

    }
  })
})