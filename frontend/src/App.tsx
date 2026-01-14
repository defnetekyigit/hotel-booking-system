import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Header from "./components/Header";

import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminRoute from "./auth/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/booking/:roomId" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/search" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;