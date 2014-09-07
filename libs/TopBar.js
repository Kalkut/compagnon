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

      /*for (var i = 0, n = this.ressources.length; i < n; i++) {
        this.scope.items.appendChild(this.ressources[i].el);
        
        
        var bobby = this.ressources[i].el;
        r.handle(this.ressources[i].el).drag({
          start : function(e) {
          }.wrap(this),

          drag : function(e) {
            bobby.style.left = Math.max(0,e.xy[0])-bobby.clientWidth/2;
            //bobby.style.top = e.xy[1];
          }.wrap(this),

          end : function(e) {
           
          }.wrap(this)
        })

        this.ressources[i].el.addEventListener("mousedown", function (i) {
          this.currentIndex = i;
        }.bind(this).curry(i));

      }*/



    },

  })
})