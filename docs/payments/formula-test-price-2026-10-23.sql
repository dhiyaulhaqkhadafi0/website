-- Explicit owner request: temporary public Rp1,000 production test price.
-- Pricing data only: preserve existing orders, entitlements and product files.
begin;
update public.commerce_products
set price=1000
where slug='ebook-formula-profitable-blueprint'
  and price=59000 and currency='IDR' and status='published'
  and not is_payment_qa;
commit;

-- Do NOT restore until the owner confirms the real-money test succeeded.
-- Approved restoration later: use the same slug/status/currency/QA predicates,
-- change price back to 59000, and require the previous price to equal 1000.
