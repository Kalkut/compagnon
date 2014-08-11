sand.define('Compagnon/Url',['Compagnon/Item'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {
      this.type = "url";
    }
  })
})