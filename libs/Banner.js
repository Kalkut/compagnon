sand.define('Compagnon/Banner', [
  'Seed',
  'DOM/toDOM'
], function (r) {

  return r.Seed.extend({
    '+init' : function (input)  {
      this.el = r.toDOM([
        '.header', [
          '.leftBorder',
          '.curvedBorder',
          '.rightBorder',
          '.logo',
          ['.middle', [
            ['.login', [
              '.home',
              '.name'
            ]]
            ['.select-box', [
              '.board-name',
              '.picto'
            ]]
          ]],
          ['.controls', [
            '.help',
            '.shutdown'
          ]],
          { tag : '.sync',
            events : {
              mousedown : function () {
                this.sync();
              }.bind(this)
            }
          }
        ]
      ]);
    },

    board : function () {
      this.fire('banner:board');
    },

    folder : function () {
      this.fire('banner:folder');
    },

    help : function () {
      this.fire('banner:help');
    },

    home : function () {
      this.fire('banner:login');
    },

    login : function () {
      this.fire('banner:login');
    },

    logout : function () {
      this.fire('banner:logout');
    },

    sync : function () {
      this.fire('banner:sync');
    },
  })
})