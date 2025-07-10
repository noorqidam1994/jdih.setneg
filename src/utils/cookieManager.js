import cookiee from "js-cookie";

export const cookieManager = {
  clearSearchCookies() {
    const cookieOptions = { secure: true, expires: 7, path: "/" };
    
    cookiee.set("inji_jns", "", cookieOptions);
    cookiee.set("jns_x", "", cookieOptions);
    cookiee.set("thn_x", "", cookieOptions);
    cookiee.set("stt", "", cookieOptions);
    cookiee.set("stsstt", "semua", cookieOptions);
    cookiee.set("jns_unyin", "", cookieOptions);
    cookiee.set("thn_unyin", "", cookieOptions);
    cookiee.set("totalDjenis", "", cookieOptions);
    cookiee.set("totalDtahun", "", cookieOptions);
    cookiee.set("pagex", 1, cookieOptions);
  },

  setSearchCookie(key, value) {
    const cookieOptions = { secure: true, expires: 7, path: "/" };
    cookiee.set(key, value, cookieOptions);
  },

  getCookie(key) {
    return cookiee.get(key);
  }
};