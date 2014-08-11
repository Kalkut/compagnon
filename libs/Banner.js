sand.define('Compagnon/Banner', function (r) {
  return Seed.extend({
    '+init' : function (input)  {
      this.el = toDOM({
        tag : '.header',
        children : [
        {
          tag : '.logo',
        },
        {
          tag : '.middle',
          children : [
          {
            tag : '.login',
            children : [
            {
              tag :  '.home',
            },
            {
              tag : '.name',
            }],
          },
          {
            tag : '.select-box',
            children : [
            {
              tag : '.board-name',
            },
            {
              tag : '.picto',
            }]
          }]
        },
        {
          tag : '.controls',
          children : [
          {
            tag : '.help',
          },
          {
            tag : '.shutdown',
          }
          ]
        },
        {
          tag : '.sync',
        }]
      })
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

    synchronize : function () {
      this.fire('banner:synchronize');
    },
  })
})