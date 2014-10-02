sand.define('Compagnon/Compagnon', [
  'Compagnon/*', //STT non, si ton module est Compagnon/Compagnon, il ne peut pas require Compagnon/* (qui est sensé l'inclure aussi).
  'DOM/handle',
  'PrototypeExtensions/curry',
  'Seed',
  'DOM/toDOM'
], function (r) {

  var toDOM = r.toDOM;
  return r.Seed.extend({
    '+init' : function (input) {
      input ? this.input = jQuery.extend({},input) : this.input = { "data" : []} 
      this.actionBar = new r.Compagnon.ActionBar(this.input);
      this.banner = new r.Compagnon.Banner(this.input);
      this.topBar = new r.Compagnon.TopBar(this.input);
      
      this.workspace =  new r.Compagnon.Workspace(this.input);
      this.workspace.on('ressource:edit', function(ressource) {
        if(this.syncMode) this.fire('ressource:edit', ressource.getData());
      }.bind(this), this);

      this.currentIndex = this.input.currentIndex || 0;
      this.actions = input.actions || [];
      this.cancel = 0;
      this.defaultType = this.input.defaultType || "drawing";
      //this.topBar.ressourcesHTML;
      
      this.el = r.toDOM({
        tag : '.compagnon',
        children : [
        this.banner.el,
        this.topBar.el,
        this.actionBar.el,
        this.workspace.el
        ]
      })

      this.selectMargin = toDOM({
        tag : '.selectMargin',
        style : {
          position: "absolute",
          top: "-20%",
          height: "10%",
          width: "100%",
          backgroundColor: "#fdc62e"
        }
      })

      if(this.input.data.length) {
        for(var sInd = 0, eInd = this.input.data.length; sInd < eInd; sInd++ ) {
          this.add(this.input.data[sInd].type,this.input.data[sInd]);
          this.workspace.items[this.workspace.items.length - 1].fire('Item:snapshotTaken', this.workspace.items[this.workspace.items.length - 1].preview)
        }
        this.uncancelableActions = eInd;
      }else {
        this.add(this.defaultType, null);
      }

      this.actionBar.on('actionBar:add', function () {
        this.add();
        //MUST ADD ITEM IN WORKSPACE
      }.bind(this))

      this.banner.on('banner:sync', function () {
        //this.sync();
        this.sync = !this.sync;
        this.fire(this.sync ? 'sync' : 'unsync', this.workspace.items[index || index === 0 ? index : this.currentIndex].getData());
        //this.syncMode ? this.syncOff() : this.syncOn();
      }.bind(this));

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
        this.actions.push({ action : "update", type : type,oldType : oldType, data : data, legend : legend, index : index});
        this.workspace.items[index].on('Item:snapshotTaken', function (preview) {
          this.topBar.ressources[index].el.style.backgroundImage = "url(\"" + preview + "\")";
        }.bind(this))
        
        this.workspace.items[index].on('action', function (action) {
          this.actions.push(action);
          console.log(action);
        }.bind(this))

        this.topBar.ressources[index].el.className = 'mini-item ' + type;
        
        if(this.selectMargin.parentNode) this.selectMargin.parentNode.removeChild(this.selectMargin);
        this.topBar.ressources[index].el.appendChild(this.selectMargin);
        
        if(this.workspace.items[index].preview) this.workspace.items[index].fire('Item:snapshotTaken',this.workspace.items[index].preview);
      }.bind(this));

      this.on('Compagnon:itemAdded', function (newindex,type,data,item) {
        this.workspace.currentIndex = this.currentIndex = newindex;
        this.actions.push({ action : "add", index : newindex, type : type, data : data, legend : data.legend});
        //this.actions.push({ action : "update", type : "drawing"})
      }.bind(this))

      this.on('Compagnon:itemDeleted', function (newindex,data,type) {
        this.workspace.currentIndex = this.currentIndex = newindex;
        this.actions.push({ action : "delete", data : data, index : newindex,type : type});
      })

      this.on('compagnon:sync', function () {

      }.bind(this))

      this.on('compagnon:ressource:dropped', function (droppedElement,targetElement) { // could be  designed in a way better way
          var k = this.topBar.ressourcesHTML.indexOf(droppedElement) //0;
          var i = this.topBar.ressourcesHTML.indexOf(targetElement) //0;
          
          //console.log(droppedElement,targetElement);

          var dropItem = this.workspace.items[k];
          var targetItem = this.workspace.items[i];
 
          var withoutDrop = this.topBar.ressourcesHTML.slice(0);
          var itemsUpdate = this.workspace.items.slice(0);

          withoutDrop.splice(k,1);
          itemsUpdate.splice(k,1);
          
          if(i === 0) {
            withoutDrop.unshift(droppedElement);
            this.topBar.ressourcesHTML = withoutDrop;
            //itemsUpdate.unshift(dropItem);
            //this.workspace.items = itemsUpdate;
          } else if (i === this.topBar.ressourcesHTML.length-1) {
            withoutDrop.push(droppedElement);
            this.topBar.ressourcesHTML = withoutDrop;
            //itemsUpdate.push(dropItem);
            //this.workspace.items = itemsUpdate;
          } else {
            this.topBar.ressourcesHTML = withoutDrop.slice(0,i).concat([droppedElement]).concat(withoutDrop.slice(i,withoutDrop.length));
            //this.workspace.items = itemsUpdate.slice(0,i).concat(dropItem).concat(itemsUpdate.slice(i,itemsUpdate.length));
          }

          for(var p = 0, n = this.topBar.ressourcesHTML.length; p < n; p++ ) {
            this.topBar.ressourcesHTML[p].parentNode.removeChild(this.topBar.ressourcesHTML[p]);
            this.topBar.ressourcesHTML[p].style.left = "0px";
            this.topBar.ressourcesHTML[p].style.cssFloat = "left";
          }


          for(var z = 0, m = this.topBar.ressourcesHTML.length; z < m ; z++ ) {
            this.topBar.el.children[1].appendChild(this.topBar.ressourcesHTML[z]);
          }
      }.bind(this))
      
    },

    sync : function (index,autist) {
      var currentItem = this.workspace.items[index || index === 0 ? index : this.currentIndex];
      var datas = {el : currentItem.el, type : currentItem.type, legend : currentItem.input.legend, link : currentItem.input.link, preview : currentItem.preview, item : currentItem}
      console.log(datas)
      if(!autist) this.fire('compagnon:sync',datas);
      return datas;
    },

    undo : function () { //actions à annuler à spécifier
      if(this.actions[this.actions.length - this.cancel - 1]) {
        this.cancel++
        var actionToCancel = this.actions[this.actions.length - this.cancel];
        //console.log(actionToCancel);
        if(actionToCancel.action === 'update' ) {
          this.workspace.update(actionToCancel.oldType,actionToCancel.data,actionToCancel.legend,actionToCancel.index,true);
        }
        else if (actionToCancel.action === 'add') {
          this.delete(true);
        }
        else if (actionToCancel.action === 'delete') {
          this.add(actionToCancel.type,actionToCancel.data,true);
        }
        else if (actionToCancel.action === 'itemAction') {
          this.workspace.items[this.currentIndex].undo();
        }
        this.fire('compagnon:undo');
      }
    },

    redo : function () {//actions à rétablir à spécifier
      if(this.actions[this.actions.length - this.cancel]) {
        var actionToCancel = this.actions[this.actions.length - this.cancel];
        //console.log(actionToCancel);
        if(actionToCancel.action === 'update' ) this.workspace.update(actionToCancel.type,actionToCancel.data,actionToCancel.legend,actionToCancel.index,true);
        else if (actionToCancel.action === 'add') {
          this.add(actionToCancel.type,actionToCancel.data,true);
        }
        else if (actionToCancel.action === 'delete') this.delete(true);
        else if (actionToCancel.action === 'itemAction'){ 
          this.workspace.items[this.currentIndex].redo();
        }
        this.cancel--
      }
      this.fire('compagnon:redo'); //STT this.fire('redo'), compagnon ne parle pas d'elle même à la troisième personne !
    },

    delete : function (cancel) {
      this.topBar.ressources[this.currentIndex].el.parentNode.removeChild(this.topBar.ressources[this.currentIndex].el);
      if (this.topBar.ressourcesHTML) {
        var erase = this.topBar.ressourcesHTML.indexOf(this.topBar.ressources[this.currentIndex].el);
        this.topBar.ressourcesHTML.splice(erase,1);
      }
      var daddy = this.workspace.items[this.currentIndex].el.parentNode;
      var data = this.workspace.items[this.currentIndex].getData();
      var type = this.workspace.items[this.currentIndex].type;
      daddy.removeChild(this.workspace.items[this.currentIndex].el);

      if(!cancel) this.fire('Compagnon:itemDeleted',this.currentIndex-1,data,type);
      else {
        this.actions[this.actions.length - this.cancel].data = this.workspace.items[this.currentIndex].getData();
      }

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
      
      this.workspace.fire('Workspace:newCurrentIndex',this.currentIndex)
      this.topBar.ressources[this.currentIndex].el.className += " selected";

      if(this.selectMargin.parentNode) this.selectMargin.parentNode.removeChild(this.selectMargin);
      this.topBar.ressources[this.currentIndex].el.appendChild(this.selectMargin);
    },

    add : function (type,data,cancel) {
      var data = data || {}; //STT var data = data || {};
      var type = type || "drawing";

      var newR = new r.Compagnon.Ressource({type : type, data : data})
      
      this.topBar.ressources.push(newR)
      if(this.topBar.ressourcesHTML) this.topBar.ressourcesHTML.push(newR.el);
      else this.topBar.ressourcesHTML = [newR.el];
      this.topBar.items.appendChild(newR.el); //STT non

      if(this.workspace.items[this.currentIndex]) {// if no item declared remove nothing
        var daddy = this.workspace.items[this.currentIndex].el.parentNode;
        daddy.removeChild(this.workspace.items[this.currentIndex].el);
      } else {
        var daddy = this.workspace.verticeContainer; //STT non
      }

      var newIndice = this.topBar.ressources.length - 1;
      
//<<<<<<< HEAD
      this.topBar.ressources[this.currentIndex].el.className = "mini-item " + this.topBar.ressources[this.currentIndex].type;
      if(this.selectMargin.parentNode) this.selectMargin.parentNode.removeChild(this.selectMargin);
      this.topBar.ressources[this.currentIndex].el.appendChild(this.selectMargin);

//=======
//>>>>>>> bcf725122110fe7c298a1eef73b3dffe687f7d46
      this.currentIndex = newIndice;
      this.workspace.items.push(new r.Compagnon[this.workspace.hashTypes[type]](data));
      //this.workspace.items.push(this.create(r.Compagnon[this.workspace.hashTypes[type]],(data)));
      daddy.appendChild(this.workspace.items[this.currentIndex].el);

      this.workspace.items[this.currentIndex].on('Item:snapshotTaken', function (preview) {
          this.topBar.ressources[this.currentIndex].el.style.backgroundImage = "url(\"" + preview + "\")";
      }.bind(this))
        
      this.workspace.items[this.currentIndex].on('item:legendUpdated', function (legend) {
        this.workspace.items[this.currentIndex].input.legend = legend;
      }.bind(this))

      this.workspace.items[this.currentIndex].on('action', function (action) {
          this.actions.push(action);
        }.bind(this))

      newR.el.addEventListener("mousedown", function () {
        this.select(newIndice);
        this.currentIndex = newIndice;
      }.bind(this));

      newR.on('ressource:dropped', function (droppedElement,targetElement) {
        this.fire('compagnon:ressource:dropped',droppedElement,targetElement);
      }.bind(this))

      if(!cancel) {
        this.cancel = 0;
        this.fire('Compagnon:itemAdded',this.currentIndex,type,data,this);
      }
      this.workspace.fire('Workspace:newCurrentIndex',this.currentIndex)
//<<<<<<< HEAD
      this.topBar.ressources[this.currentIndex].el.className += " selected";

      if(this.selectMargin.parentNode) this.selectMargin.parentNode.removeChild(this.selectMargin);
      this.topBar.ressources[this.currentIndex].el.appendChild(this.selectMargin);
//=======
      
      //ugly this should be factorised
      this.workspace.items[this.currentIndex].on('edit', function() {
        if(this.syncMode) this.workspace.fire('ressource:edit', this.workspace.items[this.currentIndex]);
      }.bind(this), this);

      if (this.workspace.items[this.currentIndex].getData) this.fire('to', this.workspace.items[this.currentIndex].getData());
//>>>>>>> bcf725122110fe7c298a1eef73b3dffe687f7d46
    },

    select : function (index) {
      var daddy = this.workspace.items[this.currentIndex].el.parentNode;
      daddy.removeChild(this.workspace.items[this.currentIndex].el);
      this.topBar.ressources[this.currentIndex].el.className = "mini-item " + this.topBar.ressources[this.currentIndex].type;

      daddy.appendChild(this.workspace.items[index].el);
      this.currentIndex = index;
//<<<<<<< HEAD
      this.topBar.ressources[this.currentIndex].el.className += " selected";

      if(this.selectMargin.parentNode) this.selectMargin.parentNode.removeChild(this.selectMargin);
      this.topBar.ressources[this.currentIndex].el.appendChild(this.selectMargin);

//=======

      this.fire('select', this.workspace.items[index].input);

      this.fire('to', this.workspace.items[index].getData());
//>>>>>>> bcf725122110fe7c298a1eef73b3dffe687f7d46
    },

    swap : function (firstIndex,secondIndex) {
      var ressourceBuffer =  this.topBar.ressources[firstIndex];
      var workspaceBuffer = this.workspace.items[firstIndex];

      this.topBar.ressources[firstIndex] = this.topBar.ressources[secondIndex];
      this.workspace.items[firstIndex] = this.workspace.items[secondIndex];
      this.topBar.ressources[secondIndex] = ressourceBuffer;
      this.workspace.items[secondIndex] = workspaceBuffer;
      this.currentIndex === firstIndex ? this.currentIndex = secondIndex : ( this.currentIndex === secondIndex ? this.currentIndex = firstIndex : this.currentIndex );
    },

    getDatas : function () {
      var data = []; 
      for(var k = 0, len = this.workspace.items.length; k < len; k++) {
        data.push(this.sync(k,true));
      }
      this.fire('compagnon:dataObtained',data);
      return data;
    },

    syncOn : function () {
      this.syncMode = true;
    },

    syncOff : function () {
      this.syncMode = false;
    }

  })
})