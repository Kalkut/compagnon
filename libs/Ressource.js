sand.define('Compagnon/Ressource',['DOM/handle'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.type = input ? (input.type ? input.type : 'drawing') : 'drawing';
      this.preview;

      this.el = toDOM({
        tag : '.mini-item.' + this.type,
        events : {
          /*mousedown : function (e) {
            
          }.bind(this)*/  
        }
      })

      r.handle(this.el).drag({
              start : function(e) {
                console.log("we are here !")
              }.wrap(this),

              drag : function(e) {
                //this.el.style.left = e.xy[0]-this.el.clientWidth/2;
              }.wrap(this),

              end : function(e) {
              }.wrap(this)
            })

    },

    update : function (type) {
      this.type = type;
      this.fire('ressource:update')
    }
  })
})