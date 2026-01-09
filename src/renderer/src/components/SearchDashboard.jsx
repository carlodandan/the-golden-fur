import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, X } from 'lucide-react';

const SearchDashboard = ({ onSearch, onClearSearch, recentPets }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    } else {
      handleClear();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim()) {
      // Show loading briefly (optional, or remove completely)
      setIsSearching(true);
      
      // Debounce the search
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value);
        // Remove loading after search is triggered
        setTimeout(() => setIsSearching(false), 100);
      }, 300);
    } else {
      setIsSearching(false);
      handleClear();
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const handleRecentClick = (petName) => {
    setSearchInput(petName);
    onSearch(petName);
    inputRef.current?.focus();
  };

  // Auto-focus search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-amber-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Search className="mr-3 text-amber-500" size={28} />
        Search Pet / Customer Name
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Enter pet name, customer name, or record number..."
            className="w-full px-6 py-4 text-lg border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition pr-12"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          {isSearching && searchInput.trim() ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching...
            </div>
          ) : (
            <span>Type to search pets by name or owner</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchDashboard;