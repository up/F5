(function () {

  var
    timer = 1000,
    title = 'F5 :: ' + document.title,
    src = window.location.href,
    F5win = window.open(),
    F5WinHead = F5win.document.head,
    F5WinBody = F5win.document.body,
    iframe, script, getDimentions, setDimentions
  ;

  getDimentions = function () {
    var width, height;
    if (document.body && document.body.offsetWidth) {
      width = document.body.offsetWidth;
      height = document.body.offsetHeight;
    }
    if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
      width = document.documentElement.offsetWidth;
      height = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    return [width, height];
  };

  setDimentions = function () {
    var
      iframe = F5win.document.getElementById('iframe1'),
      dim = getDimentions()
    ;
    iframe.style.width = dim[0];
    iframe.style.height = dim[1];

  };

  if (document.getElementById('iframe1') === null) {

    F5WinHead.innerHTML = '<title>' + title + '</title><style>body{margin:0;overflow:hidden}</style>';

    iframe = document.createElement('iframe');
    iframe.id = "iframe1";
    iframe.src = src;
    F5WinBody.appendChild(iframe);

    script = document.createElement('script');
    script.type = "text/javascript";
    script.src = 'http://ulipreuss.eu/test/F5/f5.js';
    F5WinBody.appendChild(script);

    setDimentions();

    if (window.focus) {
      F5win.focus();
    }

    F5win.onresize = setDimentions;
    F5win.onunload = function () {};

    document.close();

  } else {

    /*
    if(typeof F5 === 'object') {
      if(F5.running) {
        F5.deactivate();
        F5.running = false;
      } else {
        F5.activate();
        F5.running = true;
      }
    }  
    */
    // document.write ALWAYS starts a new page unless there is one currently being loaded.
    //window.history.back();
  }
})();
