sand.define('Compagnon/Workspace', [
  'Compagnon/ToolBar',
  'Compagnon/Drawing',
  'Compagnon/Image',
  'Compagnon/Video',
  'Compagnon/Url',
  'Seed',
  'DOM/toDOM'
], function (r) {
  
  return r.Seed.extend({
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
      //this.input.data && this.input.data.type ? this.currentType = this.input.data.type : this.currentType = "drawing"; 

      this.input.currentIndex >= 0 ? this.currentIndex = this.input.currentIndex : this.currentIndex = 0;
      
      if (!this.input.paths) this.input.paths = [];

      this.hashTypes = { drawing : "Drawing", video : "Video", image : "Image", url : "Url" };

      this.items = this.input.items || [/*new r[this.hashTypes[this.currentType]](input)*/];
      

      this.switchPicto = r.toDOM({
        tag : '.switch',
      })

      this.scope = {};

      this.el = r.toDOM({
        tag : '.edit',
        children : [
        this.toolBar.el,
        this.switchPicto,
        {
          tag : '.workspace',
        }]
      },this.scope);

      this.verticeContainer = this.scope.workspace;
    },

    update : function (type,data,legend,index,cancel) {
      if(type) {
        if(!data) var data = {};
        if(!index) var index = this.currentIndex;
        if(!legend) var legend = this.items[index].input.legend || "";
        var oldType = this.items[index].type;
        var daddy = this.items[index].el.parentNode;
        var history = this.items[index].actions || [];
        var cancelIndex = this.items[index].cancel
        daddy.removeChild(this.items[index].el);
        this.items[index] = this.create(r[this.hashTypes[type]],data);

        this.items[index].on('edit', function() {
          this.fire('ressource:edit', this.items[index]);
        }.bind(this), this);

        daddy.appendChild(this.items[index].el);
        this.items[index].legend.innerHTML = legend;
        this.input.legend = legend;
        if(!cancel) this.fire('workspace:updated',this.currentIndex,type,jQuery.extend({},data),legend,oldType,history,cancelIndex);
      }
    },

  })
})