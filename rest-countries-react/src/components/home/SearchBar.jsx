import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ${
        focused ? "scale-[1.02]" : ""
      }`}
    >
      <div className="absolute inset-0 rounded-xl bg-primary/5 dark:bg-primary/10 blur-md"></div>
      <div
        className={`relative flex items-center overflow-hidden backdrop-blur-md rounded-xl 
        border border-slate-200/30 dark:border-slate-700/30
        ${focused ? "ring-2 ring-primary/30 shadow-lg" : "shadow-md"}`}
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
          className="absolute left-4 text-slate-400 dark:text-slate-500"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          placeholder="Search by country name..."
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-3 pl-12 pr-4 outline-none md:w-72 bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
