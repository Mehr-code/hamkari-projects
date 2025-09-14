import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

// Function to determine the background color based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return "#EAB308"; // Yellow for Low priority
    case "Medium":
      return "#F97316"; // Orange for Medium priority
    case "High":
      return "#EF4444"; // Red for High priority
    default:
      return "#FFF"; // Default fallback color
  }
};

function SelectDropdown({ options, value, onChange, placeholder }) {
  // State to track if dropdown is open
  const [isOpen, setIsOpen] = useState(false);

  // State to track which option is highlighted (for keyboard navigation)
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Ref to detect clicks outside the component
  const containerRef = useRef(null);

  // State to change chevron color when a value is selected
  const [chervColor, setChervColor] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update chevron color based on whether a value is selected
  useEffect(() => {
    setChervColor(!!value);
  }, [value]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelect(options[highlightedIndex].value);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Handle option selection
  const handleSelect = (optionValue) => {
    onChange(optionValue); // Update parent state
    setIsOpen(false); // Close dropdown
    setHighlightedIndex(-1); // Reset highlight
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className="w-full text-sm text-gray-800 outline-none bg-white border border-gray-300 px-3 py-3 rounded-lg mt-2 flex justify-between items-center shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
        style={{ backgroundColor: getPriorityColor(value) }} // Set background color based on priority
      >
        {/* Display selected value or placeholder */}
        {value ? (
          <span className="text-white">
            {options.find((opt) => opt.value === value)?.label}
          </span>
        ) : (
          placeholder
        )}
        {/* Chevron icon with rotation animation */}
        <LuChevronDown
          className={`mr-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${chervColor && "text-white"}`}
        />
      </button>

      {/* Dropdown list */}
      <div
        className={`absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg overflow-y-auto max-h-60 transition-all duration-200 ease-out z-10 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {options.map((option, idx) => (
          <div
            key={option.value}
            onClick={() => handleSelect(option.value)} // Select option on click
            className={`px-4 py-2 text-sm cursor-pointer rounded-md ${
              highlightedIndex === idx
                ? "bg-blue-100 text-blue-700" // Highlighted option style
                : "hover:bg-gray-100" // Hover effect
            }`}
            style={{
              color: getPriorityColor(option.value), // Text color based on priority
            }}
            onMouseEnter={() => setHighlightedIndex(idx)} // Highlight option on hover
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectDropdown;
