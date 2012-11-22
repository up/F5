(function (win) {

  var
    interval = 1000,
    method = "Last-Modified",
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
      timer, len, checksum, compare, get, getfiles, activate, deactivate, add, addTabs, getScrollXY, _SB_, checksums = [],
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
        return 
          '-webkit-border-' + y + '-' + x + '-radius: ' + radius + 
          '-moz-border-radius-' + y + x + ': ' + radius + 
          'border-' + y + '-' + x + '-radius: ' + radius;
      }

      function setBoxShadow() {
        var boxshadow = '-2px 2px 10px #222;';
        return 
          '-webkit-box-shadow: ' + boxshadow + 
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
            if(inputs.length > 10) {
		          if (/\.css/.test(ext)) {
	              inputs[i].nextSibling.style.color = "#DDD";
	            } else if (/\.js/.test(ext)) {
	              inputs[i].nextSibling.style.color = "#FFF";
	            } else {
	              inputs[i].nextSibling.style.color = "#FFFFCC"; // images
	            }
            } else {
	            inputs[i].nextSibling.style.color = "#DDD";
            }

          }
        }

      }

      function createSidebarContent(files) {

        var
          i = 0,
          div, span, input, label, select, options, option, para, ext, tabnum
        ;

        function addElement(tagname, parent) {
          parent.appendChild(document.createElement(tagname));
        }

        SBContent.innerHTML = '';
        SBTitle = document.querySelector('#SBTitle');

        var display = files.length > 10 ? 'tabs' : 'list';

        if (display === 'tabs') {
          SBContent.style.width = '500px';

          jtabs.create(
	          ['CSS', ''], 
	          ['JavaScript', ''], 
	          ['Images', '']
	        ).appendTo(SBContent);
        }
        var tabs = document.querySelectorAll('#tabContent > div');
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
            if (display === 'list') {
              label.style.cssText += "color:#DDD;";
            }
            tabnum = 0;
          } else if (/\.js/.test(ext)) {
            if (display === 'list') {
              label.style.cssText += "color:#FFF";
            }
            tabnum = 1;
          } else {
            if (display === 'list') {
              label.style.cssText += "color:#FFFFCC"; // images
            }
            tabnum = 2;
          }

          label.innerHTML = files[i][1];

          span.appendChild(input);
          span.appendChild(label);

          if (display === 'list') {
            SBContent.appendChild(span);
            if (i < files.length - 1) {
              addElement('br', SBContent);
            }
          } else {
            tabs[tabnum].appendChild(span);
          }
        }

        para = document.createElement('p');
        para.style.cssText = "text-align:right; margin: 10px 0";
        para.innerHTML = '' + 
          '<a href="http://up.github.com/F5/" ' + 
          'style="' + 
          '  background-color: #666;display:inline-block;padding:2px 4px;' + 
          '  color:#E8E8E8;text-decoration:none;font-size: 0.7em; ' + 
          '">F5 @ github</a>'
        ;
        SBContent.appendChild(para);

        select = document.createElement('select');
        select.id = "method";
        select.style.cssText = "";

        options = [
          ["Last-Modified", "Last-Modified"],
          ["Content-Length", "Content-Length"]
          //["content", "content"]];
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
        'position:absolute;' +
        'right:' + position.right + 'px;' +
        'top:' + position.top + 'px;' + 
        'z-index: 1000;'
      ;
      body.appendChild(SB);

      SBWrapper = newDiv('SBWrapper');
      SBWrapper.onmouseover = show;
      SBWrapper.onmouseout = hide;
      SBWrapper.style.cssText = '' + 
        'position:absolute;right:0;top:0;' + 
        'visibility:hidden;'
      ;
      SB.appendChild(SBWrapper);

      SBLabel = newDiv(null);
      SBLabel.style.cssText = '' + 
        divstyle + 
        setBorderRadius('top', 'left') + 
        setBorderRadius('bottom', 'left') + 
        setBoxShadow() + 
        'vertical-align:top;' + 
        'background-color:#222;'
      ;
      SBLabel.innerHTML = label;
      SBWrapper.appendChild(SBLabel);

      SBContentWrapper = newDiv(null);
      SBContentWrapper.style.cssText = '' + 
        divstyle + 
        setBorderRadius('bottom', 'left') + 
        setBoxShadow() + 
        'padding-top:17px;padding-left:20px;' + 
        'background-color:#222;'
      ;
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
          if (req.readyState === 4 && req.status === 200) {
            switch (method) {
            case "Last-Modified":
              checksum = req.getResponseHeader("Last-Modified").toString();
              break;
            case "Content-Length":
              checksum = req.getResponseHeader("Content-Length");
              break;
              /*
            case "content":
              checksum = req.responseText.toString();
              break;
            case "length":
              checksum = req.responseText.toString().length;
              break;
            */
            }
            compare(true);
          }
        };
        req.open("HEAD", files[count][0] + "?" + new Date().getTime(), true);
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
        imgs = doc.getElementsByTagName('img'),
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
        if (src !== '' && img_ext.indexOf(ext) !== - 1) {
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
      addTabs(win);
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

    addTabs = function (win) {

      var
        tab_container, iframe = document.getElementById(iframeId),
        doc = document
      ;

      function newElement(name) {
        return doc.createElement(name);
      }

      function getAll(selector) {
        return doc.querySelectorAll(selector);
      }

      function toggleTabs(tab) {
        var
          i, lis = getAll("#tabs li"),
          tas = getAll("#tabs #tabContent div")
        ;
        for (i = 0; i < lis.length; i++) {
          lis[i].className = "";
        }
        for (i = 0; i < tas.length; i++) {
          tas[i].style.display = 'none';
        }
        tab.className = "selected";
        tas[parseInt(tab.id.substring(3), 10) - 1].style.display = 'block';
      }

      function createListItem(id, title, sel) {
        var li = newElement('li');
        li.innerHTML = title;
        li.id = id;
        li.onclick = function () {
          toggleTabs(this);
        };
        if (sel) {
          li.className = "selected";
        }
        return li;
      }

      function addStyleRules(rules) {
        var
          head = doc.getElementsByTagName('head')[0],
          style = newElement('style')
        ;
        style.type = 'text/css';
        if (style.styleSheet) {
          style.styleSheet.cssText = rules;
        } else {
          style.appendChild(doc.createTextNode(rules));
        }
        head.appendChild(style);
      }

      function createTabContentWrapper(content, hide) {
        var div = newElement('div');
        div.innerHTML = content;
        if (hide) {
          div.style.display = 'none';
        }
        return div;
      }

      function appendTo(target) {
        target.appendChild(tab_container);
      }

      function create() {
        var
          args = arguments,
          len = args.length,
          tab_ul = newElement('ul'),
          tab_content = newElement('div')
        ;
        tab_container = newElement('div');
        tab_container.id = "tabs";
        tab_ul.id = "sidebarTabs";
        tab_container.appendChild(tab_ul);
        for (i = 0; i < len; i++) {
          tab_ul.appendChild(createListItem('tab' + (i + 1), args[i][0], i === 0 ? true : false));
        }
        tab_content.id = "tabContent";
        tab_container.appendChild(tab_content);
        for (i = 0; i < len; i++) {
          tab_content.appendChild(createTabContentWrapper(args[i][1], i > 0 ? true : false));
        }
        return this; // chaining
      }

      addStyleRules(
	      '#tabs{ margin:10px 0 0; }' + 
	      '#tabs ul { ' +
	      '  list-style:none; display:block; overflow:hidden; ' +
	      '  margin:0; padding:0; position: relative; top:1px;' +
	      '}' + 
	      '#tabs li { ' + 
	      '  float:left; border:1px solid #444; padding:5px 8px; ' +
	      '  cursor:pointer; border-bottom:none; margin-right:4px;' + 
	      '  font-family:verdana; font-size:.8em; font-weight:bold; color:#AAA; ' + 
	      '}' + 
	      '#tabs .selected{ ' +
	      '  background-color:#444; color:#cea500; font-weight: bold;' +
	      '}' + 
	      '#tabs #tabContent div { ' +
	      '  padding:10px; color:#EEE; background-color:#444; overflow:hidden;' +
	      '}'
	    );

      win['jtabs'] = {};
      win['jtabs']['create'] = create;
      win['jtabs']['appendTo'] = appendTo;

    };


    win.setTimeout(function () {
      activate();

      SBContent.onclick = function () {
        var
          inputs = SBContent.getElementsByTagName('input'),
          i = 0,
          ext
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

    }, 100);

  }

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
    '</style>'
  ;

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

  var completeIVal = setInterval(function () {
    if (iframe.contentWindow.document.readyState === 'complete') {
      F5WinBody.appendChild(script);
      clearInterval(completeIVal);
    }
  }, 100);

  setDimentions();

  if (window.focus) {
    F5win.focus();
  }

  F5win.onresize = setDimentions;

  document.close();

  F5win.F5 = {};
  //F5win.F5.running = running;

})(window);
