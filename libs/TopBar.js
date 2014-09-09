sand.define('Compagnon/TopBar',['Compagnon/Ressource','DOM/handle'], function  (r) {
  Function.prototype.curry = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    //console.log(args);
    return function () { return self.apply([],args.concat(Array.prototype.slice.call(arguments)));};
  }

  return Seed.extend({
    '+init' : function (input) {
      this.ressources = [];
      this.currentIndex = input ? (input.currentIndex ? input.currentIndex : 0 ) :  0;
      this.scope = {}
      this.el = toDOM({
        tag : '.items-block',
        children : [
        {
          tag : '.select',
        },
        {
          tag : '.items', //CHILDREN ARE '.item'
        }]
      },this.scope)

    },

  })
})