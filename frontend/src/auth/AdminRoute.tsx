import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react/jsx-dev-runtime";

export default function AdminRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (role !== "ADMIN") return <Navigate to="/search" replace />;

  return children;
}