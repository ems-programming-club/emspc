(function () {
  "use strict";

  var container = document.getElementById("members-list");
  if (!container) return;

  var cacheKey = "emspc-members-cache";
  var cacheTsKey = "emspc-members-cache-ts";
  var ttl = 1000 * 60 * 30; // 30 min

  function render(items) {
    container.innerHTML = "";
    items.forEach(function (u) {
      var a = document.createElement("a");
      a.className = "member";
      a.href = u.html_url;
      a.target = "_blank";
      a.rel = "noopener";

      var av = document.createElement("m3e-avatar");
      av.setAttribute("image", u.avatar_url);

      var text = document.createElement("span");
      text.className = "member-text";

      var name = document.createElement("span");
      name.className = "member-name";
      name.textContent = u.name || u.login;

      var handle = document.createElement("span");
      handle.className = "member-handle";
      handle.textContent = u.login;

      text.appendChild(name);
      text.appendChild(handle);

      var icon = document.createElement("m3e-icon");
      icon.setAttribute("name", "open_in_new");
      icon.className = "member-go";

      a.appendChild(av);
      a.appendChild(text);
      a.appendChild(icon);
      container.appendChild(a);
    });
  }

  function loadFromCache() {
    try {
      var ts = parseInt(localStorage.getItem(cacheTsKey), 10);
      if (isNaN(ts) || Date.now() - ts > ttl) return null;
      var data = JSON.parse(localStorage.getItem(cacheKey) || "[]");
      if (Array.isArray(data) && data.length) return data;
    } catch (e) {}
    return null;
  }

  function saveToCache(data) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTsKey, String(Date.now()));
    } catch (e) {}
  }

  async function fetchUserDetails(logins) {
    var out = [];
    for (var i = 0; i < logins.length; i++) {
      try {
        var r = await fetch("https://api.github.com/users/" + logins[i]);
        if (r.ok) {
          out.push(await r.json());
        }
      } catch (e) {}
    }
    return out;
  }

  function dedupe(items) {
    var seen = {};
    var res = [];
    for (var i = 0; i < items.length; i++) {
      var l = items[i].login;
      if (seen[l]) continue;
      seen[l] = true;
      res.push(items[i]);
    }
    return res;
  }

  async function load() {
    var cached = loadFromCache();
    if (cached) render(cached);

    try {
      var res = await fetch("https://api.github.com/repos/ems-programming-club/emspc/contributors?per_page=100");
      if (!res.ok) return;
      var contribs = await res.json();
      if (!Array.isArray(contribs) || contribs.length === 0) return;
      var logins = contribs.map(function (c) { return c.login; }).filter(Boolean);
      var details = await fetchUserDetails(logins);
      var merged = dedupe(details);
      var botRe = /(\[bot\]|-bot|^claude$|^dependabot|^github-actions|^renovate|^ems-programming)/i;
      var filtered = merged.filter(function (u) {
        if (u.type === "Bot") return false;
        if (botRe.test(u.login)) return false;
        return true;
      });
      saveToCache(filtered);
      render(filtered);
    } catch (e) {}
  }

  load();
})();