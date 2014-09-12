sand.define('DOM/onfontsloaded', function() {

	var loaded = {};

	return function(fonts, callback) {
    var loadedFonts = 0;

		var check = function() {
			if (loadedFonts === fonts.length) {
				callback();
			}
		};

		var load = function(font, callback) {
	    var node = document.createElement('span');
	    // Characters that vary significantly among different fonts
	    node.innerHTML = 'giItT1WQy@!-/#';
	    // Visible - so we can measure it - but not on the screen
	    node.style.position      = 'absolute';
	    node.style.left          = '-10000px';
	    node.style.top           = '-10000px';
	    // Large font size makes even subtle changes obvious
	    node.style.fontSize      = '300px';
	    // Reset any font properties
	    node.style.fontFamily    = 'sans-serif';
	    node.style.fontVariant   = 'normal';
	    node.style.fontStyle     = 'normal';
	    node.style.fontWeight    = 'normal';
	    node.style.letterSpacing = '0';
	    document.body.appendChild(node);

	    // Remember width with no applied web font
	    var width = node.offsetWidth;

	    //if (font === 'proxima-light') console.log('referenceW', width);

	    node.style.fontFamily = font;

	    var interval;
	    function checkFont() {
	        // Compare current width with original width
	        //if (font === 'proxima-light') console.log('newW?', node.offsetWidth);
	        if (node && node.offsetWidth != width) {
	            ++loadedFonts;
	            loaded[font] = true;
	            node.parentNode.removeChild(node);
	            clearInterval(interval);
	            callback();
	        }
	    };

	    interval = setInterval(checkFont, 50);
		};

    for (var i = 0, l = fonts.length; i < l; ++i) {
    	if (loaded[fonts[i]]) loadedFonts++;
    	else load(fonts[i], check);
    }

    if (loadedFonts === fonts.length) callback(true);
	};


});