# Changes — Frontend Review & Refresh

Drop these files into your existing `chatbot-frontend/` repo. Below is exactly what
changed and why, file by file.

---

## 🐛 Bugs fixed

### 1. `src/components/Chat/ChatContainer.tsx` — `scrollIntoView` removed
**Before:**
```tsx
messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
```
**Problem:** When the chatbot is embedded as a widget on a host site, `scrollIntoView`
can scroll the **host page** instead of (or in addition to) the chat container. This is
why you'd sometimes see the host page jump when a new message arrived.

**After:**
```tsx
scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
```
Scrolls only the message container. Wrapped in `scrollToBottom()` helper in `utils/helpers.ts`.

### 2. `src/components/Chat/ChatContainer.tsx` — missing space in className
**Before:**
```tsx
className={\`px-4 pb-0 flex flex-col gap-3 mt-2${innerWidthClass}\`}
//                                              ^ no space → "mt-2max-w-4xl" => broken
```
This silently dropped the `max-w-4xl` rule in fullscreen mode. Fixed with proper spacing.

### 3. `src/components/Chat/ChatContainer.tsx` — `MAX_MESSAGES` was hardcoded
**Before:** Frontend hardcoded `10` while the backend has its own limit. Drifting them
apart silently is a footgun.
**After:** `maxMessages` initialises to `10` but is **overwritten** from `checkLimit()`'s
`max_messages` field on mount. Backend is authoritative.

### 4. `src/components/Chat/ChatInput.tsx` — invalid Tailwind class
`max-h-30` doesn't exist in Tailwind's default scale → no height cap applied.
Changed to `max-h-[120px]` (arbitrary value, real cap).

### 5. `src/api/chatbot.ts` — broken `import.meta` workaround
**Before:**
```ts
// "✅ Fixed: Remove import.meta completely"
return 'http://localhost:8000';  // hardcoded fallback
```
This bypassed the entire purpose of `.env`. **After:** Proper three-tier resolution:
1. `import.meta.env.VITE_API_URL` (build-time env)
2. Origin of the embedded widget `<script>` tag (production widget)
3. `window.location.origin` (last-resort same-origin fallback)

The widget detection regex was also tightened (matches `norman-chatbot` instead of the
brittle `chatbot/widget.js` substring).

### 6. `src/utils/helpers.ts` — `scrollToElement` removed
Exposed a helper that used `scrollIntoView` — same problem as #1. Replaced with
`scrollToBottom(container)` which uses `scrollTo({ top: scrollHeight })`.

### 7. `src/utils/helpers.ts` — markdown XSS hardening
`parseMarkdown` ran directly against raw input, so any HTML the model emitted (`<script>`,
`onerror=…`) would be injected via `dangerouslySetInnerHTML`. Added HTML-escape pre-pass.
For the limit card (which is **our own** trusted HTML), pass `{ trustHtml: true }`.

### 8. `vite.config.ts` — broken define + wrong default build
**Before:**
```ts
define: { 'import.meta': JSON.stringify({}), global: 'globalThis' },
build: { lib: { entry: 'src/widget.tsx', ... } }
```
- Defining `import.meta` to `{}` broke env access.
- Setting library build as the **default** meant `vite dev` / `vite preview` rendered nothing — `index.html` was orphaned.

**After:** Split into two configs:
- `vite.config.ts` — normal SPA build (dev, preview, standalone deploy)
- `vite.widget.config.ts` — IIFE library build for embed (`npm run build:widget`)

### 9. `package.json` — impossible versions
The lockfile listed `typescript@~6.0.2`, `vite@^8.0.10`, `eslint@^10.2.1`, `react@^19.2.5` —
versions that either don't exist yet or are unreleased prereleases. `npm install` against
these would either fail or pull bleeding-edge nightlies. Bumped down to the latest stable
real versions (TS 5.6, Vite 5.4, React 18.3, ESLint 9.13).

### 10. `src/App.css` — deleted
185 lines of leftover Vite template CSS (`.counter`, `.hero`, `#next-steps`, etc.) that
nothing in the chatbot referenced. Removed.

### 11. `tailwind.config.js` — slimmed
The safelist had **24 animation classes** to force keyframes into the build, but most were
referenced via inline `style={{ animation: '...' }}` rather than as utility classes,
making the safelist ineffective and the keyframe rules unused.

**After:** Recurring keyframes (`typing-bounce`, `dot-ping`, `fab-ring`, `shimmer`) live in
`src/index.css` once. One-off animations stay inline. Tailwind config now holds just three
animation utilities (`panel-in`, `msg-in`, `notif-in`) — the rest are dead code.

### 12. `src/components/Chat/ChatContainer.tsx` — duplicated welcome-message literals
The same two opening messages were spelled out in both `useState` initializer and
`handleResetChat`. Extracted to `buildWelcomeMessages()` so they can't drift.

### 13. `src/components/Chat/ChatContainer.tsx` — unused ref removed
`messagesContainerRef` was declared but never used. Removed.

### 14. Error-handling type narrowing
**Before:** `(error as { response?: { status?: number } })` — manual structural cast.
**After:** `axios.isAxiosError(err)` — proper type guard. Bonus: pulls
`user_messages` / `max_messages` out of the 429 body to keep the limit card accurate.

---

## 🎨 Visual refresh

The previous design had **a lot** competing for attention: header gradient shimmer,
sparkle on the button, sparkle on "new chat", typing shimmer, typing wave, hex pulses,
limit shimmer, gradient flows… all simultaneously.

The new direction keeps your chemistry identity (sage palette, hexagonal accents) but
restrains everything else.

| Aspect | Before | After |
|---|---|---|
| Type | System font stack | **DM Sans** (modern, geometric) + **JetBrains Mono** for code/keys |
| Animations | 8+ concurrent | 2 ambient (FAB float + pulse), 1 per-event (typing dots) |
| Tier badges | Colored pills with emoji | Monochrome pill with a colored dot |
| Bubbles | Hard shadows | 1px borders + minimal shadow |
| Input area | Plain textarea | Glass-on-focus, with footer hint (`Enter`/`Shift+Enter`) and char counter |
| Limit card | Heavy gradient + animations | Restrained shimmer line only |
| Quick chips | Heavy borders | Pill chips with subtle hover lift |
| Color palette | Mid-saturation sage | Slightly desaturated; new `ink` text scale (4 steps) |

Color tokens added to Tailwind:
```
sage: 50…900 (resampled, more sophisticated)
ink:  DEFAULT (#14281e), 2 (#2f5440), 3 (#6a7d6f), 4 (#9aa89e)
```

### Components touched
| File | Change |
|---|---|
| `ChatButton.tsx` | **Kept hexagonal aesthetic** (per your direction). Cleaned shadow logic; sparkle + pulse rings preserved. |
| `ChatHeader.tsx` | New molecular avatar (benzene ring), tighter type, dropped header shimmer animation |
| `ChatMessage.tsx` | Monochrome tier badge with colored dot · feedback buttons now small SVG icons |
| `TypingIndicator.tsx` | One signature animation (3 bouncing dots), tier-tinted |
| `QuickActions.tsx` | Pill chips with hover-lift; question list with translate-on-hover |
| `ChatInput.tsx` | Glass-on-focus state, keyboard-hint footer, live char counter |
| `Notification.tsx` | Icon-only variants, single animation |
| `ChatContainer.tsx` | Fullscreen mode keeps an actual backdrop now |

---

## 📦 New / removed files

```
+  vite.widget.config.ts         # separate IIFE build for embed
-  src/App.css                   # unused Vite template residue
```

---

## 🧪 How to verify locally

```bash
cd chatbot-frontend
npm install
cp .env.example .env             # point at your Django backend
npm run dev                      # standalone app on :5173
npm run build:widget             # → dist-widget/norman-chatbot.iife.js
```

To embed the widget on any page:
```html
<script src="https://your.cdn/norman-chatbot.iife.js" defer></script>
```
The widget auto-detects the backend host from its own `src` attribute (so deploy the JS
alongside Django and it just works).
