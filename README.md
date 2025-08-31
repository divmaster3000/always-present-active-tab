# FakeActive (Chrome Extension) — keep a page “visible” and “active”

> A tiny **development/QA** Chrome extension that makes a tab look continuously **visible** and **focused** to page scripts, and emits lightweight activity events — handy for testing dashboards, demos, and idle/visibility logic.  
> **Not for bypassing site rules, anti-cheat/proctoring, streaming limits, or anything requiring real user presence. Use only where you have permission.**

---

## ✨ Features

- **Forces visibility to “on”**
    - `document.hidden` → `false`
    - `document.visibilityState` → `"visible"`
    - `Document.prototype.hasFocus()` → `true`
- **Silences lifecycle events**
    - Blocks `visibilitychange`, `blur`, and `focus` handlers (current & future listeners).
- **Synthetic “activity” drip**
    - Dispatches `mousemove`, `keydown` (document) and `focus` (window) every 60s.
- **Self-healing**
    - Re-applies overrides every 2s if page code tries to undo them.
- **One-click inject**
    - Click the toolbar icon on the target tab to inject. **Reload** to remove.

> All operations are wrapped in `try { … } catch {}` to reduce the chance of breaking the page if a partial patch fails.

---

## 🧩 How it works (high level)

Chrome content scripts run in an **isolated world**, so they cannot directly redefine page-native properties. This extension injects a `<script>` into the page’s **main world** that:

- Redefines getters for `document.hidden` and `document.visibilityState`
- Stubs `Document.prototype.hasFocus`
- Stops propagation of relevant events and blocks new listeners for them
- Emits occasional (untrusted) events for basic activity checks
- Runs a watchdog to re-assert the overrides

---
## 🛠 Installation (from source)

1. Save the files below into a folder (e.g., `fakeactive/`).
2. Open **`chrome://extensions`** in Chrome.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the `fakeactive/` folder.
5. You should see the extension appear with its toolbar icon.

---

## ▶️ Usage

1. Open the target page you want to keep “active”.
2. Click the **FakeActive** toolbar icon once.
3. Open DevTools → **Console**; you should see: [FakeActive] installed (MAIN world)
4. The tab now reports itself as visible/focused and drips simple activity.
5. **Stop/uninstall behavior:** **reload** or navigate away from the page.
---

## ⚙️ Configuration

Default intervals:
- Activity drip: **60,000 ms**
- Watchdog: **2,000 ms**

You can change these constants directly in `payload.js`.

> Note: Numeric separators like `60_000` require modern browsers. Use `60000` if targeting older versions.

---

## 🔐 Privacy

- No analytics, telemetry, or remote network requests.
- Only injects on the tab where you click the toolbar (uses `activeTab` permission).

---

## ⚠️ Limitations & caveats

- **Untrusted events:** Some apps check `event.isTrusted` and ignore synthetic events.
- **Possible site breakage:** Apps relying on `blur/focus/visibilitychange` may behave differently.
- **Iframes/service workers:** Only the top-level page (and same-origin frames if you extend logic) are affected; cross-origin iframes/service workers are not.
- **Detection:** Advanced anti-cheat/anti-automation can detect or circumvent these patches.
- **Ethics/ToS:** Use only where you have permission (dev/QA/test). Not for defeating usage or access controls.

---

## 🧪 Troubleshooting

- **“It doesn’t work”** — Click the toolbar icon **after** the page loads; check the console for the install log.
- **“App still sees visibility changes”** — Some code re-patches later or reads from another realm. Inject early; the watchdog helps.
- **“Injected twice”** — Generally harmless; reload the tab to reset everything.

---