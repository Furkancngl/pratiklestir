export const ADMIN_EMAIL = "cangulfurkan@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}
