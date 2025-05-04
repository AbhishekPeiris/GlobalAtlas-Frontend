import { useState } from "react";
import { Link } from "react-router-dom";

export default function CountryCard({ country }) {
  const { name, flags, population, region, cca3, capital = [] } = country;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/country/${cca3}`}
      className={`group relative overflow-hidden backdrop-blur-sm 
        bg-white/70 dark:bg-slate-800/70 
        text-slate-800 dark:text-slate-200
        rounded-2xl transition-all duration-300
        ${isHovered ? "shadow-xl translate-y-[-4px]" : "shadow-md"}
        hover:shadow-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass border effect */}
      <div
        className={`absolute inset-0 rounded-2xl border border-white/20 dark:border-slate-700/30 pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* Hover gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`}
      ></div>

      {/* Flag container with aspect ratio */}
      <div className="relative pt-[56.25%] overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-700">
        <img
          src={flags.svg}
          alt={`${name.common} flag`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      {/* Country info container */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">
            {name.common}
          </h3>
          <div
            className={`bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full transition-opacity duration-300`}
          >
            {region}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
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
              className="mr-2 text-slate-500 dark:text-slate-400"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-slate-700 dark:text-slate-300">
              {population.toLocaleString()}
            </span>
          </div>

          {capital && capital.length > 0 && (
            <div className="flex items-center text-sm">
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
                className="mr-2 text-slate-500 dark:text-slate-400"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="text-slate-700 dark:text-slate-300">
                {capital[0]}
              </span>
            </div>
          )}
        </div>

        {/* Explore button */}
        <div
          className={`mt-4 flex justify-end transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-primary text-sm font-medium flex items-center">
            Explore
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
              className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
