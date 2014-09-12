(sand.define("DOM/rgbToHex", function(r) {

  this.exports = function(r,g,b) {
      var hexVal = function(n) {
              var data = "0123456789ABCDEF";
              if (n==null) return "00";
              n=parseInt(n); 
              if (n==0 || isNaN(n)) return "00";
              n=Math.round(Math.min(Math.max(0,n),255));
              return data.charAt((n-n%16)/16) + data.charAt(n%16);
      }
      return hexVal(r)+hexVal(g)+hexVal(b);
  }
    
}));
