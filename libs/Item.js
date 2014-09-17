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
      this.actions = [];
      this.cancel = 0;

      input ? this.input = jQuery.extend({},input) : this.input = {};
      this.type = input ? (input.type ? input.type : 'item') : 'item';
      this.preview;

      this.legend = r.toDOM({
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

            this.input.legend = this.legend.innerHTML;
            this.fire('edit');

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

});