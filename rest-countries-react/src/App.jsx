import { Routes, Route } from "react-router-dom";
import Navbar from "./components/constants/Navbar";
import CountryList from "./pages/CountryList";
import CountryDetail from "./pages/CountryDetail";
import Login from "./pages/Login";
import PrivateRoute from "./components/constants/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      {/* full-screen wrapper that carries global background + text colour */}
      <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <Navbar />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<CountryList />} />
          <Route
            path="/country/:code"
            element={
              <PrivateRoute>
                <CountryDetail />
              </PrivateRoute>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
