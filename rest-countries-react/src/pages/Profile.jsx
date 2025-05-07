import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StarGlowEffect from "../components/StarGlowEffect";
import { getUserFavorites, removeFromFavorites } from "../api/fav";
import { updateUserProfile, deleteUserAccount, getUserById } from "../api/user";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    favoriteCountries: user?.favoriteCountries || [],
  });

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : ""; // Fallback
  
  const [createdDate, setCreatedDate] = useState(null)

  // Mock favorite countries (in a real app, this would come from the user object or API)
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favLenght, setFavLenght] = useState(0);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Fetch user's favorite countries
  useEffect(() => {
    console.log(userData);
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get favorite countries from the API
        const favorites = await getUserFavorites();
        setFavLenght(favorites.length);

        // Filter favorites where isAdded is true (if the field exists)
        const activeFavorites = favorites.filter(
          (fav) => fav.isAdded !== false
        );

        // Transform the data to match the component's requirements
        const formattedFavorites = activeFavorites.map((fav) => ({
          code: fav.countryCode,
          name: fav.countryName || fav.countryCode, // Use name if available, otherwise code
          flag: `https://flagcdn.com/${fav.countryCode
            .toLowerCase()
            .substring(0, 2)}.svg`,
          dateAdded: fav.createdAt || new Date().toISOString(),
          _id: fav._id,
        }));

        setFavoriteCountries(formattedFavorites);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load your favorite countries.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const getUserDetailsById = async () => {
      if (!user) return;
      try {
        const userDetails = await getUserById(user.id);
        setUserData((prev) => ({
          ...prev,
          name: userDetails.name,
          email: userDetails.email,
          bio: userDetails.bio,
          location: userDetails.location,
          website: userDetails.website,
          favoriteCountries: userDetails.favoriteCountries,
        }));
        console.log("USER", userDetails)

        // If you want to use joinDate, store it somewhere like in state or userData
        const joinDate = userDetails?.createdAt
          ? new Date(userDetails.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })
          : "";
        setCreatedDate(joinDate)

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your profile data.");
      }
    };

    getUserDetailsById();
  }, []);


  // Handle removing a country from favorites
  const handleRemoveFavorite = async (favoriteId) => {
    if (!favoriteId) return;

    try {
      setIsLoading(true);

      // Call the API to remove the favorite
      await removeFromFavorites(favoriteId);

      // Update the state to remove the country
      setFavoriteCountries((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite._id !== favoriteId)
      );
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove. Please try again.");
      console.error("Error removing favorite:", err);
      setError("Failed to remove from favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call API to update user profile
      const updatedUser = await updateUserProfile({
        name: userData.name,
        email: userData.email,
        bio: userData.bio,
        location: userData.location,
        website: userData.website,
      });

      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      // Exit edit mode
      setIsEditing(false);

      // Show success message (optional)
      toast.success("Profile updated successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmTextChange = (e) => {
    setDeleteConfirmText(e.target.value.toUpperCase());
  };

  const handleDeleteAccount = async () => {
    // Verify confirmation text
    if (deleteConfirmText !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }

    try {
      setIsLoading(true);

      // Call API to delete account
      await deleteUserAccount();
      toast.success("Account deleted — goodbye 👋");

      // Logout user
      setTimeout(() => {
        logout();
        window.location.replace("/");
      }, 2000);
    } catch (err) {
      toast.error("Failed to delete account. Please try again.");
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-500 dark:text-slate-400"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Not Logged In
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Please sign in to view your profile
          </p>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-300 inline-flex items-center gap-2"
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <StarGlowEffect />
      <div className="max-w-5xl px-4 mx-auto py-36 sm:px-6">
        {/* Profile header with avatar */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 rounded-2xl blur-xl"></div>
          <div className="relative p-6 border shadow-xl backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/20 dark:border-slate-700/30 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* User avatar */}
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 overflow-hidden border-4 rounded-full shadow-lg sm:w-32 sm:h-32 bg-gradient-to-br from-primary/20 to-primary/30 border-white/30 dark:border-slate-700/30">
                  <span className="text-4xl font-bold sm:text-5xl text-primary">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl text-slate-900 dark:text-white">
                  {userData.name}
                </h1>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  {userData.bio}
                </p>

                <div className="flex flex-wrap justify-center gap-4 text-sm sm:justify-start">
                  {userData.location && (
                    <div className="flex items-center text-slate-700 dark:text-slate-300">
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
                        className="mr-1.5 text-slate-500 dark:text-slate-400"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {userData.location}
                    </div>
                  )}

                  <div className="flex items-center text-slate-700 dark:text-slate-300">
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
                      className="mr-1.5 text-slate-500 dark:text-slate-400"
                    >
                      <rect
                        width="18"
                        height="18"
                        x="3"
                        y="4"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" x2="16" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="2" y2="6"></line>
                      <line x1="3" x2="21" y1="10" y2="10"></line>
                      <path d="M8 14h.01"></path>
                      <path d="M12 14h.01"></path>
                      <path d="M16 14h.01"></path>
                      <path d="M8 18h.01"></path>
                      <path d="M12 18h.01"></path>
                      <path d="M16 18h.01"></path>
                    </svg>
                    {createdDate || joinDate}
                  </div>

                  {userData.website && (
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center transition-colors text-primary hover:text-primary/80"
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
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      Website
                    </a>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 transition-all duration-300 border shadow-sm backdrop-blur-md bg-white/60 dark:bg-slate-700/60 rounded-xl border-slate-200/30 dark:border-slate-600/30 hover:shadow text-slate-700 dark:text-slate-200"
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and content */}
        <div className="relative">
          <div className="mb-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "profile"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "favorites"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Favorite Countries
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "settings"
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Profile tab content */}
          {activeTab === "profile" && (
            <div className="relative p-6 border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={userData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="website"
                      className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={userData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                    ></textarea>
                  </div>

                  <div className="flex justify-end md:col-span-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
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
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Email
                        </p>
                        <p className="text-slate-800 dark:text-slate-200">
                          {userData.email}
                        </p>
                      </div>

                      {userData.location && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Location
                          </p>
                          <p className="text-slate-800 dark:text-slate-200">
                            {userData.location}
                          </p>
                        </div>
                      )}

                      {userData.website && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Website
                          </p>
                          <a
                            href={userData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors text-primary hover:text-primary/80"
                          >
                            {userData.website.replace(
                              /^https?:\/\/(www\.)?/,
                              ""
                            )}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                      Stats & Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {favLenght} Favorite Countries
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Countries you've marked as favorites
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Favorites tab content */}
          {activeTab === "favorites" && (
            <div className="relative p-6 border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Your Favorite Countries
              </h3>

              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="overflow-hidden border shadow-lg rounded-xl backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/30"
                    >
                      <div className="h-32 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                      <div className="p-4">
                        <div className="w-3/4 h-6 mb-2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                        <div className="w-1/2 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 text-center border border-red-100 rounded-xl dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/10">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 text-red-500 rounded-full bg-red-100/80 dark:bg-red-900/20 dark:text-red-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <p className="mb-2 text-red-600 dark:text-red-400">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 mt-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary/90"
                  >
                    Try Again
                  </button>
                </div>
              ) : favoriteCountries.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100/80 dark:bg-slate-700/40 text-slate-400 dark:text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-700 dark:text-slate-200">
                    No Favorites Yet
                  </h3>
                  <p className="mb-4 text-slate-600 dark:text-slate-300">
                    Start adding countries to your favorites
                  </p>
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-1 mx-auto font-medium text-primary hover:underline"
                  >
                    Explore countries
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
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteCountries.map((country) => (
                    <div
                      key={country.code}
                      className="overflow-hidden transition-shadow duration-300 border shadow-md backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 rounded-xl border-white/20 dark:border-slate-700/30 hover:shadow-lg"
                    >
                      <div className="relative h-32 overflow-hidden bg-slate-200/60 dark:bg-slate-700/60">
                        <img
                          src={country.flag}
                          alt={`${country.name} flag`}
                          className="absolute inset-0 object-cover w-full h-full"
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => handleRemoveFavorite(country._id)}
                            className="p-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md text-primary hover:bg-primary/50 dark:hover:bg-slate-700/90 transition-colors duration-200"
                            title="Remove from favorites"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <Link
                          to={`/country/${country.code}`}
                          className="block mb-1 text-lg font-semibold transition-colors duration-200 text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary"
                        >
                          {country.name}
                        </Link>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          Added on{" "}
                          {new Date(country.dateAdded).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Settings tab content */}
          {activeTab === "settings" && (
            <div className="relative p-6 border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Account Settings
              </h3>

              <div className="space-y-8">
                <div>
                  <h4 className="mb-3 font-medium text-md text-slate-800 dark:text-slate-200">
                    Password
                  </h4>
                  <button className="flex items-center gap-2 px-4 py-2 transition-all duration-300 border shadow-sm backdrop-blur-md bg-white/60 dark:bg-slate-700/60 rounded-xl border-slate-200/30 dark:border-slate-600/30 hover:shadow text-slate-700 dark:text-slate-200">
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
                    Change Password
                  </button>
                </div>

                <div>
                  <h4 className="mb-3 font-medium text-md text-slate-800 dark:text-slate-200">
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 rounded-xl border-white/20 dark:border-slate-600/30">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          Email Notifications
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Receive emails about account updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 rounded-xl border-white/20 dark:border-slate-600/30">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          New Country Updates
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Get notified about updates to countries you've visited
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-medium text-md text-slate-800 dark:text-slate-200 ">
                    Danger Zone
                  </h4>
                  <div className="flex items-center justify-between p-4 border border-red-100 backdrop-blur-sm bg-red-50/50 dark:bg-red-900/10 rounded-xl dark:border-red-900/20">
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400">
                        Delete Account
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <button
                      className="px-4 py-2 text-red-600 transition-colors duration-200 bg-white border border-red-200 rounded-lg dark:bg-slate-800 dark:text-red-400 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleOpenDeleteConfirmation}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 backdrop-blur-md bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200/30 dark:border-slate-600/30 shadow-sm hover:shadow transition-all duration-300 text-slate-700 dark:text-slate-200 flex items-center gap-2"
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
                      className="text-red-500 dark:text-red-400"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete account confirmation modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 space-y-6 bg-white shadow-xl rounded-2xl dark:bg-slate-800">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Confirm Account Deletion
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This action{" "}
                <span className="font-semibold text-red-600">cannot</span> be
                undone. All your data will be permanently removed. Please type{" "}
                <span className="font-semibold">DELETE</span> to continue.
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={handleConfirmTextChange}
              placeholder="Type DELETE to confirm"
              className="w-full px-4 py-2.5 bg-white/60 dark:bg-slate-700/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 uppercase"
            />

            {error && (
              <p className="text-sm text-center text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 transition-colors duration-200 border rounded-lg backdrop-blur-md bg-white/60 dark:bg-slate-700/60 border-slate-200/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || deleteConfirmText !== "DELETE"}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  deleteConfirmText === "DELETE" && !isLoading
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-300 dark:bg-red-700/50 text-white cursor-not-allowed"
                }`}
              >
                {isLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
