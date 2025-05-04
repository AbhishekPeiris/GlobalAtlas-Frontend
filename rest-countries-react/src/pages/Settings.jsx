import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import StarGlowEffect from "../components/StarGlowEffect";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("english");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Mock function to save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setMessage({
        type: "success",
        text: "Settings saved successfully!",
      });

      // Auto-hide message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }, 600);
  };

  if (!user) {
    return (
      <div className="max-w-3xl px-4 py-12 mx-auto py-36">
        <div className="p-6 text-center border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Not Logged In
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Please sign in to access settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StarGlowEffect />
      <div className="max-w-3xl px-4 mx-auto py-36">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your account preferences
          </p>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 text-green-600 dark:text-green-400"
                : "bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400"
            } text-sm flex items-center`}
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
              className="flex-shrink-0 mr-3"
            >
              {message.type === "success" ? (
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              ) : (
                <circle cx="12" cy="12" r="10"></circle>
              )}
              {message.type === "success" ? (
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              ) : (
                <>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </>
              )}
            </svg>
            {message.text}
          </div>
        )}

        <div className="relative p-6 mb-6 border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Appearance
          </h2>

          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                Dark Mode
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Toggle between light and dark themes
              </p>
            </div>
            <button
              onClick={toggle}
              className={`w-11 h-6 relative rounded-full transition-colors duration-300 ease-in-out ${
                theme === "dark"
                  ? "bg-primary"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                Language
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose your preferred language
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="japanese">Japanese</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>
        </div>

        <div className="relative p-6 mb-6 border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Notifications
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                Email Notifications
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Receive important updates via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="relative p-6 mb-6 border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Account
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Name
              </label>
              <input
                type="text"
                defaultValue={user.name || "Demo User"}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                defaultValue={user.email || "demo@rest.dev"}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 transition-colors duration-200 border rounded-lg backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border-slate-200/50 dark:border-slate-600/50 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10"
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
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className={`px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 ${
              isSaving ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? (
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
                Saving...
              </>
            ) : (
              <>
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
