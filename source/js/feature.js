/*! FEATURE.JS 1.0.0, http://featurejs.com */
;(function(a,c,k){function f(){}var d=c.documentElement,b={create:function(g){return c.createElement(g)},old:!!/(Android\s(1.|2.))|(Silk\/1.)/i.test(navigator.userAgent),pfx:function(){var g=c.createElement("dummy").style,a=["Webkit","Moz","O","ms"],b={};return function(c){if("undefined"===typeof b[c]){var e=c.charAt(0).toUpperCase()+c.substr(1),e=(c+" "+a.join(e+" ")+e).split(" ");b[c]=null;for(var d in e)if(g[e[d]]!==k){b[c]=e[d];break}}return b[c]}}()},l=!(b.old||null===b.pfx("perspective")),m=
!(b.old||null===b.pfx("transformOrigin")),n=null!==b.pfx("transition"),p=!!a.addEventListener,q=!!c.querySelectorAll,r=!!a.matchMedia,t="placeholder"in b.create("input"),h;try{localStorage.setItem("x","x"),localStorage.removeItem("x"),h=!0}catch(u){h=!1}f.prototype={constructor:f,css3Dtransform:l,cssTransform:m,cssTransition:n,addEventListener:p,querySelectorAll:q,matchMedia:r,deviceMotion:"DeviceMotionEvent"in a,deviceOrientation:"DeviceOrientationEvent"in a,contextMenu:"contextMenu"in d&&"HTMLMenuItemElement"in
a,classList:"classList"in d,placeholder:t,localStorage:h,historyAPI:a.history&&"pushState"in a.history,webWorker:"Worker"in a,viewportUnit:function(a){try{return a.style.width="1vw",""!==a.style.width}catch(b){return!1}}(b.create("dummy")),remUnit:function(a){try{return a.style.width="1rem",""!==a.style.width}catch(b){return!1}}(b.create("dummy")),canvas:function(a){return!(!a.getContext||!a.getContext("2d"))}(b.create("canvas")),svg:!!c.createElementNS&&!!c.createElementNS("http://www.w3.org/2000/svg",
"svg").createSVGRect,webGL:function(b){try{return!(!a.WebGLRenderingContext||!b.getContext("webgl")&&!b.getContext("experimental-webgl"))}catch(c){return!1}}(b.create("canvas")),cors:"XMLHttpRequest"in a&&"withCredentials"in new XMLHttpRequest,touch:!!("ontouchstart"in a||a.navigator&&a.navigator.msPointerEnabled&&a.MSGesture||a.DocumentTouch&&c instanceof DocumentTouch),async:"async"in b.create("script"),defer:"defer"in b.create("script"),geolocation:"geolocation"in navigator,srcset:"srcset"in b.create("img"),
sizes:"sizes"in b.create("img"),pictureElement:"HTMLPictureElement"in a,testAll:function(){var a=" js",b;for(b in this)"testAll"!==b&&"constructor"!==b&&this[b]&&(a+=" "+b);d.className+=a.toLowerCase()}};a.feature=new f})(window,document);
