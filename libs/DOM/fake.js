sand.define('DOM/fake', function() {
  
  var fake = document.createElement("div");
  fake.style.visibility = "hidden";
  fake.style.position = 'absolute';
  return document.body.appendChild(fake);

});