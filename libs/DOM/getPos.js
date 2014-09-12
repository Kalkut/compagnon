(sand.define("DOM/getPos", function(r) {

  // it's important that everyone is "at least in position : relative"

  return function(el, parent) { // Gets the [x, y] offset of an element to the specified parent, or body if none defined
    var offset = [el.offsetLeft, el.offsetTop];
    if (el.parentNode === parent) return offset;
    while ((el = el.parentNode) && typeof(el.offsetLeft) !== "undefined") {
      offset = [offset[0]+el.offsetLeft, offset[1]+el.offsetTop];
      if (el.parentNode === parent) {
        break;
      }
    }
    return offset;
  }
    
}));
