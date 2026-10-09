/* EMSPC site glue: colour presets and the sidebar admin link.
   Plain script (no build step). Components themselves come from /assets/m3e.js. */
(function () {
    "use strict";

    var TOKEN_KEY = "emspc_t";
    var PRESET_KEY = "emspc-preset";
    var ACCENT_KEY = "emspc-accent";
    var ADMIN_LINK_KEY = "emspc-admin-link";

    // preset -> the color scheme the m3e-theme should use
    var PRESETS = {
        "default": "auto",
        "latte": "light",
        "frappe": "dark",
        "macchiato": "dark",
        "mocha": "dark"
    };

    // Catppuccin accent colours; each maps to a `--ctp-<name>` variable that the
    // Catppuccin presets define, so the accent follows the selected flavour.
    var ACCENTS = [
        "rosewater", "flamingo", "pink", "mauve", "red", "maroon", "peach",
        "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender"
    ];

    // preset -> { light, dark } surface used for the browser/status-bar theme colour
    var PRESET_COLORS = {
        "default": { light: "#f8f9ff", dark: "#0d141b" },
        "latte": { light: "#eff1f5", dark: "#eff1f5" },
        "frappe": { light: "#303446", dark: "#303446" },
        "macchiato": { light: "#24273a", dark: "#24273a" },
        "mocha": { light: "#1e1e2e", dark: "#1e1e2e" }
    };

    var theme = document.getElementById("theme");
    var metas = document.querySelectorAll('meta[name="theme-color"]');

    function read(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function write(key, value) {
        try {
            if (value == null) localStorage.removeItem(key);
            else localStorage.setItem(key, value);
        } catch (e) { /* storage blocked */ }
    }

    // ---- Colour presets ----
    function syncThemeColor(scheme, preset) {
        var colors = PRESET_COLORS[preset] || PRESET_COLORS["default"];
        metas.forEach(function (m) {
            if (!m.dataset.media) m.dataset.media = m.getAttribute("media") || "";
            if (scheme === "auto") {
                m.setAttribute("media", m.dataset.media);
                m.setAttribute("content", m.dataset.media.indexOf("dark") > -1 ? colors.dark : colors.light);
            } else {
                m.removeAttribute("media");
                m.setAttribute("content", colors[scheme] || colors.light);
            }
        });
    }

    function applyPreset(name) {
        if (!PRESETS[name]) name = "default";
        var scheme = PRESETS[name];
        if (name === "default") {
            document.documentElement.removeAttribute("data-preset");
            if (theme) theme.removeAttribute("data-preset");
        } else {
            document.documentElement.setAttribute("data-preset", name);
            if (theme) theme.setAttribute("data-preset", name);
        }
        if (scheme === "auto") document.documentElement.removeAttribute("data-scheme");
        else document.documentElement.setAttribute("data-scheme", scheme);
        if (theme) theme.setAttribute("scheme", scheme);
        syncThemeColor(scheme, name);
    }

    // ---- Accent colour (Catppuccin) ----
    // The accent only makes sense with a Catppuccin flavour, so it is applied
    // when a flavour preset is active and ignored on "default".
    var accentList = document.getElementById("accent-list");
    var accent = read(ACCENT_KEY) || ""; // "" = full palette
    if (ACCENTS.indexOf(accent) === -1) accent = "";

    function setAccentAttr(name) {
        [document.documentElement, theme].forEach(function (el) {
            if (!el) return;
            if (name) el.setAttribute("data-accent", name);
            else el.removeAttribute("data-accent");
        });
    }

    function applyAccent() {
        var flavour = (read(PRESET_KEY) || "default") !== "default";
        var active = flavour && ACCENTS.indexOf(accent) > -1 ? accent : "";
        setAccentAttr(active);
        if (accentList) {
            accentList.toggleAttribute("disabled", !flavour);
            accentList.setAttribute("aria-disabled", String(!flavour));
        }
    }

    if (accentList) {
        var accentOptions = Array.prototype.slice.call(accentList.querySelectorAll("m3e-list-option"));
        accentOptions.forEach(function (o) {
            o.selected = o.value === (accent || "full");
        });
        accentList.addEventListener("change", function () {
            var value = accentList.value;
            accent = ACCENTS.indexOf(value) > -1 ? value : "";
            write(ACCENT_KEY, accent || null);
            applyAccent();
        });
    }

    var presetList = document.getElementById("preset-list");
    if (presetList) {
        var current = read(PRESET_KEY) || "default";
        if (!PRESETS[current]) current = "default";
        var options = Array.prototype.slice.call(presetList.querySelectorAll("m3e-list-option"));
        options.forEach(function (o) {
            o.selected = o.value === current;
        });
        applyPreset(current);
        applyAccent();

        presetList.addEventListener("change", function () {
            var value = presetList.value || "default";
            applyPreset(value);
            write(PRESET_KEY, value);
            applyAccent();
        });
    } else {
        // Other pages: make sure the saved preset is applied even without the chooser.
        applyPreset(read(PRESET_KEY) || "default");
        applyAccent();
    }

    // ---- Admin portal link ----
    // The sign-in flow lives on admin.html now; here we just mirror the session
    // token it hands back (#t=...) and pin the sidebar entry from the toggle.
    var hash = location.hash.match(/t=([^&]+)/);
    if (hash) {
        try { sessionStorage.setItem(TOKEN_KEY, hash[1]); } catch (e) {}
        history.replaceState(null, "", location.pathname + location.search);
    }

    var navAdmin = document.getElementById("nav-admin");
    function showAdminLink(show) {
        if (navAdmin) navAdmin.hidden = !show;
    }

    // Access itself stays owner-only (the portal backend only issues a session
    // to active GitHub organisation owners).
    function adminLinkEnabled() { return read(ADMIN_LINK_KEY) === "1"; }
    function refreshAdmin() { showAdminLink(adminLinkEnabled()); }
    refreshAdmin();

    var adminSwitch = document.getElementById("admin-link-switch");
    if (adminSwitch) {
        adminSwitch.checked = adminLinkEnabled();
        adminSwitch.addEventListener("change", function () {
            write(ADMIN_LINK_KEY, adminSwitch.checked ? "1" : "0");
            if (adminSwitch.checked && window.M3eSnackbar) {
                window.M3eSnackbar.open("Only authorized users can access Announcements.", true);
            }
            refreshAdmin();
        });
    }
})();
