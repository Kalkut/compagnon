sand.define('Compagnon/TopBar',['Compagnon/Ressource'], function  (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.ressources = input ? (input.ressources ? input.type : [new r.Ressource()]) : [new r.Ressource()];
      this.currentIndex = input ? (input.index ? input.index : 0 ) :  0;

      this.el = toDOM({
        tag : '.items-block',
        children : [
        {
          tag : '.select',
        },
        {
          tag : '.items', //CHILDREN ARE '.item'
        }]
      })

      for (var i = 0, n = this.ressources.length; i++; i < n) {
        this.el.children[1].appendChild(this.ressources[i].el);
      }

    },

    addRessource : function () {
      var newR = new r.Ressource()
      this.ressources.push(newR)
      this.fire('topBar:addedRessource');
    },

    deleteRessource : function (i) {
      this.ressources.splice(i,1);
      this.fire('topBar:deletedRessource')
    }

  })
})