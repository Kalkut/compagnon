sand.define('Compagnon/Item', function (r) {
  return Seed.extend ({
    '+init' : function (input) {
      this.el = toDOM({
        tag : '.item',
        children : [
        {
          tag : '.scotch',
        },
        {
          tag : '.content',
          children : [{
            tag : '.keyboard',
          }]
        }]
      })

      input ? this.input = jQuery.extend({},input) : this.input = {};
      this.type = input ? (input.type ? input.type : 'item') : 'item';
      this.preview;
    },

    swap : function (type) {// Va être rendu obsolète par workspace:swap
      this.type = type
      this.fire('item:swap', this.type)
    },
  })
})