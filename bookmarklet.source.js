(function (win) {

  var
    interval = 1000,
    method = "header",
    title = '[F5] ' + document.title,
    iframeId = 'F5Iframe',
    src = window.location.href,
    F5win, F5WinHead, F5WinBody, iframe, script, getDimentions, setDimentions, scriptText
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
      iframe = F5win.document.getElementById(iframeId),
      dim = getDimentions()
    ;
    iframe.style.width = dim[0];
    iframe.style.height = dim[1];
  };

  function F5(win, iframeId, method, interval) {
    var
      timer, len, checksum, compare, get, activate, deactivate, add, getScrollXY, _SB_,
      checksums = [],
      positions = [],
      count = 0,
      pending = false,
      running = false,
      files = []
    ;

		_SB_ = function (files) {
		  var
		    position = {
		      top: 70,
		      right: 0
		    },
		    delay = 10,
		    waitBeforeHiding = 1000, //sets the time the menu stays out for after the mouse goes off it.
		    bgcolor = "#222",
		    contentWidth = 0, // Must be a multiple of 10! 
		    labelWidth = 35,
		    timer, SB, SBWrapper, SBLabel, SBContentWrapper, 
		    label = '&nbsp;<b>F5</b>&nbsp;',
		    title = '<div id="SBTitle" style="margin:0"><b>Configuration</b></div>',
		    content = '<div id="SBContent"></div>',
		    divstyle = 'display:inline-block;color:white;padding: 10px 5px;',
		    body = document.querySelector('body'),
		    checked = false
		  ;

		  function setBorderRadius(y, x) {
		    var radius = '3px;';
		    return '-webkit-border-' + y + '-' + x + '-radius: ' + radius + 
		           '-moz-border-radius-' + y + x + ': ' + radius + 
		           'border-' + y + '-' + x + '-radius: ' + radius;
		  }

		  function setBoxShadow() {
		    var boxshadow = '-2px 2px 10px #222;';
		    return '-webkit-box-shadow: ' + boxshadow +
		           '-moz-box-shadow: ' + boxshadow +
		           'box-shadow: ' + boxshadow;
		  }

		  function newDiv(id) {
		    var div = document.createElement('div');
		    if (id !== null) {
		      div.id = id;
		    }
		    return div;
		  }

		  function show() {
		    clearTimeout(timer);
		    if (parseInt(SBWrapper.style.right, 10) < 0) {
		      timer = setTimeout(function () {
		        show();
		      }, delay);
		      slide(10);
		    }
		  };

		  function hide() {
		    clearTimeout(timer);
		    timer = setTimeout(function () {
		      moveBack();
		    }, waitBeforeHiding);
		  }

		  function moveBack() {
		    clearTimeout(timer);
		    if (parseInt(SBWrapper.style.right, 10) > (-contentWidth)) {
		      timer = setTimeout(function () {
		        moveBack();
		      }, delay);
		      slide(-10);
		    }
		  }

		  function slide(num) {
		    SBWrapper.style.right = parseInt(SBWrapper.style.right, 10) + num + "px";
		  }

		  function refreshLayout() {
			  contentWidth = SBWrapper.offsetWidth;
			  contentWidth += (10 - (contentWidth %25 10)); // Convert % manual to %25 ##############################################
			  SBWrapper.style.width = contentWidth + labelWidth + "px";
			  SBWrapper.style.right = -contentWidth + "px";
			  SBContentWrapper.style.width = contentWidth - labelWidth + 7 + "px";
			  SBWrapper.style.visibility = "visible";
		  }

			function toggleAll() {

			  SBContent = document.querySelector('#SBContent');
			  var inputs = SBContent.getElementsByTagName('input');

			  checked = checked ? false : true;

			  for(var i = 0; i<inputs.length;i+=1) {
			    inputs[i].checked = checked;
			    change(inputs[i], i);
			  }
			}

			function change(obj, num) {
				if(!obj.checked) {
				  files[num][2] = false;
				} else {
				  files[num][2] = true;
				}
			}

			function addExternalFiles(files) {
				
				var i = 0, span, input, label, br;

				SBContent.innerHTML = '';
			  //SBContent = document.querySelector('#SBContent');
			  SBTitle = document.querySelector('#SBTitle');

			  if(files.length > 10) {
				  SBContent.style.width = '500px';		
			  }
			  for(; i<files.length;i+=1) { 
				  span = document.createElement('span');
				  span.style.cssText = "display:inline-block;white-space:nowrap;";
				
				  input = document.createElement('input');
				  input.id = "file_" + i;
				  input.type = "checkbox";
				  input.value = files[i][1];

				  label = document.createElement('label');
				  label.htmlFor = "file_" + i;
				  label.style.cssText = "cursor:pointer; margin-right:12px";
          label.innerHTML = files[i][1];

          span.appendChild(input);
          span.appendChild(label);
          SBContent.appendChild(span);

				  if(files.length <= 10) {
	          SBContent.appendChild(document.createElement('br'));
				  }
			  }
						
        SBContent.appendChild(document.createElement('br'));

        SBTitle.appendChild(document.createElement('br'));

			  var select = document.createElement('select');
			  select.id = "method";
			  select.style.cssText = "";
			
			  var options = [
			    ["header", "response header"],
			    ["length", "content length"],
			    ["content", "content"]
			  ];
			
			  for(i = 0; i<options.length;i+=1) { 
				  var option = document.createElement('option');
				  option.value = options[i][0];
				  option.innerHTML = "check by " + options[i][1];
	        select.appendChild(option);
        }

        SBTitle.appendChild(select);

			  if(files.length <= 10) {
          SBTitle.appendChild(document.createElement('br'));
			  }

			  select = document.createElement('select');
			  select.id = "interval";
			  select.style.cssText = "";
			
			  var options = [1000, 2000, 3000, 5000, 10000];
			
			  for(i = 0; i<options.length;i+=1) { 
				  var option = document.createElement('option');
				  option.value = options[i][0];
				  option.innerHTML = "interval " + options[i];
	        select.appendChild(option);
        }

        SBTitle.appendChild(select);

			  SBTitle.innerHTML+= '<button onclick="F5.toggleAll()">TOGGLE</button>';
        SBTitle.appendChild(document.createElement('br'));
        SBTitle.appendChild(document.createElement('br'));

			  refreshLayout();
				
			}

		  SB = newDiv(null);
		  SB.style.cssText = '' + 
		    'font-family:arial;' + 
		    'position:absolute;right:' + position.right + 'px;top:' + position.top + 'px;' + 
		    'z-index: 1000;';
		  body.appendChild(SB);

		  SBWrapper = newDiv('SBWrapper');
		  SBWrapper.onmouseover = show;
		  SBWrapper.onmouseout = hide;
		  SBWrapper.style.cssText = '' + 
		    'position:absolute;right:0;top:0;' +
		    'visibility:hidden;';
		  SB.appendChild(SBWrapper);

		  SBLabel = newDiv(null);
		  SBLabel.style.cssText = '' + 
		    divstyle + 
		    setBorderRadius('top', 'left') + 
		    setBorderRadius('bottom', 'left') + 
		    setBoxShadow() +
		    'vertical-align:top;' +
		    'background-color:#222;';
		  SBLabel.innerHTML = label;
		  SBWrapper.appendChild(SBLabel);

		  SBContentWrapper = newDiv(null);
		  SBContentWrapper.style.cssText = '' + 
		    divstyle + 
		    setBorderRadius('bottom', 'left') + 
		    setBoxShadow() +
		    'padding-left:20px;' +
		    'background-color:#222;';
		  SBContentWrapper.innerHTML = title + content;
		  SBWrapper.appendChild(SBContentWrapper);
		  
		  body.style.overflowX = 'hidden';

			addExternalFiles(files);

		  window['F5']['toggleAll'] = toggleAll;
		  window['F5']['change'] = change;

		};

    compare = function () {

	    //console.log(count + '-' + files.length);
	    //console.log(count + '-' + files[count]);

      if(files[count][2] && arguments[0]) {
		    var iframe, positions;
	      pending = true;

	      if (checksums[count] === undefined) {
	        checksums[count] = checksum;
	      } else if (checksums[count] !== checksum) {
	        checksums[count] = checksum;
	        iframe = document.getElementById(iframeId);
	        positions = getScrollXY();
	        iframe.contentWindow.location.reload(true);
	        iframe.onload = function () {
	          iframe.contentWindow.scrollTo(positions[0], positions[1]);
	        };
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

    getScrollXY = function () {
      var
        posX = 0,
        posY = 0,
        iframe = document.getElementById(iframeId),
        iWin = iframe.contentWindow,
        iDoc = iWin.document,
        iBody = iDoc.body,
        iElem = iDoc.documentElement
      ;

      if (typeof(iWin.pageYOffset) == 'number') {
        //Netscape compliant
        posY = iWin.pageYOffset;
        posX = iWin.pageXOffset;
      } else if (iBody && (iBody.scrollLeft || iBody.scrollTop)) {
        //DOM compliant
        posY = iBody.scrollTop;
        posX = iBody.scrollLeft;
      } else if (iElem && (iElem.scrollLeft || iElem.scrollTop)) {
        //IE6 standards compliant mode
        posY = iElem.scrollTop;
        posX = iElem.scrollLeft;
      }
      return [posX, posY];
    };

    get = function () {
	    if(files[count][2]) {
	      var req = new XMLHttpRequest();
	      req.onreadystatechange = function () {
	        if (req.readyState === 4) {
	          switch (method) {
	          case "header":
	            if (req.status === 200) {
	              checksum = req.getResponseHeader("Last-Modified").toString();
	              compare(true);
	            }
	            break;
	          case "length":
	            checksum = req.responseText.toString().length;
	            compare(true);
	            break;
	          case "content":
	            checksum = req.responseText.toString();
	            compare(true);
	            break;
	          }
	        }
	      };
	      req.open("GET", files[count][0] + "?" + new Date().getTime(), true);
	      req.send(null);
      } else {
	      compare(false);
      }
    };

    activate = function () {
      files = getfiles();
	    _SB_(files);
      len = files.length;
      timer = win.setInterval(function () {
        if (!pending) {
          get();
        }
      }, interval);
      running = true;      
    };

    deactivate = function () {
      win.clearInterval(timer);
      running = true;
    };

    add = function (file) {
      files.push([
	      file,
	      file.substring(file.lastIndexOf('/') + 1),
	      false
	    ]);
    };

    getfiles = function () {
      var
        i, href, src, iframe = document.getElementById(iframeId),
        doc = iframe.contentWindow.document,
        stylesheets = doc.styleSheets,
        scripts = doc.getElementsByTagName('script')
      ;
      for (i = 0; i < stylesheets.length; i++) {
        href = stylesheets[i].href;
        if (href !== '' && href !== null && href.substring(href.lastIndexOf('.')+1).toLowerCase() === 'css') {
          add(href);
        }
      }
      for (i = 0; i < scripts.length; i++) {
        src = scripts[i].src;
        if (src !== '' && src !== null && src.substring(src.lastIndexOf('.')+1).toLowerCase() === 'js') {
          add(src);
        }
      }
      return files;
    };

    win.setTimeout(function () {
      activate();

      SBContent.onclick = function(){
			  var inputs = SBContent.getElementsByTagName('input');
			  for(i = 0; i<inputs.length;i+=1) {
				  files[i][2] = inputs[i].checked;
					//F5.change(this,i);
			  }
		  };
		  var SBMethod = document.querySelector('#method');
      SBMethod.onchange = function(){
			  method = this.options[this.selectedIndex].value;
		  };
		  var SBInterval = document.querySelector('#interval');
      SBInterval.onchange = function(){
			  interval = this.options[this.selectedIndex].value; // TODO: bug?
		  };

    }, interval);

    win['F5'] = {};
    win['F5']['activate'] = activate;
    win['F5']['deactivate'] = deactivate;
    win['F5']['running'] = running;

  }

  if (document.getElementById(iframeId) === null) {

    hasInnerText = (document.getElementsByTagName("body")[0].innerText != undefined) ? true : false;
    scriptText = '(' + F5.toString() + '(window, "' + iframeId + '", "' + method + '", ' + interval + '));';

    F5win = window.open();
    F5WinHead = F5win.document.head;
    F5WinBody = F5win.document.body;

    F5WinHead.innerHTML = '<title>' + title + '</title><style>body{margin:0;overflow:hidden;} iframe{border:none}</style>';

    iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.src = src;
    F5WinBody.appendChild(iframe);

    script = document.createElement('script');
    script.type = "text/javascript";
    if (!hasInnerText) {
      script.textContent = scriptText;
    } else {
      script.innerText = scriptText;
    }

    F5WinBody.appendChild(script);

    setDimentions();

    if (window.focus) {
      F5win.focus();
    }

    F5win.onresize = setDimentions;

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
