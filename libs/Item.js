sand.define('Compagnon/Item', function (r) {
  return Seed.extend ({
    '+init' : function (input) {
      this.el = toDOM({
        tag : '.item',
      })
      this.actions = [];
      this.cancel = 0;

      input ? this.input = jQuery.extend({},input) : this.input = {};
      this.type = input ? (input.type ? input.type : 'item') : 'item';
      this.preview;

      this.legend = toDOM({
        tag : '.legend',
        attr : {
          contenteditable : true,
        },
        events : {
          keyup : function (e) {
            if(this.actions && this.cancel) {
              for(var i = 0; i <= this.cancel; i++ ) {
                this.actions.pop();
              }
              this.cancel = 0;
            }
            this.fire('item:legendUpdated',this.legend.innerHTML);
          }.bind(this),
          blur : function () {
            this.actions.push('type');
          }.bind(this),
          keydown : function (e) {
            if (e.keyCode === 13) {
              document.execCommand('insertHTML', false, '<br><br>');
              return false;
            } 
          }
        },
        innerHTML : this.input.legend || ""
      })
    },

    swap : function (type) {// Va être rendu obsolète par workspace:swap
      this.type = type
      this.fire('item:swap', this.type)
    },
  })
})