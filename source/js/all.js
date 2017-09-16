//= require "fastclick"
//= require "feature"
//= require "util"

/*!
 * Upstatic v1.0
 * http://upstatic.io
 */

 /* global feature, upstatic, util, FastClick */

(function (window, document, undefined) {
  "use strict";

  /**
   * The Upstatic object
   *
   * @constructor
   */
  function Upstatic() {
    this.ua = navigator.userAgent;
    this.timer;
  }

  Upstatic.prototype = {
    constructor : Upstatic,

    /**
     * Intializes the instance
     *
     * @function
     */
    init : function () {
      var self = this;

      if (util.isIE()) document.documentElement.className += " iefix";

      if (util.isSupported) {
        // Fastclick init
        util.addListener(window, "load", function () {
          FastClick.attach(document.body);
        }, false);

        util.addListener(window, "resize", this.resize, false);

        this.resize();
        this.terminal();
        this.downloads();
        this.sectionLinks();
        setTimeout(function() {
          window.addEventListener("scroll", self.notice, false);
        }, 500);
        this.notice();
      }
    },

    /**
     * Magic terminal
     *
     * @function
     */
    terminal : function () {
      var terminal = document.getElementById("terminal");
      var self = this;

      if (terminal) {
        util.addListener(terminal, "click", function (e) {
          e.preventDefault();
          if (!terminal.classList.contains("deploy")) {
            self.deploy(terminal);
          }
        }, false);

        util.addListener(document, "keyup", function (e) {
          var evt = e || window.event;
          if (evt.keyCode === 13 && !terminal.classList.contains("deploy")) {
            self.deploy(terminal);
          }
        }, false);
      }
    },


    /**
     * Check if the viewport height matches the scroll height
     *
     * @function
     */
    resize : function () {
      var viewport = window.innerHeight;
      var html = document.documentElement;
      var body = document.body;
      var bodyHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );

      if (bodyHeight === viewport) {
        html.classList.add("no-scroll");
      } else {
        html.classList.remove("no-scroll");
      }
    },

    /**
     * Deploy
     *
     * @param  {Element} the element to deploy
     * @function
     */
    deploy : function (element) {
      window.clearTimeout(this.timer);
      element.classList.add("deploy");

      this.timer = window.setTimeout(function () {
        element.classList.remove("deploy");
        element.classList.add("restart");
      }, 6000);
    },

    /**
     * Downloads
     *
     * @function
     */
    downloads : function () {
      var self = this;
      var buttons = document.querySelectorAll(".downloads a");

      if (document.querySelector(".downloads .osx")) {
        this.detectPlatform(buttons);

        // Save the current platform
        var active = document.querySelector(".downloads a.active");
        var info = document.querySelector(".dwnld-info");
        var visible = false;

        util.addListener(info, "mouseover", function () {
          window.clearTimeout(self.timer);
          visible = true;
        }, false);

        util.addListener(info, "mouseout", function () {
          self.timer = setTimeout(function () {
            visible = false;
            info.classList.remove("active");
          }, 1000);
        }, false);

        util.forEach(buttons, function (i) {
          util.addListener(buttons[i], "mouseover", function () {
            window.clearTimeout(self.timer);
            info.classList.remove("active");
            active.classList.remove("active");
            if (buttons[i].classList.contains("osx")) {
              info.classList.add("active");
            }
          }, false);
          util.addListener(buttons[i], "mouseout", function () {
            active.classList.add("active");
            self.timer = setTimeout(function () {
              if (!visible) info.classList.remove("active");
            }, 1000);
          }, false);
        });
      }
    },

    /**
     * Section links
     *
     * @function
     */
    sectionLinks : function () {
      var headers = document.querySelectorAll("section.sub h2");

      if (headers) {
        util.forEach(headers, function (i) {
          var link = document.createElement("a");
          var id = "#" + headers[i].id;
          link.setAttribute("href", id);
          link.setAttribute("title", "Right click to copy a link to " + id);
          link.className = "section-id";
          link.innerHTML = "#";
          headers[i].appendChild(link);
        });
      }
    },

    /**
     * Platform detection
     *
     * @param  {Element} the element to remove the active class from
     * @function
     */
    detectPlatform : function (element) {
      util.forEach(element, function (which) {
        element[which].classList.remove("active");
      });

      if (this.ua.indexOf("Win") !== -1) {
        document.querySelector(".win").classList.add("active");
        return;
      } else if (this.ua.indexOf("Android") !== 1) {
        document.querySelector(".osx").classList.add("active");
        return;
      } else if (this.ua.indexOf("Linux") !== -1) {
        document.querySelector(".lnx").classList.add("active");
        return;
      } else {
        document.querySelector(".osx").classList.add("active");
      }
    },

    /**
     * Dismissable notice message
     *
     * @function
     */
    notice : function() {
      if (feature.localStorage && !localStorage.getItem("upstaticio")) {
        var self = this;
        var width = window.innerWidth;
        var notice = document.querySelector(".notice");
        var scrollTop = window.pageYOffset;
        console.log(scrollTop);

        if (scrollTop > 1500 && width > 300) {
          notice.classList.add("active");
        } else {
          notice.classList.remove("active");
        }

        notice.addEventListener("click", function(e) {
          e.preventDefault();
          notice.classList.remove("active");
          window.removeEventListener("scroll", self.notice, false);
          localStorage.setItem("upstaticio", "true");
        }, false);
      }
    }

  };

  /**
   * Expose a public-facing API
   */
  function expose() {
    var upstatic = new Upstatic();
    upstatic.init();
    return upstatic;
  }
  window.upstatic = expose;

}(window, document));

/**
 * Upstatify all the things
 */
upstatic();
