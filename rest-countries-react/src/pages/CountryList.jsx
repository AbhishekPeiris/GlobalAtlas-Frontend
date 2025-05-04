import { useState, useEffect } from "react";
import useCountries from "../hooks/useCountries";
import CountryCard from "../components/home/CountryCard";
import SearchBar from "../components/home/SearchBar";
import FilterBar from "../components/home/FilterBar";
import StarGlowEffect from "../components/StarGlowEffect";

export default function CountryList() {
  const { countries, loading, error, search, byRegion, byLanguage, reload } =
    useCountries();
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");

  // Animation effect when filter/search changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [countries]);

  // Handle search with debounce
  const handleSearch = (value) => {
    setActiveFilter(value ? "search" : "");
    value ? search(value) : reload();
  };

  // Handle region filter
  const handleRegionFilter = (region) => {
    setActiveFilter(`region: ${region}`);
    byRegion(region);
  };

  // Handle language filter
  const handleLanguageFilter = (language) => {
    setActiveFilter(`language: ${language}`);
    byLanguage(language);
  };

  return (
    <>
      <StarGlowEffect />
      <div className="px-4 mx-auto max-w-7xl sm:px-6 py-36 content-container">
        {/* Header section with subtle animation */}
        <div className="mb-12 text-center heading-content">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl text-slate-900 dark:text-white">
            Explore <span className="text-primary">Countries</span> Around the
            World
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
            Discover information about countries, their populations, regions, and
            more in this interactive atlas.
          </p>
        </div>

        {/* Filter section with glass morphism */}
        <div className="relative z-40 mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 rounded-2xl blur-xl"></div>
          <div className="relative p-6 border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-white/20 dark:border-slate-700/30">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <SearchBar onSearch={handleSearch} />
              <FilterBar
                onRegion={handleRegionFilter}
                onLanguage={handleLanguageFilter}
              />
            </div>

            {/* Active filters display */}
            {activeFilter && (
              <div className="pt-4 mt-4 border-t border-slate-200/30 dark:border-slate-700/30">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Active filter:
                  </span>
                  <div className="flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {activeFilter}
                    <button
                      onClick={() => {
                        setActiveFilter("");
                        reload();
                      }}
                      className="ml-2 hover:text-primary-dark"
                      aria-label="Clear filter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading state with animated skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden shadow animate-pulse bg-white/70 dark:bg-slate-800/70 rounded-2xl h-72"
              >
                <div className="w-full h-40 bg-slate-200 dark:bg-slate-700"></div>
                <div className="p-5 space-y-3">
                  <div className="w-2/3 h-5 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="w-1/2 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="w-1/3 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state with retry */}
        {error && (
          <div className="px-6 py-12 text-center border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-red-200/30 dark:border-red-900/30">
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
              Data Loading Error
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-300">{error}</p>
            <button
              onClick={reload}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
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
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
              Try Again
            </button>
          </div>
        )}

        {/* Results count */}
        {!loading && !error && countries.length > 0 && (
          <div className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-primary">{countries.length}</span>{" "}
            countries
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && countries.length === 0 && (
          <div className="px-6 py-12 text-center border shadow-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-2xl border-slate-200/30 dark:border-slate-700/30">
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-700 dark:text-slate-200">
              No Countries Found
            </h3>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              Try adjusting your search or filters
            </p>
            <button
              onClick={reload}
              className="flex items-center justify-center gap-1 mx-auto font-medium text-primary hover:underline"
            >
              Reset all filters
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
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Country grid with animation */}
        {!loading && !error && countries.length > 0 && (
          <div
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-300 ${
              isAnimating ? "opacity-50" : "opacity-100"
            }`}
          >
            {countries.map((c) => (
              <CountryCard key={c.cca3} country={c} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
