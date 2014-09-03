sand.define('Compagnon/Compagnon', ['Compagnon/*','DOM/handle','PrototypeExtensions/curry'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      this.actionBar = new r.Compagnon.ActionBar(input);
      this.banner = new r.Compagnon.Banner(input);
      this.topBar = new r.Compagnon.TopBar(input);
      this.workspace =  new r.Compagnon.Workspace(input);
      this.currentIndex = input.currentIndex || 0;
      this.actions = [{ action : "update", type : "drawing"}];
      this.cancel = 0;
      

      this.el = toDOM({
        tag : '.compagnon',
        children : [
        this.banner.el,
        this.topBar.el,
        this.actionBar.el,
        this.workspace.el
        ]
      })
      

      this.actionBar.on('actionBar:add', function () {
        this.add();
        //MUST ADD ITEM IN WORKSPACE
      }.bind(this))


      this.actionBar.on('actionBar:undo', function () {
        this.undo();
      }.bind(this))

      this.actionBar.on('actionBar:redo', function () {
        this.redo();
      }.bind(this))

      this.workspace.on('workspace:toolBar:trash', function () {
        this.delete();
      }.bind(this))

      this.workspace.on('workspace:updated', function (index,type,data,legend) {
        this.actions.push({ action : "update", type : type, data : data, legend : legend});
      }.bind(this));

      this.on('Compagnon:itemAdded', function (newindex) {
        this.workspace.currentIndex = this.currentIndex = newindex;
        this.actions.push({ action : "add", index : newindex});
        this.actions.push({ action : "update", type : "drawing"})
      }.bind(this))

      this.on('Compagnon:itemDeleted', function (newindex) {
        this.workspace.currentIndex = this.currentIndex = newindex;
        this.actions.push({ action : "delete"});
      })

      this.on('compagnon:swap', function () {// Va surement être rendu obsolète par workspace:swap
        this.workspace.item.swap();
      }.bind(this))



      for(var k = 0, len = this.workspace.items.length; k < len; k++) {
        this.workspace.items[k].on('drawing:snapshotTaken', function (k,preview) {
          this.topBar.ressources[k].el.style.backgroundImage = "url(" + preview + ")";
        }.bind(this).curry(k))
      }

    },

    swap : function () {
      this.fire('compagnon:swap');
    },

    undo : function () { //actions à annuler à spécifier
      if(this.actions) {
        this.cancel++
        var actionToCancel = this.actions[this.actions.length - 1 - this.cancel];
        if(actionToCancel.action === 'update' ) this.workspace.update(actionToCancel.type,actionToCancel.data,actionToCancel.index,actionToCancel.legend,true);
        else if (actionToCancel.action === 'add') this.delete(true);
        else if (actionToCancel.action === 'delete') this.add(null,null,true);
        this.fire('compagnon:undo');
      }
    },

    redo : function () {//actions à rétablir à spécifier
      if(this.actions) {
        this.cancel--
        var actionToCancel = this.actions[this.actions.length - 1 - this.cancel];
        if(actionToCancel.action === 'update' )this.workspace.update(actionToCancel.type,actionToCancel.data,actionToCancel.index,actionToCancel.legend,true);
        else if (actionToCancel.action === 'add') this.add(null,null,true);
        else if (actionToCancel.action === 'delete') this.delete(true);
      }
      this.fire('compagnon:redo');
    },

    delete : function (cancel) {
      console.log('delete');
      this.topBar.ressources[this.currentIndex].el.parentNode.removeChild(this.topBar.ressources[this.currentIndex].el);
      var daddy = this.workspace.items[this.currentIndex].el.parentNode;
      daddy.removeChild(this.workspace.items[this.currentIndex].el);

      this.topBar.ressources.splice(this.currentIndex,1);
      this.workspace.items.splice(this.currentIndex,1);

      for (var i = 0, n = this.topBar.ressources.length; i < n; i++) {
        this.topBar.ressources[i].el.addEventListener("mousedown", function (i) {
          this.currentIndex = i;
          this.select(i)
        }.bind(this).curry(i));
      }
      
      if(this.currentIndex >= this.topBar.ressources.length) this.currentIndex--;
      if(this.workspace.items) daddy.appendChild(this.workspace.items[this.currentIndex].el);
      
      if(!cancel) this.fire('Compagnon:itemDeleted',this.currentIndex);
      this.workspace.fire('Workspace:newCurrentIndex',this.currentIndex)
    },

    add : function (type,data,cancel) {
      if(!data) var data = {};
      if(!type) var type = "drawing";

      var newR = new r.Compagnon.Ressource({type : type, data : data})
      
      this.topBar.ressources.push(newR)
      this.topBar.el.children[1].appendChild(newR.el);

      var daddy = this.workspace.items[this.currentIndex].el.parentNode;
      daddy.removeChild(this.workspace.items[this.currentIndex].el);

      var newIndice = this.topBar.ressources.length - 1;
      
      newR.el.addEventListener("mousedown", function () {
        this.currentIndex = newIndice;
      }.bind(this));

      r.handle(newR.el).drag({
        start : function(e) {
        }.wrap(this),

        drag : function(e) {
          newR.el.style.left = e.xy[0]-newR.el.clientWidth/2;
          //newR.el.style.top = e.xy[1];
        }.wrap(this),

        end : function(e) {
        }.wrap(this)
      })

      this.currentIndex = newIndice;
      this.workspace.items.push(new r.Compagnon[this.workspace.hashTypes[type]](data));
      daddy.appendChild(this.workspace.items[this.currentIndex].el);

      this.workspace.items[newIndice].on('drawing:snapshotTaken', function (preview) {
        this.topBar.ressources.el.style.backgroundImage = preview;
      }.bind(this))

      if(!cancel) this.fire('Compagnon:itemAdded',this.currentIndex);
      this.workspace.fire('Workspace:newCurrentIndex',this.currentIndex)
      
    },

    select : function (index) {
      var daddy = this.workspace.items[this.currentIndex].el.parentNode;
      daddy.removeChild(this.workspace.items[this.currentIndex].el);
      daddy.appendChild(this.workspace.items[index].el);
      this.currentIndex = index;
    },

    swap : function (firstIndex,secondIndex) {
      var ressourceBuffer =  this.topBar.ressources[firstIndex];
      var workspaceBuffer = this.workspace.items[firstIndex];

      this.topBar.ressources[firstIndex] = this.topBar.ressources[secondIndex];
      this.workspace.items[firstIndex] = this.workspace.items[secondIndex];
      this.topBar.ressources[secondIndex] = ressourceBuffer;
      this.workspace.items[secondIndex] = workspaceBuffer;
      this.currentIndex === firstIndex ? this.currentIndex = secondIndex : ( this.currentIndex === secondIndex ? this.currentIndex = firstIndex : this.currentIndex );

    }

  })
})