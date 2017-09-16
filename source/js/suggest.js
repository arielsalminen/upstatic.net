//= require "ranking"

/* global util, autoSuggest */

/*!
 * Upstatic AutoSuggest v1.0
 * http://upstatic.io
 */

(function (window, document, undefined) {
  "use strict";

  /**
   * The AutoSuggest object
   *
   * @param  {Element} The input element
   * @param  {Element} The list element
   * @param  {Element} The loading indicator element
   * @param  {integer} The breakpoint for the scroll-to-input functionality
   * @constructor
   */
  function AutoSuggest(elem, list, loader, breakpoint) {
    this.field = document.querySelector(elem) || document.getElementById("search");
    this.list = document.querySelector(list) || document.getElementById("suggestions");
    this.loader = document.querySelector(loader) || document.querySelector(".loading");
    this.links = this.list.getElementsByTagName("a");
    this.breakpoint = breakpoint || 660;

    this.placeholderText = "Type a keyword (eg. “caching”)";
    this.placeholderTextMobile = "Type a keyword";

    this.activeClass = "active";
    this.visibleClass = "visible";
    this.focusClass = "focus";

    this.ticking = false;
  }

  AutoSuggest.prototype = {
    constructor : AutoSuggest,

    /**
     * Intializes the instance
     *
     * @function
     */
    init : function () {
      var self = this;

      if (util.isSupported && this.list && this.list !== "null") {
        util.addListener(window, "blur", this, false);
        util.addListener(window, "resize", this, false);
        util.addListener(window, "keydown", this, false);
        util.addListener(window, "orientationchange", this, false);
        util.addListener(this.field, "focus", function () {
          self.field.classList.add(self.focusClass);
        }, false);

        util.forEach(this.links, function (i) {
          self.links[i].setAttribute("tabindex", "-1");
        });

        this.resize();
        this.setupCache();
        this.placeholderPolyfill();
        this.toggleResults();
        this.handleInputEvents();
        this.handleMouseEvents();
      }
    },

    /**
     * Remove focus from search results
     *
     * @param  {Event} event
     * @function
     */
    removeFocus : function (e) {
      var self = this;
      if (this.field === document.activeElement) return;
      var focused = document.querySelectorAll("." + this.focusClass);
      if (focused[0]) {
        util.forEach(focused, function (i) {
          focused[i].classList.remove(self.focusClass);
        });
      }
    },

    /**
     * Takes care of basic event handling
     *
     * @param  {event} event
     * @return {type} returns the type of event that should be used
     */
    handleEvent : function (e) {
      var evt = e || window.event;

      switch (evt.type) {
      case "click":
        this.clickOutside(evt);
        break;
      case "keydown":
        this.removeFocus(evt);
        break;
      case "keyup":
        this.toggleResultsOnKeyup(evt);
        break;
      case "orientationchange":
      case "resize":
        this.resize(evt);
        break;
      case "focus":
        this.scrollIntoView(this.field);
        break;
      case "blur":
        this.blur(evt);
        break;
      }
    },

    /**
     * Stuff for window.resize and orientationchange
     *
     * @function
     */
    resize : function () {
      if (window.innerWidth < this.breakpoint) {
        util.addListener(this.field, "focus", this, false);
        this.field.setAttribute("placeholder", this.placeholderTextMobile);
      } else {
        util.removeListener(this.field, "focus", this, false);
        this.field.setAttribute("placeholder", this.placeholderText);
      }
    },

    /**
     * Find element's real position
     *
     * @param  {Element} element
     * @function
     */
    findPosition : function (elem) {
      var top = 0;
      if (elem.offsetParent) {
        do {
          top += elem.offsetTop;
        } while (!!(elem = elem.offsetParent));
        return top;
      }
    },

    /**
     * Get current scroll position
     *
     * @function
     */
    getCurrentPosition : function () {
      // Firefox, Chrome, Opera, Safari
      if (window.pageYOffset) return window.pageYOffset;
      return 0;
    },

    /**
     * Scroll element into viewport
     *
     * @param  {Element} element
     * @function
     */
    scrollIntoView : function (elem) {
      var startY = this.getCurrentPosition();
      var stopY = this.findPosition(elem) - 30;
      var distance = stopY > startY ? stopY - startY : startY - stopY;
      var speed = Math.round(distance / 50);
      if (speed >= 20) speed = 20;
      var step = Math.round(distance / 25);
      var leapY = stopY > startY ? startY + step : startY - step;
      var timer = 0;
      var i;
      if (stopY > startY) {
        for (i = startY; i < stopY; i += step) {
          setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
          leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
      }
      for (i = startY; i > stopY; i -= step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
      }
    },

    /**
     * Polyfill input placeholders
     *
     * @function
     */
    placeholderPolyfill : function () {
      var self = this;
      if (!util.supportsPlaceholder) {
        this.field.value = this.placeholderText;
        util.addListener(this.field, "focus", function () {
          if (this.value === self.placeholderText) this.value = "";
        }, false);
        util.addListener(this.field, "blur", function () {
          if (this.value === "") this.value = self.placeholderText;
        }, false);
      }
    },

    /**
     * Placeholder fallback
     *
     * @function
     */
    placeholderFill : function () {
      if (!util.supportsPlaceholder) {
        this.field.value = this.placeholderText;
      } else {
        this.field.value = "";
      }
    },

    /**
     * Handle clicks outside of certain element
     *
     * @param  {Event} event
     * @function
     */
    clickOutside : function (e) {
      var level = 0;
      for (var el = e.target; el; el = el.parentNode) {
        if (el.id === this.list.id || el.id === this.field.id) {
          return;
        }
        level++;
      }
      this.blur();
      this.removeFocus();
    },

    /**
     * Toggles results open & closed on keyup
     *
     * @param  {Event} event
     * @function
     */
    toggleResultsOnKeyup : function (e) {
      if (e.keyCode === 27) { // Esc
        e.preventDefault();
        this.blur();
        this.removeFocus();
        return;
      }

      if (history.pushState) {
        history.pushState("", document.title, window.location.pathname);
      }

      if (this.field.value === "") return;

      if (this.value !== "") {
        if (window.getComputedStyle(this.list, null).getPropertyValue("display") === "none") {
          this.list.style.display = "block";
          this.list.scrollTop = 0;
        }
      } else {
        this.list.style.display = "none";
      }
    },

    /**
     * Logic for toggling results
     *
     * @function
     */
    toggleResults : function () {
      var self = this;

      util.addListener(document, "click", this, false);
      util.addListener(this.field, "keyup", this, false);
      util.addListener(this.field, "keydown", function (e) {
        var evt = e || window.event;

        // Space & Enter
        if (evt.keyCode === 32 || evt.keyCode === 13) {
          e.preventDefault(); return;
        }

        // Tab
        if (e.keyCode === 9) {
          self.list.style.display = "none";
          self.removeFocus();
          return;
        }
      }, false);
    },

    /**
     * Handle submit
     *
     * @param  {Event} event
     * @param  {Element} the active element
     * @function
     */
    handleSubmit : function (event, activeResult) {
      var self = this;

      event.preventDefault();
      this.stopGettingScores();

      if (activeResult) {
        activeResult.classList.add("submit");
        setTimeout(function () {
          var href = activeResult.querySelector("a").getAttribute("href");
          var id = href.replace("#", "");
          var elem = document.getElementById(id);

          window.scrollTo(0, self.findPosition(elem) - 40);
          self.field.classList.remove(self.focusClass);
          elem.classList.add(self.focusClass);
          self.blur();
        }, 150);

      } else {
        setTimeout(function () {
          self.loader.classList.remove(self.activeClass);
        }, 150);
      }
    },

    /**
     * Browse results up and down
     *
     * @param  {Element} the active element
     * @param  {Element} the next element from active
     * @param  {Boolean} browser from the beginning, true or false
     * @function
     */
    browseResults : function (activeEl, next, fromBeginning) {
      var el;

      if (!activeEl) return;

      // Determine which result to select next
      next ? el = activeEl.nextElementSibling : el = activeEl.previousElementSibling;
      while (el && !el.classList.contains(this.visibleClass)) {
        next ? el = el.nextElementSibling : el = el.previousElementSibling;
      }

      // If element exists and it has a visible class
      if (el && el.classList.contains(this.visibleClass)) {
        activeEl.classList.remove(this.activeClass);
        el.classList.add(this.activeClass);
        activeEl = el;

        // Scroll the active element into view
        var topPos = 0;
        if (!fromBeginning) {
          topPos = activeEl.offsetTop || 0;
        }
        if (next) {
          if (!fromBeginning) {
            if (topPos > 180) this.list.scrollTop = topPos - 50;
          } else {
            this.list.scrollTop = topPos - 50;
          }
        } else {
          this.list.scrollTop = topPos - 50;
        }
      }
    },

    /**
     * Handles keyup & blur events
     *
     * @function
     */
    handleInputEvents : function () {
      var self = this;
      util.addListener(this.field, "blur", function (e) {
        self.stopGettingScores();
      });
      util.addListener(this.field, "keyup", function (e) {
        self.ticking = false;
        var evt = e || window.event;

        // Prevent some keys like arrow left and right triggering result lookup
        if (evt.keyCode === 16 || evt.keyCode === 18 || evt.keyCode === 37 || evt.keyCode === 39) {
          e.preventDefault(); return;
        }

        var activeResult = self.list.querySelector("li." + self.activeClass);
        if (evt.keyCode === 13) self.handleSubmit(e, activeResult); // Enter

        // Arrow up and down
        if (evt.keyCode === 40 || evt.keyCode === 38) {
          e.preventDefault();
          self.stopGettingScores();

          if (activeResult) {
            evt.keyCode === 40 ? self.browseResults(activeResult, true) : self.browseResults(activeResult, false);

          // If no elements are active
          } else {
            if (evt.keyCode === 40) {
              var childNodes = self.list.querySelectorAll("li." + self.visibleClass);
              util.addClassToFirstOfType(childNodes, self.activeClass);
              self.browseResults(self.list.querySelector("li." + self.activeClass), true, true);
            }
          }
          return;
        }
        self.filter();
      });
    },

    /**
     * Handles mouse events
     *
     * @function
     */
    handleMouseEvents : function () {
      var savedState = this.list.querySelector("li." + this.activeClass);
      var self = this;

      util.forEach(this.links, function (i) {

        // Select on mouseover
        util.addListener(self.links[i], "mouseover", function () {
          self.stopGettingScores();
          savedState.classList.remove(self.activeClass);
          self.links[i].parentNode.classList.add(self.activeClass);
          savedState = self.links[i].parentNode;
        }, false);

        // Deselect on mouseout
        util.addListener(self.links[i], "mouseout", function () {
          self.links[i].parentNode.classList.remove(self.activeClass);
          self.ticking = false;
        }, false);

        // Handle submit on click
        util.addListener(self.links[i], "click", function (e) {
          self.handleSubmit(e, self.links[i].parentNode);
        }, false);
      });
    },

    /**
     * Filter results
     *
     * @function
     */
    filter : function () {
      var self = this;

      if (this.field.value === "") {
        util.forEach(this.list.children, function (i) {
          self.list.children[i].style.display = "block";
        });
        return;
      }

      if (this.field === document.activeElement) { // If has :focus
        this.loader.classList.add(this.activeClass);
      }

      if (!this.ticking) {
        this.stopGettingScores();
        self.timer = window.setInterval(function () {
          self.displayLate();
        }, 200);
      }
    },

    /**
     * Display late
     *
     * @function
     */
    displayLate : function () {
      this.displayResults(this.getScores(this.field.value.toLowerCase()));
      this.loader.classList.remove(this.activeClass);
      this.ticking = false;
    },

    /**
     * Caching
     *
     * @function
     */
    setupCache : function () {
      var self = this;
      this.cache = [];
      this.rows = [];
      util.forEach(this.list.children, function (i) {
        self.cache.push(self.list.children[i].innerHTML.toLowerCase());
        self.rows.push(self.list.children[i]);
      });
      this.cacheLength = this.cache.length;
    },

    /**
     * Display Results
     *
     * @param  {string} string
     * @function
     */
    displayResults : function (scores) {
      var self = this;

      util.forEach(this.list.children, function (i) {
        self.list.children[i].style.display = "none";
        self.list.children[i].className = "";
      });

      util.forEach(scores, function (i, score) {
        self.rows[score[1]].style.display = "block";
        self.rows[score[1]].classList.add(self.visibleClass);
      });

      var childNodes = this.list.querySelectorAll("li." + this.visibleClass);
      util.addClassToFirstOfType(childNodes, this.activeClass);
    },

    /**
     * Get scores
     *
     * @param  {string} string
     * @function
     */
    getScores : function (term) {
      var scores = [];
      for (var i=0; i < this.cacheLength; i++) {
        var score = this.cache[i].score(term);
        if (score > 0) {
          scores.push([score, i]);
        }
      }
      this.stopGettingScores();
      return scores.sort(function (a, b) {
        return b[0] - a[0];
      });
    },

    /**
     * Stop getting scores
     *
     * @function
     */
    stopGettingScores : function () {
      clearInterval(this.timer);
      this.ticking = true;
    },

    /**
     * Blur field
     *
     * @function
     */
    blur : function () {
      this.list.style.display = "none";
      this.field.blur();
      this.placeholderFill();
      this.loader.classList.remove(this.activeClass);
    }
  };

  /**
   * Expose a public-facing API
   */
  function expose(elem, list, loader, breakpoint) {
    var autoSuggest = new AutoSuggest(elem, list, loader, breakpoint);
    autoSuggest.init();
    return autoSuggest;
  }
  window.autoSuggest = expose;

}(window, document));


// Init Upstatic AutoSuggest
autoSuggest();
