(function (win) {

  var
    interval = 1000,
    method = "header",
    title = '[F5] ' + document.title,
    iframeId = 'F5Iframe',
    src = window.location.href,
    F5win, F5WinHead, F5WinBody, iframe, script, getDimentions, setDimentions, scriptText, SBContent, SBMethod, hasInnerText
  ;

  getDimentions = function () {
    var width, height;
    if (document.body && document.body.offsetWidth) {
      width = document.body.offsetWidth;
      height = document.body.offsetHeight;
    }
    if (document.compatMode === 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
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
      timer, len, checksum, compare, get, getfiles, activate, deactivate, add, getScrollXY, _SB_, checksums = [],
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
        delay = 5,
        //sets the time the menu stays out for after the mouse goes off it.
        waitBeforeHiding = 500,
        contentWidth = 0,
        labelWidth = 35,
        timer, SB, SBWrapper, SBLabel, SBContentWrapper, SBTitle, label = '&nbsp;<b>F5</b>&nbsp;',
        title = '<div id="SBTitle" style="margin:0"></div>',
        content = '<div id="SBContent"></div>',
        divstyle = 'display:inline-block;color:white;padding: 10px 5px;',
        body = document.querySelector('body'),
        checked = false
      ;

      function setBorderRadius(y, x) {
        var radius = '5px;';
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

      function slide(num) {
        SBWrapper.style.right = parseInt(SBWrapper.style.right, 10) + num + "px";
      }

      function show() {
        clearTimeout(timer);
        if (parseInt(SBWrapper.style.right, 10) < 0) {
          timer = setTimeout(function () {
            show();
          }, delay);
          slide(10);
        }
      }

      function moveBack() {
        clearTimeout(timer);
        if (parseInt(SBWrapper.style.right, 10) > - contentWidth) {
          timer = setTimeout(function () {
            moveBack();
          }, delay);
          slide(-10);
        }
      }

      function hide() {
        clearTimeout(timer);
        timer = setTimeout(function () {
          moveBack();
        }, waitBeforeHiding);
      }

      function refreshLayout() {
        contentWidth = SBWrapper.offsetWidth + 15;
        // Convert % manual to %25 for bookmarklet ##############################################
        contentWidth += 10 - (contentWidth %25 10); 
        SBWrapper.style.width = contentWidth + labelWidth + "px";
        SBWrapper.style.right = -contentWidth + "px";
        SBContentWrapper.style.width = contentWidth - labelWidth + 7 + "px";
        SBWrapper.style.visibility = "visible";
      }

      function change(obj, num) {
        if (!obj.checked) {
          files[num][2] = false;
        } else {
          files[num][2] = true;
        }
      }

      function toggleAll() {

        SBContent = document.querySelector('#SBContent');
        var 
          inputs = SBContent.getElementsByTagName('input'),
          i = 0
        ;

        checked = checked ? false : true;

        for (; i < inputs.length; i += 1) {
          inputs[i].checked = checked;
          change(inputs[i], i);

          // highlight
          ext = inputs[i].nextSibling.innerHTML.toLowerCase();
          if (inputs[i].checked) {
            inputs[i].nextSibling.style.color = "#cea500";
          } else {
            if (/\.css/.test(ext)) {
              inputs[i].nextSibling.style.color = "#DDD";
            } else if (/\.js/.test(ext)) {
              inputs[i].nextSibling.style.color = "#FFF";
            } else {
             inputs[i].nextSibling.style.color = "#FFFFCC"; // images
            }
          }
        }

      }

      function createSidebarContent(files) {

        var 
          i = 0,
          span, input, label, select, options, option, para, ext
        ;

        function addElement(tagname, parent) {
          parent.appendChild(document.createElement(tagname));
        }

        SBContent.innerHTML = '';
        SBTitle = document.querySelector('#SBTitle');

        if (files.length > 10) {
          SBContent.style.width = '500px';
        }
        for (; i < files.length; i += 1) {
          span = document.createElement('span');
          span.style.cssText = "display:inline-block;white-space:nowrap;";

          input = document.createElement('input');
          input.id = "file_" + i;
          input.type = "checkbox";
          input.value = files[i][1];

          label = document.createElement('label');
          label.htmlFor = "file_" + i;
          label.style.cssText = "cursor:pointer; margin-right:12px";
          ext = files[i][1].toLowerCase();
          if (/\.css/.test(ext)) {
            label.style.cssText += "color:#DDD;";
          } else if (/\.js/.test(ext)) {
            label.style.cssText += "color:#FFF";
          } else {
           label.style.cssText += "color:#FFFFCC"; // images
          }

          label.innerHTML = files[i][1];

          span.appendChild(input);
          span.appendChild(label);
          SBContent.appendChild(span);

          if (files.length <= 10 && i < files.length - 1) {
            addElement('br', SBContent);
          }
        }

        para = document.createElement('p');
        para.style.cssText = "text-align:right; margin: 10px 0";
        para.innerHTML = '' +
          '<a href="https://github.com/up/F5" ' +
          'style="' + 
          '  background-color: #666;display:inline-block;padding:2px 4px;' +
          '  color:#E8E8E8;text-decoration:none;font-size: 0.7em; ' +
          '">F5 @ github</a>';
        SBContent.appendChild(para);

        select = document.createElement('select');
        select.id = "method";
        select.style.cssText = "";

        options = [
          ["header", "response header"],
          ["length", "content length"],
          ["content", "content"]
        ];

        for (i = 0; i < options.length; i += 1) {
          option = document.createElement('option');
          option.value = options[i][0];
          option.innerHTML = "Check by " + options[i][1];
          select.appendChild(option);
        }

        SBTitle.appendChild(select);

        if (files.length <= 10) {
          addElement('br', SBTitle);
        }

        select = document.createElement('select');
        select.id = "interval";
        select.style.cssText = "";

        options = [1000, 2000, 3000, 5000, 10000];

        for (i = 0; i < options.length; i += 1) {
          option = document.createElement('option');
          option.value = options[i][0];
          option.innerHTML = "Interval " + options[i];
          select.appendChild(option);
        }

        SBTitle.appendChild(select);

        SBTitle.innerHTML += '<button onclick="F5.toggleAll()">Toggle</button>';
        addElement('br', SBTitle);
        addElement('br', SBTitle);

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
        'padding-top:17px;padding-left:20px;' + 
        'background-color:#222;';
      SBContentWrapper.innerHTML = title + content;
      SBWrapper.appendChild(SBContentWrapper);

      body.style.overflowX = 'hidden';

      createSidebarContent(files);

      window.F5.toggleAll = toggleAll;
      window.F5.change = change;

    };

    compare = function () {

      if (files[count][2] && arguments[0]) {
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

      if (typeof(iWin.pageYOffset) === 'number') {
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
      if (files[count][2]) {
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

    getfiles = function () {
      var
        i, href, src, iframe = document.getElementById(iframeId),
        doc = iframe.contentWindow.document,
        stylesheets = doc.styleSheets,
        scripts = doc.getElementsByTagName('script'),
        imgs =  doc.getElementsByTagName('img'),
        img_ext = 'png gif svg jpg jpeg',
        ext, hash = {}
      ;
      for (i = 0; i < stylesheets.length; i++) {
        href = stylesheets[i].href;
        if (href !== '' && href !== null && href.substring(href.lastIndexOf('.') + 1).toLowerCase() === 'css') {
          add(href);
        }
      }
      for (i = 0; i < scripts.length; i++) {
        src = scripts[i].src;
        if (src !== '' && src !== null && src.substring(src.lastIndexOf('.') + 1).toLowerCase() === 'js') {
          add(src);
        }
      }
      for (i = 0; i < imgs.length; i++) {
        src = imgs[i].src;
		    ext = src.substring(src.lastIndexOf('.') + 1).toLowerCase();
		    if (src !== '' && img_ext.indexOf(ext) !== -1) {
			      hash[src] = true;
			    }
			  }

			  // push the unique image URLs
			  for (url in hash) {
			    add(url);
			  }
      return files;
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

    win.setTimeout(function () {
      activate();

      SBContent.onclick = function () {
        var 
          inputs = SBContent.getElementsByTagName('input'), 
          i = 0, ext
        ;
        for (; i < inputs.length; i += 1) {
          files[i][2] = inputs[i].checked;
          // highlight
          ext = inputs[i].nextSibling.innerHTML.toLowerCase();
          if (inputs[i].checked) {
            inputs[i].nextSibling.style.color = "#cea500";
          } else {
            if (/\.css/.test(ext)) {
              inputs[i].nextSibling.style.color = "#DDD";
            } else if (/\.js/.test(ext)) {
	              inputs[i].nextSibling.style.color = "#FFF";
	            } else {
              inputs[i].nextSibling.style.color = "#FFFFCC"; // images
            }
          }
        }
      };
      SBMethod = document.querySelector('#method');
      SBMethod.onchange = function () {
        method = this.options[this.selectedIndex].value;
      };
      var SBInterval = document.querySelector('#interval');
      SBInterval.onchange = function () {
        interval = this.options[this.selectedIndex].value; // TODO: bug?
      };

    }, 2000);

    window.F5 = {};
    window.F5.activate = activate;
    window.F5.deactivate = deactivate;
    window.F5.running = running;

  }

  if (document.getElementById(iframeId) === null) {

    hasInnerText = (document.getElementsByTagName("body")[0].innerText !== undefined) ? true : false;
    scriptText = '(' + F5.toString() + '(window, "' + iframeId + '", "' + method + '", ' + interval + '));';

    F5win = window.open();
    F5WinHead = F5win.document.head;
    F5WinBody = F5win.document.body;

    F5WinHead.innerHTML = '' + 
      '<title>' + title + '</title>' +
      '<style>' +
      'body{ margin:0; overflow:hidden;} ' +
      'iframe{border:none} ' +
      'select, button {margin-left:7px;margin-top:3px;font-size:0.8em;} ' +
      'button {margin-left:8px;} ' +
      'option {padding: 2px 3px 0px;}' +
      '</style>';

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
