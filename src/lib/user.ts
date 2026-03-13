export function isAdministrator(email?: string | null) {
  if (!email) return false;
  return email === process.env.ADMINISTRATOR_MAIL;
}
