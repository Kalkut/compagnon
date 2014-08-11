sand.define('Compagnon/Compagnon', ['Compagnon/*'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.actionBar = new r.Compagnon.ActionBar();
      this.banner = new r.Compagnon.Banner();
      this.topBar = new r.Compagnon.TopBar();
      this.workspace = new r.Compagnon.Workspace();

      this.el = toDOM({
        tag : '.compagnon',
        children : [
          this.banner.el,
          this.topBar.el,
          this.actionBar.el,
          this.workspace.el
        ]
      })

      this.workspace.on('workspace:toolBar:trash', function () {
        this.topBar.deleteRessource();
      }.bind(this))

      this.actionBar.on('actionBar:add', function () {
        this.topBar.addRessource();
      }.bind(this))

      this.actionBar.on('actionBar:undo', function () {
        this.undo();
      }.bind(this))

      this.actionBar.on('actionBar:redo', function () {
        this.redo();
      }.bind(this))

      this.on('compagnon:swap', function () {// Va surement être rendu obsolète par workspace:swap
        this.workspace.item.swap();
      })
    },

    swap : function () {
      this.fire('compagnon:swap');
    },

    undo : function () { //actions à annuler à spécifier
      this.fire('compagnon:undo');
    },

    redo : function () {//actions à rétablir à spécifier
      this.fire('compagnon:redo');
    }
  })
})