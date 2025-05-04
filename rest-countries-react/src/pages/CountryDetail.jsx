import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getByCode } from "../services/api";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} from "../api/fav";
import { useAuth } from "../context/AuthContext";
import StarGlowEffect from "../components/StarGlowEffect";

export default function CountryDetail() {
  const { code } = useParams();
  const { user } = useAuth();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Fetch country data
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getByCode(code);
        setCountry(data[0]);
      } catch (err) {
        setError("Failed to load country data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [code]);

  // Check favorite status - now as a separate function for reuse
  const checkFavoriteStatus = useCallback(async () => {
    if (!user) return;

    try {
      const favorites = await getUserFavorites();
      const favorite = favorites.find(
        (fav) =>
          (fav.countryCode === code ||
            (country && fav.countryCode === country.cca3)) &&
          fav.isAdded === true
      );

      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite._id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  }, [user, code, country]);

  // Check if country is in user's favorites
  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      // If user is not logged in, redirect to login page
      return (window.location.href = "/login");
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorite = await removeFromFavorites(favoriteId);
        setIsFavorite(false);
        // If using soft delete with isAdded field:
        if (updatedFavorite && updatedFavorite._id) {
          setFavoriteId(updatedFavorite._id);
        } else {
          setFavoriteId(null);
        }
      } else {
        // Add to favorites
        const response = await addToFavorites(country.cca3 || code);
        setIsFavorite(true);
        setFavoriteId(response._id);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavoriteLoading(false);
      // Refresh favorite status after toggle operation
      await checkFavoriteStatus();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl px-4 mx-auto py-36 sm:px-6">
        <div className="p-8 border shadow-lg animate-pulse backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
          <div className="w-24 h-8 mb-8 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-full md:w-1/2 h-72 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            <div className="w-full space-y-4 md:w-1/2">
              <div className="w-3/4 h-10 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-full h-6 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-2/3 h-6 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-1/2 h-6 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-3/4 h-6 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl px-4 mx-auto py-36 sm:px-6">
        <div className="py-12 text-center border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-red-200/30 dark:border-red-900/30">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-red-500 rounded-full bg-red-100/80 dark:bg-red-900/20 dark:text-red-400">
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">
            Error
          </h3>
          <p className="mb-4 text-slate-600 dark:text-slate-300">{error}</p>
          <Link
            to="/"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!country) return null;

  const {
    name,
    flags,
    population,
    region,
    subregion,
    capital,
    languages,
    currencies,
    borders = [],
    area,
    timezones = [],
    continents = [],
  } = country;

  // Format currency list
  const currencyList = currencies
    ? Object.values(currencies)
        .map((currency) => `${currency.name} (${currency.symbol || ""})`)
        .join(", ")
    : "N/A";

  // Format language list
  const languageList = languages ? Object.values(languages).join(", ") : "N/A";

  return (
    <>
      <StarGlowEffect />
      <div className="max-w-5xl px-4 mx-auto py-36 sm:px-6">
        {/* Back button with animation */}
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mb-8 transition-all duration-300 border shadow-md backdrop-blur-md bg-white/60 dark:bg-slate-800/60 rounded-xl border-slate-200/30 dark:border-slate-700/30 hover:shadow-lg text-slate-700 dark:text-slate-200 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 transition-transform duration-300 transform group-hover:-translate-x-1 text-primary"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Countries
        </Link>

        {/* Main content card with glass morphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-2xl blur-xl"></div>
          <div className="relative overflow-hidden border shadow-xl backdrop-blur-lg bg-white/60 dark:bg-slate-800/60 rounded-2xl border-white/20 dark:border-slate-700/30">
            {/* Flag banner */}
            <div className="relative w-full overflow-hidden shadow-inner h-52 sm:h-64 md:h-80">
              <div className="absolute inset-0 bg-slate-200/60 dark:bg-slate-700/60 backdrop-blur-sm"></div>
              <img
                src={flags.svg}
                alt={`${name.common} flag`}
                className="absolute inset-0 object-cover w-full h-full opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-slate-800/90 to-transparent"></div>

              {/* Favorite button */}
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                  isFavorite
                    ? "bg-primary text-white hover:bg-primary/80"
                    : "bg-white/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700/90"
                } backdrop-blur-md shadow-md hover:shadow-lg`}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                {favoriteLoading ? (
                  <svg
                    className="w-5 h-5 animate-spin"
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
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isFavorite ? "animate-pulse" : ""}
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                )}
              </button>

              {/* Country name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-4">
                  <img
                    src={flags.svg}
                    alt={`${name.common} flag`}
                    className="object-cover w-16 h-12 border rounded shadow-lg border-white/20 dark:border-slate-700/30"
                  />
                  <div>
                    <h1 className="text-3xl font-bold md:text-4xl text-slate-900 dark:text-white">
                      {name.common}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300 md:text-base">
                      {name.official}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Country details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-slate-900 dark:text-white border-slate-200/30 dark:border-slate-700/30">
                    General Information
                  </h2>

                  <div className="space-y-3">
                    <InfoItem
                      icon={
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
                          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z" />
                          <path d="M12 6v2" />
                          <path d="M12 16v2" />
                          <path d="M6 12H8" />
                          <path d="M16 12h2" />
                        </svg>
                      }
                      label="Region"
                      value={
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {region}
                        </span>
                      }
                    />

                    {subregion && (
                      <InfoItem
                        icon={
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
                        }
                        label="Subregion"
                        value={subregion}
                      />
                    )}

                    {capital && capital.length > 0 && (
                      <InfoItem
                        icon={
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
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        }
                        label="Capital"
                        value={capital.join(", ")}
                      />
                    )}

                    <InfoItem
                      icon={
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
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      }
                      label="Population"
                      value={population.toLocaleString()}
                    />

                    {area && (
                      <InfoItem
                        icon={
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
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                            <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                            <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                        }
                        label="Area"
                        value={`${area.toLocaleString()} km²`}
                      />
                    )}

                    {continents && continents.length > 0 && (
                      <InfoItem
                        icon={
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
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            <path d="M2 12h20"></path>
                          </svg>
                        }
                        label="Continent"
                        value={continents.join(", ")}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-slate-900 dark:text-white border-slate-200/30 dark:border-slate-700/30">
                    Additional Details
                  </h2>

                  <div className="space-y-3">
                    {languages && Object.keys(languages).length > 0 && (
                      <InfoItem
                        icon={
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
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        }
                        label="Languages"
                        value={languageList}
                      />
                    )}

                    {currencies && Object.keys(currencies).length > 0 && (
                      <InfoItem
                        icon={
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
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="6" x2="12" y2="12"></line>
                            <line x1="12" y1="18" x2="12" y2="18"></line>
                          </svg>
                        }
                        label="Currencies"
                        value={currencyList}
                      />
                    )}

                    {timezones && timezones.length > 0 && (
                      <InfoItem
                        icon={
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
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        }
                        label="Timezones"
                        value={
                          <div className="pr-2 overflow-y-auto max-h-20 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                            {timezones.slice(0, 3).join(", ")}
                            {timezones.length > 3 &&
                              ` (+${timezones.length - 3} more)`}
                          </div>
                        }
                      />
                    )}
                  </div>

                  {borders && borders.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Bordering Countries:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {borders.map((border) => (
                          <Link
                            key={border}
                            to={`/country/${border}`}
                            className="px-3 py-1.5 backdrop-blur-md bg-white/40 dark:bg-slate-700/40 text-sm rounded-lg border border-slate-200/30 dark:border-slate-600/30 shadow-sm hover:shadow transition-all duration-300 text-slate-700 dark:text-slate-200"
                          >
                            {border}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper component for displaying info items
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start">
      <div className="mt-0.5 text-primary mr-3">{icon}</div>
      <div>
        <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="text-slate-800 dark:text-slate-200">{value}</div>
      </div>
    </div>
  );
}
