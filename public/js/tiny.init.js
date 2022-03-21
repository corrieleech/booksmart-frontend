

// testi-slider
if (document.getElementsByClassName('testi-slider')[0] != undefined) {
  var slider = tns({
      container: '.testi-slider',
      loop: true,
      speed : 400,
      center : true,
      mouseDrag: true,
      controls: false,
      autoplay: true,
      autoplayButtonOutput: false,
      responsive: {        
          640: {
              edgePadding: 20,
              gutter: 20,
              items: 1
            },
            700: {
              edgePadding: 20,
              gutter: 30,
              items: 1
            },
            900: {
              edgePadding: 20,
              items: 1
            }
      }
  });
  }



// client-slider

if (document.getElementsByClassName('cat-slider')[0] != undefined) {
  var slider = tns({
      container: '.cat-slider',
      loop: true,
      speed : 400,
      nav : false,
      arrowKeys : true, 
      center : true,
      mouseDrag: true,
      controls: false,
      autoplay: true,
      autoplayButtonOutput: false,
      responsive: {        
          640: {
              edgePadding: 20,
              gutter: 20,
              items: 1
            },
            700: {
              edgePadding: 20,
              gutter: 30,
              items: 1
            },
            900: {
              edgePadding: 20,
              items: 1
            }
      }
  });
  }



