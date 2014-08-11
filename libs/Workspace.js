sand.define('Compagnon/Workspace',['Compagnon/ToolBar','Compagnon/Drawing','Compagnon/Image','Compagnon/Video','Compagnon/Url'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.toolBar = new r.ToolBar();
      
      this.toolBar.on('toolBar:drawing', function () {
        this.update(this.currentType,"drawing");

      }.bind(this));

      this.toolBar.on('toolBar:picture', function () {
        this.update(this.currentType,"image");
        this.currentType = "image";
        this.fire('workspace:toolBar:picture');
      }.bind(this));

      this.toolBar.on('toolBar:upload', function (type) {
        this.update(this.currentType,type);
        this.currentType = type;
        this.fire('workspace:toolBar:upload',type);
      }.bind(this));

      this.toolBar.on('toolBar:link', function (type) {
        this.update(this.currentType,type);
        this.currentType = type;
        this.fire('workspace:toolBar:link',type);
      }.bind(this));

      this.toolBar.on('toolBar:video', function () {
        this.update(this.currentType,"video");
        this.currentType = "video"
        this.fire('workspace:toolBar:video');
      }.bind(this))

      this.toolBar.on('toolBar:trash', function () {
        this.fire('workspace:toolBar:trash');
      }.bind(this))

      input ? this.input = input : this.input = {};
      this.input.type ? this.currentType = this.input.type : this.currentType = "drawing"; 

      this.item = { 
        drawing : new r.Drawing(), 
        video : new r.Video(), 
        url : new r.Url(), 
        image : new r.Image()
      };


      this.switchPicto = toDOM({
        tag : '.switch',
      })

      this.el = toDOM({
        tag : '.edit',
        children : [
          this.toolBar.el,
          this.switchPicto,
          this.item.drawing.el,
          this.item.video.el,
          this.item.url.el,
          this.item.image.el
          ]
      })

      this.hashTypes = { drawing : "Drawing", video : "Video", image : "Image", url : "Url" };

    },

    update : function (typeStart,typeEnd) {
      this.item[typeEnd] = this.item[typeStart].create(r[this.hashTypes[typeEnd]],this.input);
      this.fire('workspace:update');
    }

  })
})