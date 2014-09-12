(sand.define("DOM/rgbToHsv", function(r) {

  this.exports = function(r, g, b) {

            var r = (r / 255),
                 g = (g / 255),
                 b = (b / 255);	

            var min = Math.min(Math.min(r, g), b),
                max = Math.max(Math.max(r, g), b),
                delta = max - min;

            var value = max,
                saturation,
                hue;

            // Hue
            if (max == min) {
                hue = 0;
            } else if (max == r) {
                hue = (60 * ((g-b) / (max-min))) % 360;
            } else if (max == g) {
                hue = 60 * ((b-r) / (max-min)) + 120;
            } else if (max == b) {
                hue = 60 * ((r-g) / (max-min)) + 240;
            }

            if (hue < 0) {
                hue += 360;
            }

            // Saturation
            if (max == 0) {
                saturation = 0;
            } else {
                saturation = 1 - (min/max);
            }

            return [Math.round(hue), Math.round(saturation * 100), Math.round(value * 100)];
        }
    
}));
