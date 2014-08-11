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

      this.type = input ? (input.type ? input.type : 'item') : 'item';
      this.preview;

    },

    update : function () {
      this.fire('item:update',this.type);
    },

    swap : function (type) {
      this.type = type
      this.fire('item:swap', this.type)
    },
  })
})