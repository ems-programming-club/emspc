(function () {
  "use strict";

  var logins = ["harpySDX", "MirzaAyBaig12", "wangdonnie8", "pigeonwithminigun", "deathstarowen-star"];
  var gravatarCache = {};

  function md5(str) {
    // simple md5 impl for hex string
    function hex(x) {
      for (var i = 0; i < x.length; i++) {
        x[i] = "0123456789abcdef".charAt((x[i] >> 4) & 0xf) + "0123456789abcdef".charAt(x[i] & 0xf);
      }
    }
    function cmn(q, a, b, x, s, t) {
      a = ((a + q + x + t) | 0);
      return (((a << s) | (a >>> (32 - s))) + b) | 0;
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function str2binl(str) {
      var nblk = ((str.length + 8) >> 6) + 1;
      var blks = new Array(nblk * 16).fill(0);
      for (var i = 0; i < str.length; i++) {
        blks[i >> 2] |= (str.charCodeAt(i) & 0xff) << ((i % 4) * 8);
      }
      blks[(str.length >> 2)] |= 0x80 << ((str.length % 4) * 8);
      blks[nblk * 16 - 2] = str.length * 8;
      return blks;
    }
    var x = str2binl((str || "").trim().toLowerCase());
    var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
      var olda = a, oldb = b, oldc = c, oldd = d;
      a = ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = ff(c, d, a, b, x[i + 10], 17, -42063);
      b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = hh(a, b, c, d, x[i + 5], 4, -378558);
      d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = (a + olda) | 0; b = (b + oldb) | 0; c = (c + oldc) | 0; d = (d + oldd) | 0;
    }
    var hexStr = "";
    for (var i = 0; i < 4; i++) {
      var v = [a, b, c, d][i];
      for (var j = 0; j < 4; j++) {
        hexStr += "0123456789abcdef".charAt((v >> ((j * 8) + 4)) & 0xf) + "0123456789abcdef".charAt((v >> (j * 8)) & 0xf);
      }
    }
    return hexStr;
  }

  function gravatarUrl(email) {
    if (!email) return null;
    var h = md5(email.trim().toLowerCase());
    return "https://gravatar.com/avatar/" + h + "?s=200&d=404";
  }

  async function getGravatar(email) {
    if (!email) return null;
    if (gravatarCache[email] !== undefined) return gravatarCache[email];
    try {
      var url = gravatarUrl(email);
      var r = await fetch(url, { method: "HEAD" });
      gravatarCache[email] = r.ok ? url : null;
      return gravatarCache[email];
    } catch (e) {
      gravatarCache[email] = null;
      return null;
    }
  }

  async function fetchUser(login) {
    try {
      var r = await fetch("https://api.github.com/users/" + login);
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      return null;
    }
  }

  async function load() {
    for (var i = 0; i < logins.length; i++) {
      var login = logins[i];
      var el = document.getElementById("av-" + login);
      if (!el) continue;
      var ghUrl = null;
      var user = await fetchUser(login);
      if (user) {
        ghUrl = user.avatar_url;
        if (user.email) {
          var g = await getGravatar(user.email);
          if (g) { el.setAttribute("image", g); continue; }
        }
      }
      if (ghUrl) el.setAttribute("image", ghUrl);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();