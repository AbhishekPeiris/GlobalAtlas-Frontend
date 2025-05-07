import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../assets";
import StarGlowEffect from "../components/StarGlowEffect";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setMessage("");
      // Update the function call
      await requestPasswordReset(email);
      setMessage("Password reset link has been sent to your email");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StarGlowEffect />
      <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute rounded-full -top-24 -right-24 w-96 h-96 bg-primary/10 blur-3xl opacity-70"></div>
            <div className="absolute rounded-full -bottom-32 -left-32 w-96 h-96 bg-primary/10 blur-3xl opacity-70"></div>
          </div>

          {/* Card with glass morphism */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-2xl blur-xl"></div>
            <div className="relative p-8 border shadow-xl backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 rounded-2xl border-white/20 dark:border-slate-700/30">
              {/* Logo and header */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 p-3 mx-auto mb-4 rounded-full bg-primary/10">
                  {Logo ? (
                    <img src={Logo} alt="Logo" className="w-full h-full" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Reset Password
                </h2>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  Enter your email to receive a password reset link
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start p-3 mb-4 text-sm text-red-600 border border-red-100 rounded-xl bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 mt-0.5 flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}

              {/* Success message */}
              {message && (
                <div className="flex items-start p-3 mb-4 text-sm text-green-600 border border-green-100 rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/20 dark:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 mt-0.5 flex-shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-400 dark:text-slate-500"
                      >
                        <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path>
                        <polyline points="15,9 10,13 5,9"></polyline>
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
                      isLoading
                        ? "opacity-80 cursor-not-allowed"
                        : "hover:translate-y-[-1px]"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>Send Reset Link</>
                    )}
                  </button>
                </div>
              </form>

              <div className="flex justify-center mt-6">
                <Link
                  to="/login"
                  className="flex items-center text-sm transition-colors text-primary hover:text-primary/80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1.5"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
