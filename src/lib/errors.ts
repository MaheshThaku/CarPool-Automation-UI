/**
 * Shared helper for turning a failed API response into a message that's
 * actually useful to the user.
 *
 * The backend currently returns 403 (instead of a 5xx) for rider/passenger
 * endpoints when the signed-in account is missing its rider/passenger
 * profile row server-side — a server-side data issue, not something the
 * user did wrong. Retrying the same action will never succeed, so we say
 * that explicitly instead of "please try again."
 */
export function describeApiError(
  status: number | undefined,
  backendMessage: string | undefined
): string {
  if (status === 403) {
    return "This action isn't available yet because your account setup is incomplete on the server. Retrying won't help — please contact support so they can finish provisioning your account.";
  }
  return backendMessage ?? "Something went wrong.";
}
