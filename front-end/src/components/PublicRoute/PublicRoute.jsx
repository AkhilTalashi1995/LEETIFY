import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ element }) {
  const state = useSelector((state) => state.userData);
  const isAuthenticated = !!(state && state.token);
  // If logged in, go to home
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }
  // If not logged in, allow rendering
  return element;
}

export default PublicRoute;
