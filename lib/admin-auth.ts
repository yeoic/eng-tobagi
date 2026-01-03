import { cookies, headers } from "next/headers";

const ADMIN_KEY = process.env.ADMIN_KEY;

/**
 * Validates admin access using either:
 * 1. Query parameter: ?admin_key=xxx
 * 2. Header: X-Admin-Key: xxx
 * 3. Cookie: admin_key=xxx
 *
 * Returns true if ADMIN_KEY is not set (no protection) or if the key matches.
 */
export async function validateAdminAccess(): Promise<boolean> {
  // If no ADMIN_KEY is set, allow all access (development mode)
  if (!ADMIN_KEY) {
    return true;
  }

  // Check header
  const headersList = await headers();
  const headerKey = headersList.get("x-admin-key");
  if (headerKey === ADMIN_KEY) {
    return true;
  }

  // Check cookie
  const cookieStore = await cookies();
  const cookieKey = cookieStore.get("admin_key")?.value;
  if (cookieKey === ADMIN_KEY) {
    return true;
  }

  return false;
}

/**
 * Validates admin key from request (for API routes)
 */
export function validateAdminKeyFromRequest(request: Request): boolean {
  if (!ADMIN_KEY) {
    return true;
  }

  // Check header
  const headerKey = request.headers.get("x-admin-key");
  if (headerKey === ADMIN_KEY) {
    return true;
  }

  // Check URL query parameter
  const url = new URL(request.url);
  const queryKey = url.searchParams.get("admin_key");
  if (queryKey === ADMIN_KEY) {
    return true;
  }

  return false;
}
