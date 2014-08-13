sand.define('Compagnon/Item', function (r) {
  return Seed.extend ({
    '+init' : function (input) {
      this.el = toDOM({
        tag : '.item',
      })

      input ? this.input = jQuery.extend({},input) : this.input = {};
      this.type = input ? (input.type ? input.type : 'item') : 'item';
      this.preview;

      this.legend = toDOM({
        tag : '.legend',
        attr : {
          contenteditable : true,
        },
        events : {
          keyup : function () {
            this.fire('item:legendUpdated',this.legend.innerHTML);
          }.bind(this)
        },
        innerHTML : this.input.legend || ""
      })

    },

    swap : function (type) {// Va être rendu obsolète par workspace:swap
      this.type = type
      this.fire('item:swap', this.type)
    },
  })
})