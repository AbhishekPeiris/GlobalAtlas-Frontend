import { useState, useEffect, useRef } from "react";

export default function FilterBar({ onRegion, onLanguage }) {
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  const languages = ["English", "Spanish", "Arabic", "French", "Chinese"];

  // Custom select component with better styling
  const CustomSelect = ({ options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
      // Close dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value) => {
      setSelected(value);
      onChange(value);
      setIsOpen(false);
    };

    return (
      <div className="relative min-w-[180px]" ref={dropdownRef}>
        <div className="absolute inset-0 rounded-xl bg-primary/5 dark:bg-primary/10 blur-md"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-between w-full px-4 py-3 
            backdrop-blur-md rounded-xl
            bg-white/60 dark:bg-slate-800/60 
            text-left border border-slate-200/30 dark:border-slate-700/30
            shadow-md hover:shadow-lg transition-all duration-300`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={
              selected
                ? "text-slate-800 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            }
          >
            {selected || placeholder}
          </span>
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
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            } text-slate-500 dark:text-slate-400`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg max-h-60 overflow-auto z-50">
            <div className="p-1" role="listbox">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors duration-200
                    ${
                      selected === option
                        ? "bg-primary/20 text-primary font-medium"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50"
                    }`}
                  role="option"
                  aria-selected={selected === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      <CustomSelect
        options={regions}
        onChange={onRegion}
        placeholder="Filter by region"
      />
      <CustomSelect
        options={languages}
        onChange={onLanguage}
        placeholder="Filter by language"
      />
    </div>
  );
}
