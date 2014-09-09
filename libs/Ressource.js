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

      console.log(this.el);
      r.handle(this.el).drag({
              start : function(e) {
                console.log("we are here !")
              },

              drag : function(e) {
                this.el.style.left = e.xy[0]-this.el.clientWidth/2 + 'px';
              }.bind(this),

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