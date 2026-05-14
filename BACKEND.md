# Backend Contract

The frontend talks to **four endpoints** on the Django backend. This document describes
exactly what each one must accept and return, plus the cross-cutting concerns
(sessions, CORS, CSRF, rate limit, security).

If your backend already implements all of this, **no changes are required**. If anything
below doesn't match, that's the work.

---

## Cross-cutting requirements

### 1. CORS
The widget runs on whatever site embeds it — possibly a different origin from Django.
The frontend sends `withCredentials: true` (cookies for the session), so:

- `CORS_ALLOW_CREDENTIALS = True`
- `CORS_ALLOWED_ORIGINS` must enumerate the host pages (no wildcard with credentials).
- Preflight `OPTIONS` must respond `200` with the matching origin echoed back.

### 2. CSRF
The frontend reads `csrftoken` from cookies and forwards it as `X-CSRFToken` on every
non-GET request. Therefore:

- Use Django's standard `CsrfViewMiddleware`.
- Set the CSRF cookie on first GET — `@ensure_csrf_cookie` on `GET /api/chatbot/message/?action=get_categories` is the cleanest spot.
- `CSRF_TRUSTED_ORIGINS` must include each host page origin.

### 3. Session
The 10-message limit is per Django session. Make sure `SESSION_COOKIE_SAMESITE='None'`
and `SESSION_COOKIE_SECURE=True` for cross-origin embed; otherwise the session cookie
won't be sent.

### 4. Server-side rate limit
The frontend will trust a **429** response and switch into "session complete" mode.
Implement the limit on the server too — the client check is for UX only.

---

## Endpoint 1 · `POST /api/chatbot/message/`

Send a user message; receive a tiered answer.

### Request body
```json
{
  "message": "How many PFAS compounds?",
  "skip_tier": 0,
  "is_faq_button": false
}
```
- `message` *(string, required)* — ≤ 1000 chars (enforce server-side too).
- `skip_tier` *(int, optional, default `0`)* — when the user clicks 👎 and the tier
  allows retry, the frontend resends the same query with this set to the failing tier.
  Skip = "don't reuse this tier".
- `is_faq_button` *(bool, optional)* — true when the user clicked an FAQ chip rather
  than typing. Useful for analytics; can short-circuit straight to a cached answer.

### Successful response (200)
```json
{
  "response": "There are **14,917** PFAS compounds…",
  "type": "sql",
  "tier": 3,
  "tier_name": "Chemical Database",
  "similarity": 0.81,
  "confidence": 0.92,
  "sources": [
    { "source": "norman-pfas-2024.pdf", "page": 12, "similarity": 0.78, "pdf_path": "/media/docs/norman-pfas-2024.pdf" }
  ],
  "can_retry": true,
  "next_tier": "AI Assistant",
  "tier_attempts": [
    { "tier": 1, "tier_name": "FAQ",            "status": "not_found", "message": "No FAQ match",        "icon": "✕" },
    { "tier": 2, "tier_name": "RAG",            "status": "not_found", "message": "Low confidence",     "icon": "✕" },
    { "tier": 3, "tier_name": "Chemical DB",    "status": "success",   "message": "Query executed",      "icon": "✓" }
  ],
  "timing": {
    "faq_ms": 18, "rag_search_ms": 220, "rag_generation_ms": 0, "rag_total_ms": 220,
    "sql_generation_ms": 420, "sql_execution_ms": 110, "sql_total_ms": 530,
    "llm_ms": 0,
    "total_ms": 768
  },
  "cost": {
    "llm": 0, "sql_generation": 0.0012, "sql_formatting": 0.0008,
    "total": 0.002
  },
  "timestamp": "2026-05-13T14:32:11Z"
}
```

**Required fields:** `response`, `type`, `tier`, `tier_name`, `can_retry`, `timing.total_ms`, `cost.total`, `timestamp`.
**Optional fields:** everything else — frontend handles missing values gracefully.

### Tier-name conventions
- For follow-up questions resolved from the same tier, suffix with ` (Follow-up)` —
  the frontend renders an "↩" indicator.
- For errors: set `tier_name: "Error"` so the frontend hides the tier badge.

### Session-limit response (429)
```json
{
  "error": "session_limit_reached",
  "message": "You have used 10 of 10 messages for this session.",
  "user_messages": 10,
  "max_messages": 10,
  "action": "reset_required"
}
```
The frontend reads `user_messages` and `max_messages` to populate the "Session complete"
card. The response body matches the `SessionLimitResponse` type in `types/chatbot.ts`.

### Error response (4xx / 5xx)
Any non-2xx, non-429 → the frontend shows a generic "ran into a problem" message.
You don't need a particular schema, but **don't** return HTML (e.g. Django's default error
page) — return JSON so the axios error path is clean.

---

## Endpoint 2 · `GET /api/chatbot/message/?action=get_categories`

Fetch FAQ taxonomy.

### Response (200)
```json
{
  "categories": [
    { "name": "database", "display_name": "Database",      "icon": "🗄️", "count": 5 },
    { "name": "pfas",     "display_name": "PFAS",          "icon": "⚗️", "count": 7 },
    { "name": "search",   "display_name": "Search Tips",   "icon": "🔍", "count": 4 }
  ],
  "faq_data": {
    "database": [
      { "q": "How many compounds are in the database?", "a": "Currently 214,802 across all categories.", "category": "database" }
    ],
    "pfas": [
      { "q": "What are PFAS substances?", "a": "Per- and polyfluoroalkyl substances…", "category": "pfas" }
    ]
  }
}
```

**Notes:**
- `icon` is rendered as-is (emoji is fine — it gets a slightly larger leading-tight render in chips).
- `faq_data[name]` is the list of questions shown when a category is selected. The
  frontend currently sends `{ message: faq.q, is_faq_button: true }` rather than
  rendering `faq.a` directly, so the backend always gets to respond fresh.

---

## Endpoint 3 · `GET /api/chatbot/message/?action=check_limit`

Read the current session's usage. Called once on mount and after any 429.

### Response (200)
```json
{
  "user_messages": 4,
  "max_messages": 10,
  "limit_reached": false
}
```

- `user_messages` — count of messages **this user has sent** (excludes welcome / bot replies).
- `max_messages` — the hard cap. **The frontend reads this and uses it as the
  authoritative value** (you can raise the limit server-side without re-deploying frontend).
- `limit_reached` — convenience flag: `user_messages >= max_messages`.

---

## Endpoint 4 · `POST /api/chatbot/reset/`

Clear the session's message history and counter.

### Request body
Empty (or `{}`).

### Response (200)
```json
{
  "message": "Session reset",
  "user_message_count": 0
}
```

---

## Endpoint 5 · `POST /api/chatbot/feedback/`

Record 👍 / 👎 on a bot reply.

### Request body
```json
{
  "helpful": false,
  "tier": 3,
  "tier_name": "Chemical Database",
  "type": "sql"
}
```

### Response (200)
The frontend ignores the body. `{ "ok": true }` is fine.

**Note on retry:** When `helpful: false` is submitted AND the original answer had
`can_retry: true`, the frontend automatically calls `/api/chatbot/message/` again with
`skip_tier` set to the failing tier. Your feedback endpoint doesn't need to do anything
about this — it's purely a client-side flow — but you may want to log the eventual
retry for analytics.

---

## What you may need to add to the backend

✅ = already implemented in your codebase (or trivial), ⚠️ = check this, 🆕 = likely needs work.

| | Item |
|---|---|
| ⚠️ | `max_messages` field in `/check_limit` response (frontend now reads it — defaults to 10 if missing) |
| ⚠️ | `user_messages` + `max_messages` in 429 body (used to render the "X of Y" line) |
| ⚠️ | CORS + CSRF for the host page origin(s) you're embedding on |
| ⚠️ | `SESSION_COOKIE_SAMESITE='None'` + `SECURE=True` if embedded cross-origin |
| 🆕 | Make sure all error paths return JSON, not Django's HTML 500 page |
| 🆕 | Server-side rate-limit enforcement returning **429 with the schema above** |
| 🆕 | `tier_name` follow-up convention: append ` (Follow-up)` for chained replies |

That's the entire surface. If you'd like a sample Django `urls.py` + view skeleton
matching the schema above, ask and I'll generate one.
