sand.define('touch/Gesture', [
  'Seed'
], function(r) {

  return r.Seed.extend({

    '+init' : function(o) {
      this.touches = [];

      this.noRightClick = o.noRightClick;

      for (var i = -1, n = o.touches.length; ++i < n; ) this.touches.push({
        clientX : o.touches[i].clientX || o.touches[i].pageX,
        clientY : o.touches[i].clientY || o.touches[i].pageY,
        identifier : o.touches[i].identifier
      });

      this.center = this.getCenter();

      if (this.touches.length > 1) {
        this.dist = this.getDist(this.center);
        this.v = this.getV();
      }
      else {
        this._sc = this.center;

        if (!this.noRightClick) {
          this._timeout = setTimeout(function() { //rightclick
            this.fire('longtap', [o.e]);
            drag = null;
            this._timeout = null;
            this.fire('destroy');
          }.bind(this), 500);
        }
      }
    },

    getV : function() {
      var res = [];
      for (var i = -1, n = this.touches.length; ++i < n; ) {
        res.push(this.center.minus([this.touches[i].clientX, this.touches[i].clientY]));
      }
      return res;
    },

    getCenter : function() {
      var center = [0, 0];
      for (var i = this.touches.length; i--; ) {
        var touch = this.touches[i];
        center = center.add([touch.clientX, touch.clientY]);
      }
      return center.divide(this.touches.length);
    },

    getDist : function(center) {
      var dist = 0;
      for (var i = this.touches.length; i--; ) {
        var touch = this.touches[i];
        dist += Math.sqrt(Math.pow(center[0] - touch.clientX, 2) + Math.pow(center[1] - touch.clientY, 2));
      }
      return dist / this.touches.length;
    },

    touchstart : function(touches) {
      for (var i = -1, n = touches.length; ++i < n; ) {
        if (!this.touches.where('identifier', touches[i].identifier)) { // strange behavior double fire with svg vertices ?
          this.touches.push({
            clientX : touches[i].clientX || touches[i].pageX,
            clientY : touches[i].clientY || touches[i].pageY,
            identifier : touches[i].identifier
          });
        }
      }

      if (this._timeout && this.touches.length > 1) {
        clearTimeout(this._timeout);
        this._timeout = false;
      }

      this.v = this.getV();
      this.center = this.getCenter();
      this.dist = this.getDist(this.center);
    },

    touchmove : function(touches, e) {
      for (var i = -1, n = touches.length; ++i < n; ) {
        var touch = this.touches.where('identifier', touches[i].identifier);
        //console.log('touchmove', touches[i].clientX);
        //console.log(touch);
        //console.log(touch[0].clientX);
        touch.set('clientX', touches[i].clientX || touches[i].pageX);
        touch.set('clientY', touches[i].clientY || touches[i].pageY);
        //console.log(touch[0].clientX);
      }

      //console.log('center', this.center);
      //console.log(this.center.minus(this._sc).dist());

      var center = this.getCenter();
      if (this.touches.length === 1 && this._timeout) { // && this_timeout prevents the rightclick in case of a come and go (~ aller retour :))
        if (center.minus(this._sc).dist() > 40) {
          clearTimeout(this._timeout);
          this._timeout = null;
          this.refresh(e);
        }
      }
      else {
        this.refresh(e);
      }
    },

    preventRightClick : function() {
      return;
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    },

    touchend : function(touches) {
      for (var i = touches.length; i--; ) {
        var touch = touches[i];
        for (var j = this.touches.length; j--; ) {
          if (this.touches[j].identifier === touch.identifier) this.touches.splice(j, 1);
        }
      }
      if (!this.touches.length) {
        if (this._timeout) { // this means we haven't move enough to trigger a drag
          clearTimeout(this._timeout);
          this._timeout = null;
          this.fire('tap');
        }

        this.fire('destroy');
        return;
      }
      this.center = this.getCenter();
      this.dist = this.getDist(this.center);
    },

    refresh : function(e) {
      var newCenter = this.getCenter();
      if (!newCenter.equals(this.center)) {
        this.fire('translate', newCenter.minus(this.center), e);
        this.center = newCenter;
      }

      if (this.touches.length > 1) {
        var dist = this.getDist(newCenter);
        if (dist !== this.dist) {
          this.fire('scale', dist / this.dist, e);
          this.dist = dist;
        }

        var v = this.getV();
        if (this.v) {
          var rotation = 0;
          v.each(function(v, i) {
            rotation += (v[1]/v[0] > this.v[i][1]/this.v[i][0] ? 1 : -1) * Math.acos((this.v[i][0] * v[0] + this.v[i][1] * v[1]) / (Math.sqrt(Math.pow(this.v[i][0], 2) + Math.pow(this.v[i][1], 2)) * Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2))));
          }.bind(this));
          rotation = rotation / this.touches.length;
          if (isNaN(rotation)) {
            rotation = 0;
          }

          this.fire('rotate', rotation); //(v[1]/v[0] > this.v[1]/v[0] ? 1 : -1) * 
        }
        this.v = v;
      }
      else {
        this.v = null;
      }
    }

  });

});