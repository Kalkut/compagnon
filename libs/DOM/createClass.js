//TODO test compatibility with browsers

sand.define("DOM/createClass", function() {

  return function(selector, o) {
    var style = document.createElement('style');
    var content = '';
    content += selector + '{';
    for (var i in o) content += i + ':' + o[i] + ';';
    style.innerHTML = content + '}';
    document.head.appendChild(style);
  };

});
