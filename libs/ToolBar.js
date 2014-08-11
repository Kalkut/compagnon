sand.define('Compagnon/ToolBar', function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.el = toDOM({
        tag : '.panel',
        children : [
        {
          tag : '.drawing',
        },
        {
          tag : '.upload',
        },
        {
          tag : '.link',
        },
        {
          tag : '.picture',
        },
        {
          tag : '.delete',
        }
        ]
      })
    },

    drawing : function () {
      this.fire('toolBar:drawing');
    },

    upload : function () {
      this.fire('toolBar:upload');
    },

    link : function () {
      this.fire('toolBar:link');
    },

    picture : function () {
      this.fire('toolBar:picture');
    },

    trash : function () {
      this.fre('toolBar:trash')
    },
    
  })
})