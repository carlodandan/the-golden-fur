import React, { useState, useEffect } from 'react';
import { X, Hash } from 'lucide-react';

const PetModal = ({ pet, onSave, onClose, existingRecordNumbers = [] }) => {
  const [formData, setFormData] = useState({
    pet_name: '',
    breed: '',
    customer_name: '',
    email: '',
    contact_number: '',
    record_number: ''
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        pet_name: pet.pet_name,
        breed: pet.breed,
        customer_name: pet.customer_name,
        email: pet.email || '',
        contact_number: pet.contact_number || '',
        record_number: pet.record_number || ''
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md my-auto">
        {/* Modal Header */}
        <div className="bg-amber-500 text-white p-4 rounded-t-xl flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold">
            {pet ? '✏️ Edit' : '🐾 Add New'} Pet Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-600 rounded-lg transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* RECORD NUMBER FIELD - MANUAL INPUT ONLY */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium flex items-center">
                <Hash size={16} className="mr-2 text-amber-500" />
                Record Number:
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="record_number"
                value={formData.record_number}
                onChange={handleChange}
                required
                placeholder="Enter record number (e.g., GF-001, CUST-2024-001)"
                className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-100 transition"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Pet Name:
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="pet_name"
                value={formData.pet_name}
                onChange={handleChange}
                required
                placeholder="Enter pet name"
                className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Breed:
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                placeholder="Enter breed"
                className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Customer Name:
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                placeholder="Enter customer name"
                className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Email (Optional):
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-100 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Contact Number (Optional):
              </label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-100 transition"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer - Sticky at bottom */}
        <div className="p-4 border-t border-gray-100 rounded-xl sticky bottom-0 bg-white">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition text-sm"
            >
              {pet ? 'Update' : 'Create'} Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;