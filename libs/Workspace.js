sand.define('Compagnon/Workspace',['Compagnon/ToolBar','Compagnon/Drawing','Compagnon/Image','Compagnon/Video','Compagnon/Url'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.toolBar = new r.ToolBar();
      
      this.toolBar.on('toolBar:drawing', function () {
        this.update('drawing',this.input);
      }.bind(this));

      this.toolBar.on('toolBar:picture', function () {
        this.fire('workspace:toolBar:picture');
      }.bind(this));

      this.toolBar.on('toolBar:upload', function (file) {
        this.fire('workspace:toolBar:upload',file);
      }.bind(this));

      this.toolBar.on('toolBar:link', function (link) {
        this.input.link = link;
        this.fire('workspace:toolBar:link',link);
        if(link.search('youtube.') !== -1 || link.search('vimeo.') !== -1) {
          this.update('video',this.input)
        }else if (link.search('.png') !== link.length - 4 || link.search('.jpg') !== link.length - 4 || link.search('.jpeg') !== link.length - 5 || link.search('.gif') !== link.length - 4) {
          this.update('image',this.input)
        }
      }.bind(this));


      this.toolBar.on('toolBar:trash', function () {
        this.fire('workspace:toolBar:trash');
      }.bind(this))

      this.on('Workspace:newCurrentIndex', function (index) {
        this.currentIndex = index
      }.bind(this))

      input ? this.input = jQuery.extend({},input) : this.input = {};
      this.input.type ? this.currentType = this.input.type : this.currentType = "drawing"; 

      this.input.currentIndex >= 0 ? this.currentIndex = this.input.currentIndex : this.currentIndex = 0;
      
      if(!this.input.paths) this.input.paths = [];

      this.hashTypes = { drawing : "Drawing", video : "Video", image : "Image", url : "Url" };

      this.items = this.input.items || [new r[this.hashTypes[this.currentType]](input)];
      this.itemsHtml = [];
      
      for(var h = 0, len = this.items.length; h < len; h++) {
        this.itemsHtml.push(this.items[h].el);
        this.items[h].on('item:legendUpdated', function (legend) {
          this.input.legend = legend;
        }.bind(this))
      }

      this.switchPicto = toDOM({
        tag : '.switch',
      })

      this.el = toDOM({
        tag : '.edit',
        children : [
        this.toolBar.el,
        this.switchPicto,
        {
          tag : '.workspace',
          children : this.itemsHtml
        }]
      })

    },

    update : function (type,data,legend,index,cancel) {
      if(type){
        if(!data) var data = {};
        if(!index) var index = this.currentIndex;
        if(!legend) var legend = this.items[index].legend.innerHTML || "";
        var daddy = this.items[index].el.parentNode;
        daddy.removeChild(this.items[index].el);
        this.items[index] = this.create(r[this.hashTypes[type]],data);
        daddy.appendChild(this.items[index].el);
        this.items[index].legend.innerHTML = legend;
        this.input.legend = legend;
        if(!cancel) this.fire('workspace:updated',this.currentIndex,type,jQuery.extend({},data),legend);
      }
    },

  })
})