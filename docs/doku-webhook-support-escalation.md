# DOKU Sandbox — Missing HTTP Notification escalation (2026-10-19)

## Confirmed
- DOKU Sandbox checkout Mandiri VA Rp59,000 through official simulator completed and Checkout Orders showed **Lunas**.
- Real signed `GET /orders/v1/status/{invoice}` verified **SUCCESS**, **59000**, `VIRTUAL_ACCOUNT_BANK_MANDIRI`.
- Dedicated HTTPS notification endpoint was set on Sandbox Mandiri VA and supplied through `additional_info.override_notification_url` on a later checkout.
- Unsigned public POST reached Node behind Cloudflare Tunnel and was rejected **401**, demonstrating route accessibility.
- **No actual signed DOKU webhook arrived** after successful Sandbox simulation in logged Node process. Back Office HTTP Notification Center showed no entry for paid invoice.
- Zero-cost CI: offline security tests and disposable local Supabase/real Next.js private PDF tests **PASS**. These do NOT establish actual DOKU notification delivery.

## Support ticket prepared, not submitted
A draft email was created in user's connected Gmail addressed to **care@doku.com**, subject `[Sandbox] Mandiri VA SUCCESS namun HTTP Notification tidak tercatat — Khadafi Studio`. User must review/send it explicitly. The support draft includes a paid Sandbox invoice, merchant Sandbox Client ID, webhook URL, timestamp, signature-verified Check Status result, and asks for outbound notification logs, retry HTTP status, provider configuration and resend availability. Neither secret key nor bank details are included.

Official DOKU support email / ticket:
- https://www.doku.com/customer-support
- https://help.doku.com/en/support/tickets/new

## Next action
1. User reviews and sends support draft (or creates DOKU support ticket), with screenshots if needed. Do not publish test invoice/merchant details in public GitHub.
2. DOKU identifies whether outbound notification was generated, to which URL, delivery HTTP response and if Retry is possible. Avoid more simulated payments pending their diagnosis.
3. When a real signed notification can be observed, test its authenticated delivery and idempotent order settlement to **isolated staging** only. All local/server CI/private PDF tests remain separate.
4. Until then, **do not merge draft PR #4, change production Cloudflare worker, connect live Supabase (Khadafi Web / Chikki), turn on DOKU production, or grant actual ebook access**.

## Isolation
- GitHub docs intentionally omit full invoice, merchant ID and Sandbox secrets.
- Support email is not sent from GitHub and cannot expose any secrets through CI.
- Stop unused local listener and dedicated public test tunnel when not actively debugging.
