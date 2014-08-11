sand.define('Compagnon/Video',['Compagnon/Item'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {
      this.type = "video"
    }
  })
})