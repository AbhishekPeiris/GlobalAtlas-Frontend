import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import StarGlowEffect from "../components/StarGlowEffect";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (e) {
      setError(e.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StarGlowEffect />
      <div className="flex items-center justify-center min-h-screen px-4 py-36 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute rounded-full -top-24 -right-24 w-96 h-96 bg-primary/10 blur-3xl opacity-70"></div>
            <div className="absolute rounded-full -bottom-32 -left-32 w-96 h-96 bg-primary/10 blur-3xl opacity-70"></div>
          </div>

          {/* Login card with glass morphism */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-2xl blur-xl"></div>
            <div className="relative p-8 border shadow-xl backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 rounded-2xl border-white/20 dark:border-slate-700/30 sm:p-10">
              {/* Login header */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="relative z-10 w-9 h-9"
                  />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome to Global<span className="text-primary">Atlas</span>
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Sign in to explore countries around the world
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start p-4 mb-6 text-sm text-red-600 border border-red-100 rounded-xl bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-400">
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
                    className="mr-3 mt-0.5 flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email
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
                        className="text-slate-800 dark:text-slate-100"
                      >
                        <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path>
                        <polyline points="15,9 10,13 5,9"></polyline>
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full py-3 pl-10 pr-4 transition-all duration-200 border shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
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
                        className="text-slate-800 dark:text-slate-100"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full py-3 pl-10 pr-10 transition-all duration-200 border shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 focus:outline-none"
                      >
                        {showPassword ? (
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
                          >
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line x1="2" x2="22" y1="2" y2="22"></line>
                          </svg>
                        ) : (
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
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {/* <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary"
                    />
                    <label
                      htmlFor="remember-me"
                      className="block ml-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      Remember me
                    </label>
                  </div> */}

                  <div className="text-sm">
                    <a
                      href="/forgot-password"
                      className="font-medium transition-colors text-primary hover:text-primary/80"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
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
                        Signing in...
                      </>
                    ) : (
                      <>Sign in</>
                    )}
                  </button>
                </div>
              </form>

              {/* Signup link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium transition-colors text-primary hover:text-primary/80"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>

              {/* Demo credentials reminder */}
              {/* <div className="p-3 mt-6 text-xs text-center border rounded-xl bg-slate-50/50 dark:bg-slate-700/30 border-slate-100/50 dark:border-slate-600/30 text-slate-500 dark:text-slate-400">
                <p>
                  <strong>Demo credentials:</strong> demo@rest.dev / countries
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
