sand.define('Compagnon/ToolBar', function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.el = toDOM({
        tag : '.panel',
        children : [
        {
          tag : '.drawing',
          events : {
            mousedown : this.drawing.bind(this),
          }
        },
        {
          tag : '.upload',
          events : {
            mousedown : this.upload.bind(this),
          }
        },
        {
          tag : '.link',
          events : {
            mousedown : this.link.bind(this),
          }
        },
        {
          tag : '.picture',
          events : {
            mousedown : this.picture.bind(this),
          }
        },
        {
          tag : '.delete',
          events : {
            mousedown : this.trash.bind(this)
          }
        }
        ]
      })
    },

    drawing : function () {
      this.fire('toolBar:drawing');
    },

    upload : function () {
      this.fire('toolBar:upload',type);
    },

    link : function () {
      this.fire('toolBar:link',type);
    },

    picture : function () {
      this.fire('toolBar:picture');
    },

    trash : function () {
      this.fire('toolBar:trash')
    },
    
  })
})