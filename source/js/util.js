/**
 * Utilities
 */

 /* exported util */

var util = {

  /**
   * Test for proper browser support
   */
  isSupported : !!window.addEventListener &&
                !!document.querySelectorAll &&
                ("classList" in document.documentElement),

  /**
   * Test for placeholder support
   */
  supportsPlaceholder : "placeholder" in document.createElement("input"),

  /**
   * forEach method
   *
   * @param  {array} array to loop through
   * @param  {function} callback function
   * @param  {object} context
   */
  forEach : function (array, callback, context) {
    var length = array.length;
    var cont, i;

    for (i = 0; i < length; i++) {
      cont = callback.call(context, i, array[i]);
      if (cont === false) {
        break; // Allow early exit
      }
    }
  },

  /**
   * Detect IE
   *
   * @function
   */
  isIE : function () {
    var userAgent = navigator.userAgent;
    return !!((userAgent.indexOf("MSIE") !== -1) || (userAgent.indexOf("Trident/") !== -1));
  },

  /**
   * addClassToFirstOfType method
   *
   * @param  {elements} elements to loop through
   * @param  {class} class to add
   */
  addClassToFirstOfType : function (elements, cls) {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].nodeType !== 3) { // nodeType 3 is a text node
        elements[i].classList.add(cls);
        break;
      }
    }
  },

  /**
   * Adds event listeners
   *
   * @param  {element} the element which the even should be added to
   * @param  {event} the event to be added
   * @param  {function} the function that will be executed
   */
  addListener : function (el, evt, fn, bubble) {
    if ("addEventListener" in el) {
      el.addEventListener(evt, fn, bubble);
    }
  },

  /**
   * Remove event listeners
   *
   * @param  {element} the element which the even should be added to
   * @param  {event} the event to be added
   * @param  {function} the function that will be executed
   */
  removeListener : function (el, evt, fn, bubble) {
    if ("removeEventListener" in el) {
      el.removeEventListener(evt, fn, bubble);
    }
  }

};
