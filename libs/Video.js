sand.define('Compagnon/Video',['Compagnon/Item'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {
      this.type = "video";
      this.el.className += " video";
      this.width = window.innerWidth*0.48; 
      this.height = window.innerHeight*0.366;
      this.link = input.link || '';

      this.patterns = {
        vimeo : [ /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g , "//player.vimeo.com/video/", "/vimeo-logo.jpg"],
        youtube :[ /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g , "//www.youtube.com/embed/", "https://i.ytimg.com/vi_webp//default.webp",28]//28 is the index where you insert the id of your media 
      }

      var media = this.mediaConvert(this.link)
      this.frame = media[0];
      this.preview = media[1];
      if(this.link && this.frame) this.el.appendChild(this.frame);
      this.el.appendChild(this.legend);
    },

    mediaConvert : function (link,mediaTag) {
      if (!mediaTag) var mediaTag = 'iframe';
      for(var pattern in this.patterns){
        var id = this.patterns[pattern][0].exec(link)
        if (id) {
          
          return [$('<'+ mediaTag +' width="'+ this.width +'" height="'+ this.height +'" src="'+ this.patterns[pattern][1] + id[1] + '" frameborder="0" style="border-bottom-width : 5px; border-bottom-style: solid; border-bottom-color: #408486;" webkitallowfullscreen mozallowfullscreen allowfullscreen></'+ mediaTag + '>')[0], this.patterns[pattern].length === 3 ? this.patterns[pattern][2] : this.patterns[pattern][2].slice(0,this.patterns[pattern][3])+id[1]+this.patterns[pattern][2].slice(this.patterns[pattern][3],this.patterns[pattern][2].length) ]
        }
      }
      return false;
    },
  })
})