sand.define('Compagnon/ActionBar', function  (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.el = toDOM({
        children : [
        {
          tag : '.new',
        },
        {
          tag : '.separation',
        },
        {
          tag : '.undo',
        },
        {
          tag : '.redo'
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