sand.define('Compagnon/Ressource',['DOM/handle','core/Array/*'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.type = input ? (input.type ? input.type : 'drawing') : 'drawing';
      this.preview;

      this.el = toDOM({
        tag : '.mini-item.' + this.type,
      })

      this.lastSeenElement;

      r.handle(this.el).drag({
              start : function(e) {
                this._sx = e.xy[0];
                this._sy = e.xy[1];
                this._sl = parseInt(this.el.style.left) || 0;
                //console.log(this.el.offsetLeft,this._sx,this._sl);
                this.el.style.pointerEvents = "none";
              }.bind(this),

              drag : function(e) {
                
                this.el.style.left = this._sl + e.xy[0] - this._sx + 'px';
                if(document.elementFromPoint(parseInt(this.el.style.left),this._sy) !== this.el.parentNode) this.lastSeenElement = document.elementFromPoint(parseInt(this.el.style.left),this._sy);
                //console.log(this.el.offsetLeft,this._sx,this._sl);
              }.bind(this),

              end : function(e) {
                  this.el.style.pointerEvents = "auto"
                  if(this.lastSeenElement) {
                    this.fire('ressource:dropped',this.el,this.lastSeenElement);
                    this.lastSeenElement = null;
                  }
              }.wrap(this)
            })

    },

    update : function (type) {
      this.type = type;
      this.fire('ressource:update')
    }
  })
})