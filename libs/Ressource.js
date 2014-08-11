sand.define('Compagnon/Ressource', function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.el = toDOM({
        tag : '.item',
      })

      this.type = input ? (input.type ? input.type : 'item') : 'item';
      this.preview;


    },

    update : function (type) {
      this.type = type;
      this.fire('ressource:update')
    }
  })
})