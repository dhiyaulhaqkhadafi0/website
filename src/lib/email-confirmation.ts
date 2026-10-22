export const SIGNUP_CONFIRM_REDIRECT = "https://khadafidaffa.com/auth/confirm";
export type ConfirmationInput =
  | { kind: "token"; tokenHash: string }
  | { kind: "session"; accessToken: string }
  | { kind: "missing" | "invalid" };

export function readConfirmationInput(hash: string, search: string): ConfirmationInput {
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  const query = new URLSearchParams(search);
  const value = (key: string) => fragment.get(key) || query.get(key);
  if (value("error") || value("error_code")) return { kind: "invalid" };
  const type = value("type");
  if (type && type !== "email" && type !== "signup") return { kind: "invalid" };
  const tokenHash = value("token_hash");
  if (tokenHash && /^[A-Za-z0-9_-]{20,512}$/.test(tokenHash)) return { kind: "token", tokenHash };
  const accessToken = fragment.get("access_token");
  if (accessToken && accessToken.length <= 16384 && /^[\w-]+\.[\w-]+\.[\w-]+$/.test(accessToken)) return { kind: "session", accessToken };
  return { kind: tokenHash || accessToken || value("code") ? "invalid" : "missing" };
}

type VerifiedUser = { id: string; email_confirmed_at?: string | null };
type AuthResult = { data: { user: VerifiedUser | null }; error: unknown };
type ConfirmationAuth = {
  verifyOtp(input: { token_hash: string; type: "email" }): Promise<AuthResult>;
  getUser(token: string): Promise<AuthResult>;
};
export async function verifyEmailConfirmation(input: ConfirmationInput, auth: ConfirmationAuth) {
  if (input.kind !== "token" && input.kind !== "session") return false;
  const result = input.kind === "token"
    ? await auth.verifyOtp({ token_hash: input.tokenHash, type: "email" })
    : await auth.getUser(input.accessToken);
  return !result.error && Boolean(result.data.user?.id && result.data.user.email_confirmed_at);
}
