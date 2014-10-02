sand.define('Compagnon/TopBar', [
  'Compagnon/Ressource',
  'DOM/handle',
  'Seed',
  'DOM/toDOM'
], function  (r) {
 
 return r.Seed.extend({

    '+init' : function (input) {
      this.ressources = [];
      this.currentIndex = input ? (input.currentIndex ? input.currentIndex : 0 ) :  0;
      this.scope = {}
      this.el = r.toDOM({
        tag : '.items-block',
        children : [
        {
          tag : '.select',
          innerHTML : "SELECT",
        },
        {
          tag : '.items', //CHILDREN ARE '.item'
        }]
      },this.scope)

      this.items = this.scope.items;

    },

  });

});
