export const ADMIN_EMAILS = ["cangulfurkan@gmail.com", "mehmetemin2403@gmail.com"];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
