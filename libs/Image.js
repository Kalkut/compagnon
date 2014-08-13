sand.define('Compagnon/Image',['Compagnon/Item'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {
      this.type = "image";
      this.el.className += " image";
    }
  })
})