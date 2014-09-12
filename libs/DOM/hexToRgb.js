(sand.define("DOM/hexToRgb", function(r) {

  this.exports = function(hex) {
    return ([(hex & 0xff0000) >> 16,
      (hex & 0x00ff00) >> 8,
      hex & 0x0000ff]);
  }
    
}));
