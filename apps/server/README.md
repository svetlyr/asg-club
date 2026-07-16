# ASG Club server

Bun.serve API + Grammy Telegram bot + Drizzle/SQLite (`bun:sqlite`). Three dependencies total: `drizzle-orm`, `grammy`, `valibot`.

## Order pipeline

```
POST /orders
  └─ email to owner via Resend (always, photos attached)
  └─ Custom Merch → status "manual", owner handles it by hand. Stop.
  └─ otherwise, sequential pricing — one person at a time:
       [designer]  → if needsDesign, or product is Custom Design (terminal)
       [production] → printer or factory, per product (src/config.ts)
       [owner]     → sets markup → PayPal invoice sent to the customer
  └─ PayPal webhook INVOICING.INVOICE.PAID → status "paid",
     Telegram "start work" ping to everyone involved
```

Specialists interact through inline buttons; prices are collected via
`force_reply` (reply-to-message correlation — stateless, survives restarts).
Reference photos are sent as **documents** (full quality) and re-forwarded
between stages by Telegram `file_id`.

## API

### `POST /orders` — multipart/form-data

| Field         | Type          | Notes                                             |
| ------------- | ------------- | ------------------------------------------------- |
| `firstName`   | string        | required, 1–100 chars                             |
| `lastName`    | string        | required, 1–100 chars                             |
| `email`       | string        | required, valid email                             |
| `tel`         | string        | optional                                          |
| `product`     | string        | required — `design` \| `stickers` \| `pins` \| `posters` \| `tshirts` \| `mugs` \| `keychains` \| `badges` \| `merch` (ids from `apps/frontend/src/data/site.ts`) |
| `needsDesign` | string        | optional checkbox — `"on"`/`"true"` enables the design stage |
| `description` | string        | required, 10–5000 chars                           |
| `website`     | string        | **honeypot** — render hidden, must stay empty     |
| `images`      | File[]        | optional, ≤10 files, ≤10 MB each, jpg/png/webp    |

Responses: `200 {ok, orderId}` · `422` validation · `429` rate limit (5 req / 10 min per IP).

### `POST /paypal/webhook`

PayPal webhook endpoint (signature-verified). Subscribe the webhook to
`INVOICING.INVOICE.PAID` and point it at `https://<public-url>/paypal/webhook`.

## Database

SQLite via `bun:sqlite` (WAL mode). The file lives at `DATABASE_PATH`
(default `./orders.db`); migrations from `drizzle/` apply automatically on
boot. Backup = copy the file.

```bash
bun run dev                # watch mode on :3000
bun drizzle-kit generate   # regenerate migrations after schema changes
bun drizzle-kit studio     # inspect the database
```

## Environment

See `.env.example`. Needs: Telegram bot token + 4 chat ids, Resend API key
(`MAIL_FROM` on a verified domain), PayPal REST app (sandbox or live) with a
webhook id. HTTPS/HTTP2 termination belongs to the reverse proxy in front
(Caddy/nginx/Cloudflare) — required for the PayPal webhook anyway.
