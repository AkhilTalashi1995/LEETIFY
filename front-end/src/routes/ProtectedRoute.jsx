import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import authenticate from "../utils/utils";

/**
 * ProtectedRoute component for route guarding.
 * Checks if the user is authenticated before allowing access.
 * If not authenticated, redirects to the login page.
 *
 * Usage:
 * <ProtectedRoute path="/protected" element={<ProtectedComponent />} />
 *
 * @param {object} props
 * @param {string} props.path - The path for the protected route
 * @param {JSX.Element} props.element - The component to render if authenticated
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ path, element, ...props }) => {
  // Get user data from Redux store
  const state = useSelector((state) => state.userData);

  // Check if user is authenticated (token comparison)
  const isAuthenticated = state ? authenticate(state) : false;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the route with the protected component
  return <Route path={path} element={element} {...props} />;
};

export default ProtectedRoute;
