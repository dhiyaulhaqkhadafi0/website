# Local-only, transactional DOKU commerce smoke test.
# All synthetic inserts occur in BEGIN ... ROLLBACK; nothing persists.
# This NEVER connects to Supabase Cloud or executes production migrations.
param(
  [string]$Container = "supabase_db_khadafi-doku-staging-db"
)
$ErrorActionPreference = "Stop"
if ($Container -ne "supabase_db_khadafi-doku-staging-db") {
  throw "Refusing to test another database container."
}
$running = docker inspect --format '{{.State.Running}}' $Container 2>$null
if ($LASTEXITCODE -ne 0 -or $running -ne "true") {
  throw "Khadafi local PostgreSQL container is not running."
}
$sql = @'
\set ON_ERROR_STOP on
BEGIN;
DO $$
DECLARE
  v_user uuid := gen_random_uuid();
  v_product uuid := gen_random_uuid();
  v_key uuid := gen_random_uuid();
  v_order public.commerce_orders;
  v_again public.commerce_orders;
  v_entitlements integer;
BEGIN
  IF to_regclass('public.commerce_products') IS NULL
    OR to_regclass('public.commerce_orders') IS NULL
    OR to_regclass('public.commerce_entitlements') IS NULL
    OR to_regclass('public.commerce_guest_limits') IS NULL
    OR to_regprocedure('public.commerce_create_order_doku(uuid,uuid,text,text,uuid)') IS NULL
    OR to_regprocedure('public.commerce_set_payment_doku(uuid,integer,text)') IS NULL
  THEN
    RAISE EXCEPTION 'Commerce schema incomplete';
  END IF;

  IF has_function_privilege('anon',
       'public.commerce_set_payment_doku(uuid,integer,text)', 'EXECUTE')
    OR has_function_privilege('authenticated',
       'public.commerce_set_payment_doku(uuid,integer,text)', 'EXECUTE')
  THEN
    RAISE EXCEPTION 'Payment RPC is improperly exposed';
  END IF;

  INSERT INTO auth.users (id, instance_id, aud, role, email,
    encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (v_user, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'doku-local-' || replace(v_user::text,'-','') || '@example.invalid',
    '', now(), now(), now());

  INSERT INTO public.commerce_products(id, name, slug, price, status)
  VALUES(v_product, 'LOCAL TEST Ebook Rp59000',
    'doku-local-' || replace(v_product::text,'-',''), 59000, 'draft');
  INSERT INTO public.commerce_product_files(product_id, storage_path, name)
  VALUES(v_product, 'local-test/' || v_product::text || '.pdf', 'dummy.pdf');
  UPDATE public.commerce_products SET status='published' WHERE id=v_product;

  SELECT * INTO v_order FROM public.commerce_create_order_doku(
    v_user, v_product, 'Local Test Buyer', 'local@example.invalid', v_key
  );
  IF v_order.id IS NULL OR v_order.status <> 'pending'
     OR v_order.provider <> 'doku' OR v_order.total <> 59000
  THEN
    RAISE EXCEPTION 'Unexpected pending DOKU order';
  END IF;

  IF EXISTS(SELECT 1 FROM public.commerce_entitlements
    WHERE order_id=v_order.id) THEN
    RAISE EXCEPTION 'Access granted BEFORE payment';
  END IF;

  SELECT * INTO v_again FROM public.commerce_create_order_doku(
    v_user, v_product, 'Local Test Buyer', 'local@example.invalid', v_key
  );
  IF v_again.id IS DISTINCT FROM v_order.id THEN
    RAISE EXCEPTION 'Idempotent checkout created a second order';
  END IF;

  PERFORM public.commerce_claim_doku_checkout(v_order.id, 'sandbox', 'KSTESTLOCAL001');
  PERFORM public.commerce_set_payment_doku(v_order.id, 59000, 'KSTESTLOCAL001');
  PERFORM public.commerce_set_payment_doku(v_order.id, 59000, 'KSTESTLOCAL001');

  IF NOT EXISTS(SELECT 1 FROM public.commerce_orders
    WHERE id=v_order.id AND status='paid'
      AND payment_reference='KSTESTLOCAL001') THEN
    RAISE EXCEPTION 'Payment did not mark order as paid';
  END IF;

  SELECT count(*) INTO v_entitlements FROM public.commerce_entitlements
  WHERE order_id=v_order.id AND user_id=v_user
    AND resource_id=v_product AND status='active';
  IF v_entitlements <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one entitlement, found %', v_entitlements;
  END IF;

  RAISE NOTICE 'PASS: pending checkout, amount Rp59000, no early entitlement, idempotent order, paid transition, one entitlement';
END $$;
ROLLBACK;
SELECT 'PASS: all synthetic test data rolled back' AS result;
'@
Write-Host "Running LOCAL database smoke test; synthetic data will ROLLBACK..." -ForegroundColor Cyan
$sql | docker exec -i $Container psql -U postgres -d postgres -X -v ON_ERROR_STOP=1 -P pager=off
if ($LASTEXITCODE -ne 0) {
  throw "Local DOKU SQL smoke test failed. No changes committed; SQL connection rolled back."
}
Write-Host "SUCCESS: local transaction checks passed; no test records were persisted." -ForegroundColor Green
