sand.define('Compagnon/ToolBar', [
  'PrototypeExtensions/curry',
  'Seed',
  'DOM/toDOM',
  'core/Function/curry'
], function (r) {

  return r.Seed.extend({
    '+init' : function (input) {
      var scope = {};
      this.el = r.toDOM({
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
          as : "link",
          events : {
            mousedown : function () {
              scope.input.style.display = "block"
            }
          },
          children : [
          {
            tag : "input .input-field",
            as : "input",
            events : {
              keyup : function (e) {
                if(e.keyCode === 13) {
                  this.fire('toolBar:link',scope.input.value);
                  scope.input.style.display = "none";
                }
              }.bind(this)
            },
            style : {
              display : "none"
            }
          }]
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
      },scope)
    },

    drawing : function () {
      this.fire('toolBar:drawing');
    },

    upload : function () {
      this.fire('toolBar:upload',type);
    },

    picture : function () {
      this.fire('toolBar:picture');
    },

    trash : function () {
      this.fire('toolBar:trash')
    },
    
  })
})