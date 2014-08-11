sand.define('Compagnon/TopBar',['Compagnon/Ressource','DOM/handle'], function  (r) {
  Function.prototype.curry = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    //console.log(args);
    return function () { return self.apply([],args.concat(Array.prototype.slice.call(arguments)));};
  }

  return Seed.extend({
    '+init' : function (input) {
      this.ressources = input ? (input.ressources ? input.type : [new r.Ressource()]) : [new r.Ressource()];
      this.currentIndex = input ? (input.index ? input.index : 0 ) :  0;
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

      for (var i = 0, n = this.ressources.length; i < n; i++) {
        this.scope.items.appendChild(this.ressources[i].el);
        
        

        var bobby = this.ressources[i].el;
        r.handle(this.ressources[i].el).drag({
          start : function(e) {
            var x = e.xy[0];
            var y = e.xy[1];
          }.wrap(this),

          drag : function(e) {
            bobby.style.left = e.xy[0];
            bobby.style.top = e.xy[1];
          }.wrap(this),

          end : function(e) {
          }.wrap(this)
        })

        this.ressources[i].el.addEventListener("mousedown", function (i) {
          this.currentIndex = i;
        }.bind(this).curry(i));
      }



    },

    addRessource : function () {
      var newR = new r.Ressource()
      
      this.ressources.push(newR)
      this.el.children[1].appendChild(newR.el);
      var newIndice = this.ressources.length - 1;
      newR.el.addEventListener("mousedown", function () {
        this.currentIndex = newIndice;
      }.bind(this));

      r.handle(newR.el).drag({
          start : function(e) {
            var x = e.xy[0];
            var y = e.xy[1];
          }.wrap(this),

          drag : function(e) {
            newR.el.style.left = e.xy[0];
            newR.el.style.top = e.xy[1];
          }.wrap(this),

          end : function(e) {
          }.wrap(this)
        })

      this.fire('topBar:addedRessource');
      this.currentIndex
    },

    deleteRessource : function () {
      this.ressources[this.currentIndex].el.parentNode.removeChild(this.ressources[this.currentIndex].el);
      this.ressources.splice(this.currentIndex,1);
      
      for (var i = 0, n = this.ressources.length; i < n; i++){
        this.ressources[i].el.addEventListener("mousedown", function (i) {
          this.currentIndex = i;
        }.bind(this).curry(i));
      }
      
      this.currentIndex = this.ressources.length-1;
      this.fire('topBar:deletedRessource');
    }

  })
      })