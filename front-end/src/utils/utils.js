/**
 * Checks if the provided JWT token matches the one stored in localStorage.
 * Used for simple client-side authentication checks.
 *
 * @param {string} params - The JWT token to validate
 * @returns {boolean} True if tokens match, false otherwise
 *
 * Note: This does not verify the token's validity or expiration,
 * just strict equality with the locally stored token.
 */
const authenticate = (params) => {
  const userToken = localStorage.getItem("jwtToken");
  // Compare provided token with the one in localStorage
  if (params === userToken) return true;
  return false;
};

export default authenticate;
