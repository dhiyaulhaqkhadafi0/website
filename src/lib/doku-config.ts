// Pure configuration policy, shared by server code and isolated tests.
export type DokuEnvironment = "sandbox" | "production";
type Env = Record<string, string | undefined>;
export function dokuPolicy(env: Env) {
  const production = env.DOKU_IS_PRODUCTION === "true";
  const environment: DokuEnvironment = production ? "production" : "sandbox";
  const origin = env.DOKU_SITE_ORIGIN || "";
  const database = env.NEXT_PUBLIC_SUPABASE_URL || "";
  const loopback = ["http://127.0.0.1:54321", "http://localhost:54321"].includes(database);
  let validOrigin = false;
  try {
    const url = new URL(origin);
    validOrigin = url.protocol === "https:" && url.origin === origin && !url.username && !url.password;
  } catch { /* Fail closed. */ }
  const safeDatabase = production
    ? database === "https://mykgtajanxczdnzekycl.supabase.co"
    : loopback || (Boolean(env.DOKU_SANDBOX_SUPABASE_URL) && database === env.DOKU_SANDBOX_SUPABASE_URL &&
      /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(database) && !/mykgtajanxczdnzekycl|zhxqjmciowxozrohutoi/.test(database));
  const configured = Boolean(env.DOKU_CLIENT_ID && env.DOKU_SECRET_KEY) && safeDatabase && validOrigin &&
    (env.DOKU_LOCAL_STAGING_ONLY !== "true" || (!production && loopback)) &&
    (production ? env.DOKU_PRODUCTION_APPROVED === "true" && origin === "https://khadafidaffa.com"
      : origin !== "https://khadafidaffa.com");
  const checkout = configured && env.DOKU_ENABLED === "true" && env.PAYMENTS_ENABLED === "true" &&
    (!production || env.DOKU_PUBLIC_SALES_APPROVED === "true");
  const qris = env.DOKU_QRIS_ENABLED === "true" && (!production || env.DOKU_QRIS_STATUS === "ACTIVE");
  const qaCheckout = configured && qris && env.DOKU_QA_ENABLED === "true" &&
    (!production || env.DOKU_QA_LIVE_APPROVED === "true");
  return { environment, production, configured, checkout, qaCheckout, qris,
    // Omit the public production filter so DOKU selects active, eligible methods.
    // Preserve the explicit QRIS kill switch and isolated sandbox restrictions.
    methods: production && qris ? null : qris ? ["VIRTUAL_ACCOUNT_BANK_MANDIRI", "QRIS"] : ["VIRTUAL_ACCOUNT_BANK_MANDIRI"] };
}
