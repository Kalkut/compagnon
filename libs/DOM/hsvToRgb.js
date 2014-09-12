(sand.define("DOM/hsvToRgb", function(r) {

  this.exports = function(h,s,v) {

            var s = s / 100,
                 v = v / 100;

            var hi = Math.floor((h/60) % 6);
            var f = (h / 60) - hi;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);

            var rgb = [];

            switch (hi) {
                case 0: rgb = [v,t,p];break;
                case 1: rgb = [q,v,p];break;
                case 2: rgb = [p,v,t];break;
                case 3: rgb = [p,q,v];break;
                case 4: rgb = [t,p,v];break;
                case 5: rgb = [v,p,q];break;
            }

            var r = Math.min(255, Math.round(rgb[0]*256)),
                g = Math.min(255, Math.round(rgb[1]*256)),
                b = Math.min(255, Math.round(rgb[2]*256));

            return [r,g,b];

        }
    
}));
