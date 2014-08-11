sand.define('Compagnon/ActionBar', function  (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.el = toDOM({
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
      })
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
  })
})