sand.define('Compagnon/Item', [
  'Seed',
  'DOM/toDOM'
], function (r) {

  return r.Seed.extend ({
    '+init' : function (input) {
      this.id = Math.random() + ''; //temporary

      this.el = r.toDOM({
        tag : '.item',
      })
      this.actions = input.actions || [];
      this.cancel = input.cancel || 0;
      this.lettersCancelThreshold = input.lettersCancelThreshold || 4;

      //console.log(this.actions,this.cancel);

      input ? this.input = jQuery.extend({},input) : this.input = {};
      this.type = input ? (input.type ? input.type : 'item') : 'item';
      this.preview;
      //this.noFireAllowed = false;

      this.legend = r.toDOM({
        tag : '.legend',
        attr : {
          contenteditable : true,
        },
        events : {
          keyup : function (e) {
            if(e.keyCode === 13) e.preventDefault();
            if(this.actions && this.cancel) {
              for(var i = 0; i <= this.cancel; i++ ) {
                this.actions.pop();
              }
              this.cancel = 0;
            }
            this.fire('edit');
            this.fire('item:legendUpdated',this.legend.innerHTML);
          }.bind(this),
          focus : function (e) {
            this.initialLegend = this.legend.innerHTML || "";
          }.bind(this),
          blur : function (e) {
            if(!this.noFireAllowed && this.legend.innerHTML !== this.initialLegend) {
              this.actions.push({'type' : 'type', "sLegend" : this.initialLegend || "", "eLegend" : this.legend.innerHTML || ""});
              this.fire('action',{'action' : 'itemAction', 'item' : this, "type" : "type"});
            }
            this.noFireAllowed = false;
          }.bind(this),
          keydown : function (e) {
            if (e.keyCode === 13) {
              e.preventDefault();
              document.execCommand('insertHTML', false, '<br><br>');
              return false;
            } 
          }
        },
        innerHTML : this.input.legend || ""
      })
      
      document.body.addEventListener("touchstart",function (e) {
        e.target === this.legend ? this.legend.focus() : this.legend.blur();
      }.bind(this),true)

    },

    swap : function (type) {// Va être rendu obsolète par workspace:swap
      this.type = type
      this.fire('item:swap', this.type)
    },
  })

});
