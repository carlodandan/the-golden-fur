import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Clock } from 'lucide-react';
import SearchDashboard from './src/components/SearchDashboard';
import PetCard from './src/components/PetCard';
import PetModal from './src/components/PetModal';
import GroomingModal from './src/components/GroomingModal';
import logoTitle from '../../logos/goldenfur_title.png';
import logoImage from '../../logos/goldenfur_logo.png';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showGroomingModal, setShowGroomingModal] = useState(false);
  const [editingGroomingRecord, setEditingGroomingRecord] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [existingRecordNumbers, setExistingRecordNumbers] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const pets = await window.electronAPI.getAllPets();
      setAllPets(pets);
      // Don't set searchResults here - only show after search
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!term.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    
    // Debounce search for better performance
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await window.electronAPI.searchPets(term);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      }
    }, 300); // 300ms debounce
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setShowPetModal(true);
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setShowPetModal(true);
  };

  const handleSavePet = async (petData) => {
    try {
      // Validate required fields
      if (!petData.record_number || !petData.record_number.trim()) {
        alert('Record number is required');
        return;
      }
      
      // Check for duplicates (optional, you can remove if duplicates are allowed)
      const existingNumbers = await window.electronAPI.getRecordNumbers();
      if (existingNumbers.includes(petData.record_number.trim()) && !editingPet) {
        if (!confirm(`Record number "${petData.record_number}" already exists. Do you want to use it anyway?`)) {
          return;
        }
      }
      
      if (editingPet) {
        await window.electronAPI.updatePet(editingPet.id, petData);
      } else {
        await window.electronAPI.createPet(petData);
      }
      setShowPetModal(false);
      loadInitialData();
      loadRecordNumbers();
    } catch (error) {
      console.error('Failed to save pet:', error);
      alert(`Failed to save pet: ${error.message}`);
    }
  };

  const handleAddGroomingRecord = (pet) => {
    setSelectedPet(pet);
    setEditingGroomingRecord(null);
    setShowGroomingModal(true);
  };

  const handleEditGroomingRecord = (pet, record) => {
    setSelectedPet(pet);
    setEditingGroomingRecord(record);
    setShowGroomingModal(true);
  };

    const handleSaveGroomingRecord = async (recordData) => {
    try {
      if (editingGroomingRecord) {
        await window.electronAPI.updateGroomingRecord(editingGroomingRecord.id, recordData);
      } else {
        await window.electronAPI.createGroomingRecord({
          ...recordData,
          pet_id: selectedPet.id
        });
      }
      setShowGroomingModal(false);
      loadInitialData();
      loadRecordNumbers(); // Reload record numbers
    } catch (error) {
      console.error('Failed to save grooming record:', error);
    }
  };

  const handleDeleteGroomingRecord = async (recordId) => {
    if (confirm('Are you sure you want to delete this grooming record?')) {
      try {
        await window.electronAPI.deleteGroomingRecord(recordId);
        loadInitialData();
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  const handleDeletePet = async (petId) => {
    if (confirm('Are you sure you want to delete this pet and all its grooming records?')) {
      try {
        await window.electronAPI.deletePet(petId);
        loadInitialData();
      } catch (error) {
        console.error('Failed to delete pet:', error);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadRecordNumbers = async () => {
    try {
      const numbers = await window.electronAPI.getRecordNumbers();
      setExistingRecordNumbers(numbers);
    } catch (error) {
      console.error('Failed to load record numbers:', error);
    }
  };

  useEffect(() => {
    loadRecordNumbers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-amber-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo icon */}
            <img
              src={logoImage}
              alt="Golden Fur Logo"
              className="h-14 w-14 object-contain"
            />

            {/* Title + tagline */}
            <div className="flex flex-col">
              <img
                src={logoTitle}
                alt="Golden Fur"
                className="h-10 w-auto"
              />
              <p className="text-amber-100 text-sm leading-tight">
                Pet Grooming, Hotel and Accessories
              </p>
            </div>
          </div>
          <button
            onClick={handleAddPet}
            className="bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition flex items-center space-x-2 shadow-md"
          >
            <Plus size={20} />
            <span>Add New Pet</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <SearchDashboard 
          onSearch={handleSearch} 
          onClearSearch={handleClearSearch}
          recentPets={allPets.slice(0, 3)} 
        />

        {/* Only show search results section if user has searched */}
        {hasSearched && (
          <div className="mt-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
                {searchTerm && (
                  <span className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                    "{searchTerm}"
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{searchResults.length} pet(s) found</span>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-amber-100">
                <div className="w-24 h-24 mx-auto mb-4 text-amber-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No pets found</h3>
                <p className="text-gray-500 mb-6">No results for "{searchTerm}". Try a different search term.</p>
                <button
                  onClick={handleAddPet}
                  className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition"
                >
                  Add New Pet
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6 justify-center">
                {searchResults.map((pet) => (
                  <div key={pet.id} className="w-[calc(50%-12px)] max-w-[520px] min-w-[480px] flex-shrink-0">
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEditPet={() => handleEditPet(pet)}
                    onDeletePet={() => handleDeletePet(pet.id)}
                    onAddGroomingRecord={() => handleAddGroomingRecord(pet)}
                    onEditGroomingRecord={(record) => handleEditGroomingRecord(pet, record)}
                    onDeleteGroomingRecord={handleDeleteGroomingRecord}
                  />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show recent pets dashboard when no search is active */}
        {!hasSearched && allPets.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Clock className="mr-3 text-amber-500" size={28} />
                Recent Pets
              </h2>
            </div>
            
            {allPets.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-amber-100">
                <div className="w-24 h-24 mx-auto mb-4 text-amber-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No pets yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first pet profile.</p>
                <button
                  onClick={handleAddPet}
                  className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition"
                >
                  Add Your First Pet
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6 justify-center">
                {allPets.slice(0, 4).map((pet) => (
                  <div key={pet.id} className="w-[calc(50%-12px)] max-w-[520px] min-w-[480px] flex-shrink-0">
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEditPet={() => handleEditPet(pet)}
                    onDeletePet={() => handleDeletePet(pet.id)}
                    onAddGroomingRecord={() => handleAddGroomingRecord(pet)}
                    onEditGroomingRecord={(record) => handleEditGroomingRecord(pet, record)}
                    onDeleteGroomingRecord={handleDeleteGroomingRecord}
                  />
                  </div>
                ))}
              </div>
            )}
            
            {allPets.length > 6 && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center text-gray-600 bg-white px-6 py-3 rounded-lg border border-amber-100">
                  <Search size={16} className="mr-2" />
                  <span>Search to see all {allPets.length} pets...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show empty state when no pets exist at all */}
        {!hasSearched && allPets.length === 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 max-w-2xl mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 text-amber-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Golden Fur Grooming!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Get started by adding your first pet profile. Search for pets by name or owner to quickly find records.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleAddPet}
                  className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add First Pet</span>
                </button>
                <button
                  onClick={() => document.querySelector('input[type="text"]')?.focus()}
                  className="bg-white text-amber-600 border border-amber-300 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition flex items-center space-x-2"
                >
                  <Search size={20} />
                  <span>Start Searching</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showPetModal && (
        <PetModal
          pet={editingPet}
          onSave={handleSavePet}
          onClose={() => setShowPetModal(false)}
        />
      )}

      {showGroomingModal && (
        <GroomingModal
          record={editingGroomingRecord}
          onSave={handleSaveGroomingRecord}
          onClose={() => setShowGroomingModal(false)}
          existingRecordNumbers={existingRecordNumbers}
        />
      )}
    </div>
  );
}

export default App;