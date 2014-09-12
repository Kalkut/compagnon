sand.define('DOM/UA', [
  'core/Array/where'
], function() {
  
  var UA;
  
  // when requiring it from node server script the global 'navigator is not defined'
  if(typeof(navigator) ==="undefined"){
    this.exports = "firefox";
    return;
  }
  var n = navigator.userAgent.toLowerCase();
  if (n.indexOf("ipad") !== -1) UA = "ipad";
  else if (n.indexOf("chrome") !== -1 || n.indexOf("safari") !== -1) UA = "chrome"; // webkit
  else if (n.indexOf("firefox") !== -1) UA = "firefox";
  else if (n.indexOf("opera") !== -1) UA = "opera";
  else UA = "ie";
  
  //magictouch
  if (Array.prototype.slice.call(navigator.plugins).map(function(o){return o.name;}).where(function(n){return n.match(/npTuioClient/)}).length > 0){
    UA = 'ipad';
  }
  
  if (typeof(__UA) !== 'undefined') {
    console.log('FORCING UA');
    UA = __UA;
  }

  if (window.location.href.search('touch') !== -1) {
    UA = 'ipad';
  }

  //MCB
  /*var touch = 'ontouchstart' in document.documentElement;
  if (touch) {
    UA = 'ipad';
  }*/

  window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();
  
  //innokoreturn 'ipad';
  return UA;
  
});
