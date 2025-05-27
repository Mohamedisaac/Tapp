
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange, placeholder = "Search terms..." }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-sky-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2.5 border border-sky-300 rounded-lg leading-5 bg-white text-sky-700 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
        aria-label="Search terms"
      />
    </div>
  );
};

export default SearchBar;
