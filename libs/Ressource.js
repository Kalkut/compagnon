sand.define('Compagnon/Ressource', function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.type = input ? (input.type ? input.type : 'drawing') : 'drawing';
      this.preview;

      this.el = toDOM({
        tag : '.mini-item.' + this.type,
      })


    },

    update : function (type) {
      this.type = type;
      this.fire('ressource:update')
    }
  })
})