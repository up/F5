(function (win) {

  var
    timer = 1000,
    title = '[F5] ' + document.title,
    src = window.location.href,
    F5win, F5WinHead, F5WinBody,
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

  function F5(win) {
	  var 
	    timer, len, checksum, compare, get, activate, deactivate, add, getScrollXY,
	    checksums = [],
	    positions = [],
	    count = 0,
	    pending = false,
	    running = false,
	    interval = 1000,
	    method = "header",
	    files = []
	  ;

	  compare = function() {
	    pending = true;

	    if (checksums[count] === undefined) {
	      checksums[count] = checksum;
	    } else if (checksums[count] !== checksum) {
		    checksums[count] = checksum;
		    var iframe = document.getElementById("iframe1");
		    var positions = getScrollXY();
		    iframe.contentWindow.location.reload(true);
		    iframe.onload = function () {
				    iframe.contentWindow.scrollTo(positions[0], positions[1]);
				};
	    }

	    count++;

	    if (count < len) {
	      get();
	    } else {
	      pending = false;
	      count = 0;
	    }
	  };

		getScrollXY = function() {
		    var 
		      posX = 0, posY = 0,
				  iframe = document.getElementById("iframe1"),
	        iWin = iframe.contentWindow,
	        iDoc = iWin.document,
	        iBody = iDoc.body,
	        iElem = iDoc.documentElement
	      ;

		    if( typeof( iWin.pageYOffset ) == 'number' ) {
		        //Netscape compliant
		        posY = iWin.pageYOffset;
		        posX = iWin.pageXOffset;
		    } else if( iBody && ( iBody.scrollLeft || iBody.scrollTop ) ) {
		        //DOM compliant
		        posY = iBody.scrollTop;
		        posX = iBody.scrollLeft;
		    } else if( iElem && ( iElem.scrollLeft || iElem.scrollTop ) ) {
		        //IE6 standards compliant mode
		        posY = iElem.scrollTop;
		        posX = iElem.scrollLeft;
		    }
		    return [ posX, posY ];
		};

	  get = function() {
	    var req = new XMLHttpRequest();    
	    req.onreadystatechange = function() {
	      if (req.readyState === 4) {
	        switch (method) {
	          case "header":
	            if (req.status === 200) {
	              checksum = req.getResponseHeader("Last-Modified").toString();
	              compare();
	            } 
	            break;  
	          case "length":
	            checksum = req.responseText.toString().length;
	            compare();
	            break;  
	          case "content":
	            checksum = req.responseText.toString();
	            compare();
	            break;
	        }
	      }
	    };
	    req.open("GET", files[count] + "?" + new Date().getTime(), true); 
	    req.send(null);
	  };

	  activate = function() {
	    files = getfiles();
	    len = files.length;
	    timer = win.setInterval(function() {
	      if (!pending) {
	        get();
	      }
	    }, interval);
	    running = true;
	  };

	  deactivate = function() {
	    win.clearInterval(timer);
	    running = true;
	  };

	  add = function(file) {
	    files.push(file);	
	  };

	  getfiles = function() {
	    var 
	      i, href, src,
	      iframe = document.getElementById("iframe1"),
	      doc = iframe.contentWindow.document,
	      stylesheets = doc.styleSheets,
	      scripts = doc.getElementsByTagName('script')
	    ;
	    for (i=0; i<stylesheets.length; i++) {
	      href = stylesheets[i].href;
	      add(href);        
	    }    
	    for (i=0; i<scripts.length; i++) {
	      src = scripts[i].src;
	      if(src !== '' && src.substring(src.length-5) !== 'f5.js') {
	        add(src);        
	      }
	    }    
	    return files;
	  };

		win.setTimeout(function() {
		  activate();
	  }, interval);

		win['F5'] = {};
		win['F5']['activate'] = activate;
		win['F5']['deactivate'] = deactivate;
		win['F5']['running'] = running;

  }


  if (document.getElementById('iframe1') === null) {

		var hasInnerText = (document.getElementsByTagName("body")[0].innerText != undefined) ? true : false;

    F5win = window.open();
    F5WinHead = F5win.document.head;
    F5WinBody = F5win.document.body;

    F5WinHead.innerHTML = '<title>' + title + '</title><style>body{margin:0;overflow:hidden}</style>';

    iframe = document.createElement('iframe');
    iframe.id = "iframe1";
    iframe.src = src;
    F5WinBody.appendChild(iframe);

    script = document.createElement('script');
    script.type = "text/javascript";
		if(!hasInnerText){
		    script.textContent = '(' + F5.toString() + '(window));';
		} else {
		    script.innerText = '(' + F5.toString() + '(window));';
		}  
    // script.src = 'http://ulipreuss.eu/test/F5/f5.js';
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
})(window);
