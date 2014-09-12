sand.define("DOM/getImageSize", ["DOM/handle", "DOM/fake"], function(r) {
  
  /**
   * this helper returns the size of a given image (defined by a src)
   */
  var fake = r.fake;
  
  this.exports = function(src, cb) {
    if (typeof(src) === 'string') {
      var img = document.createElement("img");
      img.setAttribute("src", src);
      fake.appendChild(img);
    }
    else {
      var img = src;
      var faked = true;
    }
    if (img.complete) {
      cb(img.offsetWidth, img.offsetHeight);
      faked || fake.removeChild(img);
    }
    else {
      img.onload = function() {
        cb(img.offsetWidth, img.offsetHeight);
        faked || fake.removeChild(img);
      }
    }
  } 
    
});
