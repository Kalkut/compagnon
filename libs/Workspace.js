sand.define('Compagnon/Workspace',['Compagnon/ToolBar','Compagnon/Item'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.toolBar = new r.ToolBar();
      this.item = new r.Item();
      this.switchPicto = toDOM({
        tag : '.switch'
      })

      this.el = toDOM({
        tag : '.edit',
        children : [
          this.toolBar.el,
          this.switchPicto,
          this.item.el
          ]
      })
    }
  })
})