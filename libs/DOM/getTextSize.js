sand.define('DOM/getTextSize', function() {

  return function(str, size, family, cb) {
    var div = document.body.appendChild(document.createElement('div'));
    div.style.visibility = 'hidden';
    div.style.zIndex = -1;
    div.style.fontFamily = family;
    div.style.cssFloat = 'left';
    div.style['float'] = 'left';
    div.style.fontSize = (typeof(size) === 'number' ? size + 'px' : size);

    div.innerHTML = str;
    cb(div.offsetWidth);
    document.body.removeChild(div);
  };

});