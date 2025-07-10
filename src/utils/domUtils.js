export const domUtils = {
  getElementById(id) {
    return typeof window !== 'undefined' ? document.getElementById(id) : null;
  },

  setValue(id, value) {
    if (typeof window !== 'undefined' && window.$) {
      $(`#${id}`).val(value);
    }
  },

  getValue(id) {
    if (typeof window !== 'undefined' && window.$) {
      return $(`#${id}`).val();
    }
    return "";
  },

  hideElement(selector) {
    if (typeof window !== 'undefined' && window.$) {
      $(selector).hide();
    }
  },

  showElement(selector) {
    if (typeof window !== 'undefined' && window.$) {
      $(selector).show();
    }
  },

  openWindow(url) {
    if (typeof window !== 'undefined') {
      window.open(url);
    }
  },

  isWindowDefined() {
    return typeof window !== 'undefined';
  },

  isJQueryAvailable() {
    return typeof window !== 'undefined' && window.$;
  }
};