sand.define('Compagnon/Compagnon', ['Compagnon/*','DOM/handle','PrototypeExtensions/curry'], function (r) {
  return Seed.extend({
    '+init' : function (input) {
      input ? this.input = jQuery.extend({},input) : this.input = { "data" : []} 
      this.actionBar = new r.Compagnon.ActionBar(this.input);
      this.banner = new r.Compagnon.Banner(this.input);
      this.topBar = new r.Compagnon.TopBar(this.input);
      this.workspace =  new r.Compagnon.Workspace(this.input);
      this.currentIndex = this.input.currentIndex || 0;
      this.actions = [/*{ action : "update", type : "drawing"}*/];
      this.cancel = 0;
      this.defaultType = this.input.defaultType || "drawing";
      

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

      this.workspace.on('workspace:updated', function (index,type,data,legend,oldType) {
        this.cancel = 0;
        this.actions.push({ action : "update", type : type,oldType : oldType, data : data, legend : legend});
        this.workspace.items[index].on('Item:snapshotTaken', function (preview) {
          this.topBar.ressources[index].el.style.backgroundImage = "url(\"" + preview + "\")";
        }.bind(this))
        this.topBar.ressources[index].el.className = 'mini-item ' + type;
        if(this.workspace.items[index].preview) this.workspace.items[index].fire('Item:snapshotTaken',this.workspace.items[index].preview);
      }.bind(this));

      this.on('Compagnon:itemAdded', function (newindex,type,data) {
        this.workspace.currentIndex = this.currentIndex = newindex;
        this.actions.push({ action : "add", index : newindex, type : type, data : data, legend : data.legend});
        //this.actions.push({ action : "update", type : "drawing"})
      }.bind(this))

      this.on('Compagnon:itemDeleted', function (newindex,data,type) {
        this.workspace.currentIndex = this.currentIndex = newindex;
        this.actions.push({ action : "delete", data : data, type : type});
      })

      this.on('compagnon:sync', function () {
        
      }.bind(this))



      for(var k = 0, len = this.workspace.items.length; k < len; k++) {
        this.workspace.items[k].on('Item:snapshotTaken', function (k,preview) {
          this.topBar.ressources[k].el.style.backgroundImage = "url(\"" + preview + "\")";
        }.bind(this).curry(k))
        
        this.topBar.ressources[k].el.addEventListener("mousedown", function (k) {
          this.select(k);
          this.currentIndex = k;
        }.bind(this).curry(k))
      }

      if(this.input.data.length) {
        for(var sInd = 0, eInd = this.input.data.length; sInd < eInd; sInd++ ) {
          this.add(this.input.data[sInd].type,this.input.data[sInd]);
          this.workspace.items[this.workspace.items.length - 1].fire('Item:snapshotTaken', this.workspace.items[this.workspace.items.length - 1].preview)
        }
        this.uncancelableActions = eInd;
      }else {
        this.add(this.defaultType, null);
      }
    },

    sync : function () {
      console.log(this.workspace.items[this.currentIndex],this.workspace.input);
      this.fire('compagnon:sync',this.workspace.items[this.currentIndex],this.workspace.input);
    },

    undo : function () { //actions à annuler à spécifier
      if(this.actions && this.cancel < this.actions.length - this.uncancelableActions) {
        this.cancel++
        var actionToCancel = this.actions[this.actions.length - this.cancel];
        if(actionToCancel.action === 'update' ) this.workspace.update(actionToCancel.oldType,actionToCancel.data,actionToCancel.index,actionToCancel.legend,true);
        else if (actionToCancel.action === 'add') this.delete(true);
        else if (actionToCancel.action === 'delete') this.add(actionToCancel.type,actionToCancel.data,true);
        this.fire('compagnon:undo');
      }
    },

    redo : function () {//actions à rétablir à spécifier
      if(this.actions && this.cancel >= 1) {
        var actionToCancel = this.actions[this.actions.length - this.cancel];
        if(actionToCancel.action === 'update' ) this.workspace.update(actionToCancel.type,actionToCancel.data,actionToCancel.index,actionToCancel.legend,true);
        else if (actionToCancel.action === 'add') this.add(actionToCancel.type,actionToCancel.data,true);
        else if (actionToCancel.action === 'delete') this.delete(true);

        this.cancel--
      }
      this.fire('compagnon:redo');
    },

    delete : function (cancel) {
      console.log('delete');
      this.topBar.ressources[this.currentIndex].el.parentNode.removeChild(this.topBar.ressources[this.currentIndex].el);
      var daddy = this.workspace.items[this.currentIndex].el.parentNode;
      var data = this.workspace.items[this.currentIndex].input;
      var type = this.workspace.items[this.currentIndex].type
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
      
      if(!cancel) this.fire('Compagnon:itemDeleted',this.currentIndex,data,type);
      this.workspace.fire('Workspace:newCurrentIndex',this.currentIndex)
    },

    add : function (type,data,cancel) {
      if(!data) var data = {};
      if(!type) var type = "drawing";

      var newR = new r.Compagnon.Ressource({type : type, data : data})
      
      this.topBar.ressources.push(newR)
      this.topBar.el.children[1].appendChild(newR.el);

      if(this.workspace.items[this.currentIndex]) {// if no item declared remove nothing
        var daddy = this.workspace.items[this.currentIndex].el.parentNode;
        daddy.removeChild(this.workspace.items[this.currentIndex].el);
      } else {
        var daddy = this.workspace.el.children[2].children[0];
      }

      var newIndice = this.topBar.ressources.length - 1;
      
      

      /*r.handle(newR.el).drag({
        start : function(e) {
        }.wrap(this),

        drag : function(e) {
          newR.el.style.left = e.xy[0]-newR.el.clientWidth/2;
          //newR.el.style.top = e.xy[1];
        }.wrap(this),

        end : function(e) {
        }.wrap(this)
      })*/

      this.currentIndex = newIndice;
      this.workspace.items.push(new r.Compagnon[this.workspace.hashTypes[type]](data));
      daddy.appendChild(this.workspace.items[this.currentIndex].el);

      this.workspace.items[this.currentIndex].on('Item:snapshotTaken', function (preview) {
          this.topBar.ressources[this.currentIndex].el.style.backgroundImage = "url(\"" + preview + "\")";
      }.bind(this))

      newR.el.addEventListener("mousedown", function () {
        this.select(newIndice);
        this.currentIndex = newIndice;
      }.bind(this));

      if(!cancel) {
        this.cancel = 0
        this.fire('Compagnon:itemAdded',this.currentIndex,type,data);
      }
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