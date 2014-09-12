(sand.define("DOM/lighten", ["DOM/rgbToHsv", "DOM/hexToRgb", "DOM/rgbToHex", "DOM/hsvToRgb"], function(r) {
  
  var hexToRgb = r.hexToRgb,
    rgbToHex = r.rgbToHex,
    rgbToHsv = r.rgbToHsv,
    hsvToRgb = r.hsvToRgb;

  this.exports = function(hex, v) {
    if (hex.search('rgb') === -1) {
      hex = parseInt("0x"+hex.substr(1, hex.length - 1), 16);
      var rgb = hexToRgb(hex);
    }
    else {
      var reg = /\((.*)\)/.exec(hex)[1];
      rgb = reg.split(',').map(function(str) {
        return parseInt(str.trim())
      });
    }
    //var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    //rgb = hsvToRgb(hsv[0], hsv[1]+v, hsv[2]+v);
    
    //--- from http://stackoverflow.com/questions/141855/programmatically-lighten-a-color
    var redistribute_rgb = function(rgb) {
      var r = rgb[0], g = rgb[1], b = rgb[2];
      var threshold = 255.999
      var m = rgb.max();
      if (m <= threshold) return [r, g, b];
      var total = r + g + b;
      if (total >= 3 * threshold) return [255, 255, 255];
      var x = (3 * threshold - total) / (3 * m - total)
      var gray = threshold - x * m;
      return [gray + x * r, gray + x * g, gray + x * b];
    }
    //---
    
    rgb = redistribute_rgb(rgb.multiply((100 + v) / 100));

    return ("#"+rgbToHex(rgb[0], rgb[1], rgb[2]));
    
    /*def redistribute_rgb(r, g, b):
    threshold = 255.999
    m = max(r, g, b)
    if m <= threshold:
        return int(r), int(g), int(b)
    total = r + g + b
    if total >= 3 * threshold:
        return int(threshold), int(threshold), int(threshold)
    x = (3 * threshold - total) / (3 * m - total)
    gray = threshold - x * m
    return int(gray + x * r), int(gray + x * g), int(gray + x * b)*/
  }
    
}));
