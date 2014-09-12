sand.define('Compagnon/Ressource',['DOM/handle','core/Array/*'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.type = input ? (input.type ? input.type : 'drawing') : 'drawing';
      this.preview;

      this.el = toDOM({
        tag : '.mini-item.' + this.type,
      })

      console.log(this.el);
      r.handle(this.el).drag({
              start : function(e) {
                console.log("we are here !");
                this._sx = e.xy[0];
                this._sl = parseInt(this.el.style.left) || 0;
                console.log(this.el.offsetLeft,this._sx,this._sl);
              }.bind(this),

              drag : function(e) {
                this.el.style.left = this._sl + e.xy[0] - this._sx + 'px';
                console.log(this.el.offsetLeft,this._sx,this._sl);
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