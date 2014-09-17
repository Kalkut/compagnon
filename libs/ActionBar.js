sand.define('Compagnon/ActionBar', [
  'Seed',
  'DOM/toDOM'
], function (r) {

  return r.Seed.extend({
    
    'tpl' : function() {
      return {
        tag : '.actions',
        children : [
        {
          tag : '.new',
          events : {
            mousedown : this.add.bind(this),
          }
        },
        {
          tag : '.separation',
        },
        {
          tag : '.undo',
          events : {
            mousedown : this.undo.bind(this),
          }
        },
        {
          tag : '.redo',
          events : {
            mousedown : this.redo.bind(this),
          }
        }]        
      }
    },

    add : function () {
      this.fire('actionBar:add')
    },

    undo : function () {
      this.fire('actionBar:undo')
    },

    redo : function () {
      this.fire('actionBar:redo')
    },
  });

});