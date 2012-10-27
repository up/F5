/**
 * Copyright (c) Uli Preuss
 * Original (LazyReload.js) copyright (c) Matthias Schuetz
 * MIT license
 */

(function(win) {
	
  var 
    timer, len, checksum, compare, get, deactivate, deactivate, add, getScrollXY,
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
			}
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

}(window));

