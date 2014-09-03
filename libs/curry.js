sand.define("PrototypeExtensions/curry", function () {
  Function.prototype.curry = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    return function () {
      return self.apply([], args.concat(Array.prototype.slice.call(arguments)));
    };
  }
})