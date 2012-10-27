#F5

## Bookmarklet


This is [an example][33] reference-style link.

[33]: javascript:%20\(function\(\){var%20timer=1000,title='F5%20::%20'+document.title,src=window.location.href,F5win,F5WinHead,F5WinBody,iframe,script,getDimentions,setDimentions;getDimentions=function\(\){var%20width,height;if\(document.body&&document.body.offsetWidth\){width=document.body.offsetWidth;height=document.body.offsetHeight;}%20if\(document.compatMode=='CSS1Compat'&&document.documentElement&&document.documentElement.offsetWidth\){width=document.documentElement.offsetWidth;height=document.documentElement.offsetHeight;}%20if\(window.innerWidth&&window.innerHeight\){width=window.innerWidth;height=window.innerHeight;}%20return[width,height];};setDimentions=function\(\){var%20iframe=F5win.document.getElementById\('iframe1'\),dim=getDimentions\(\);iframe.style.width=dim[0];iframe.style.height=dim[1];};if\(document.getElementById\('iframe1'\)===null\){F5win=window.open\(\),F5WinHead=F5win.document.head,F5WinBody=F5win.document.body,F5WinHead.innerHTML='<title>'+title+'</title><style>body{margin:0;overflow:hidden}</style>';iframe=document.createElement\('iframe'\);iframe.id="iframe1";iframe.src=src;F5WinBody.appendChild\(iframe\);script=document.createElement\('script'\);script.type="text/javascript";script.src='http://ulipreuss.eu/test/F5/f5.js';F5WinBody.appendChild\(script\);setDimentions\(\);if\(window.focus\){F5win.focus\(\);}%20F5win.onresize=setDimentions;F5win.onunload=function\(\){};document.close\(\);}else{}}\)\(\);


```javascript

```
