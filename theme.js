// theme.js (shared for Academic Planning Simulator)
// Goal: dark mode works on ALL pages, even when app.js also wires a theme toggle.
//
// Key fix: we intercept theme switch events in CAPTURE phase and stop propagation,
// so app.js (or any other script) can't double-toggle the theme.

(function () {
  "use strict";

  const KEY = "smartschedule_theme";
  const LEGACY_KEYS = ["aps_theme"];
  const root = document.documentElement;

  function normalizeTheme(v) {
    return v === "light" ? "light" : "dark";
  }

  function readStoredTheme() {
    try {
      const v = localStorage.getItem(KEY);
      if (v) return normalizeTheme(v);

      for (const k of LEGACY_KEYS) {
        const legacy = localStorage.getItem(k);
        if (legacy) return normalizeTheme(legacy);
      }
    } catch (_) {}
    return "dark";
  }

  function saveTheme(t) {
    const theme = normalizeTheme(t);
    try {
      localStorage.setItem(KEY, theme);
      for (const k of LEGACY_KEYS) localStorage.setItem(k, theme);
    } catch (_) {}
  }

  function syncSwitchUI(theme) {
    const els = document.querySelectorAll("#themeSwitch, [data-theme-switch]");
    els.forEach((el) => {
      el.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
      if (el instanceof HTMLInputElement && el.type === "checkbox") {
        el.checked = theme === "dark";
      }
    });
  }

  function applyTheme(t) {
    const theme = normalizeTheme(t);

    // IMPORTANT: keep compatibility with app.js behavior:
    // - dark => data-theme="dark"
    // - light => remove the attribute (not data-theme="light")
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");

    syncSwitchUI(theme);
  }

  function toggleTheme() {
    const cur = readStoredTheme();
    const next = cur === "dark" ? "light" : "dark";
    saveTheme(next);
    applyTheme(next);
  }

  // Apply ASAP to avoid flash
  applyTheme(readStoredTheme());

  // --------------- Event interception (CAPTURE) ---------------
  // This prevents app.js from also toggling on the same click.
  function isThemeTarget(evtTarget) {
    return !!(evtTarget && evtTarget.closest && evtTarget.closest("#themeSwitch, [data-theme-switch]"));
  }

  document.addEventListener(
    "click",
    (e) => {
      if (!isThemeTarget(e.target)) return;
      e.preventDefault();
      e.stopPropagation(); // stop before reaching #themeSwitch listeners (app.js)
      toggleTheme();
    },
    true // capture
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (!isThemeTarget(e.target)) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation(); // stop before reaching #themeSwitch listeners (app.js)
      toggleTheme();
    },
    true // capture
  );

  // Sync if changed in another tab/window
  window.addEventListener("storage", (e) => {
    if (!e) return;
    if (e.key !== KEY && !LEGACY_KEYS.includes(e.key)) return;
    applyTheme(readStoredTheme());
  });

  // One more sync after DOM is ready (helps if switch markup loads late)
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(readStoredTheme());
  });
})();
