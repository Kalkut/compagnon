sand.define('Compagnon/Video',['Compagnon/Item'], function (r) {
  return r.Item.extend({
    '+init' : function (input) {
      this.type = "video";
      this.el.className += " video";
      this.width = window.innerWidth*0.676; 
      this.height = window.innerHeight*0.353;
      this.link = input.link || '';

      this.patterns = {
        vimeo : [ /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g , "//player.vimeo.com/video/"],
        youtube :[ /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g , "//www.youtube.com/embed/"]
      }

      this.frame = this.mediaConvert(this.link);
      if(this.link && this.frame) this.el.appendChild(this.frame);
      this.el.appendChild(this.legend);
    },

    mediaConvert : function (link,mediaTag) {
      if (!mediaTag) var mediaTag = 'iframe';
      for(var pattern in this.patterns){
        var id = this.patterns[pattern][0].exec(link)
        if (id) {
          return $('<'+ mediaTag +' width="'+ this.width +'" height="'+ this.height +'" src="'+ this.patterns[pattern][1] + id[1] + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></'+ mediaTag + '>')[0];
        }
      }
      return false;
    },
  })
})