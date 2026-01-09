import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GroomingModal = ({ record, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    grooming_date: '',
    size: 'S',
    groomer: '',
    hair_style: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        grooming_date: record.grooming_date,
        size: record.size,
        groomer: record.groomer,
        hair_style: record.hair_style || ''
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, grooming_date: today }));
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="bg-amber-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {record ? '✏️ Edit' : '➕ Add'} Grooming Record
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-600 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Date of Grooming:
            </label>
            <input
              type="date"
              name="grooming_date"
              value={formData.grooming_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Size:
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              placeholder="e.g., S, M, L, XL, Small, Medium, 10kg, etc."
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter any size description (alphanumeric)
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Groomer:
            </label>
            <input
              type="text"
              name="groomer"
              value={formData.groomer}
              onChange={handleChange}
              required
              placeholder="Enter groomer name"
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Hair Style (Optional):
            </label>
            <input
              type="text"
              name="hair_style"
              value={formData.hair_style}
              onChange={handleChange}
              placeholder="Enter hair style"
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition shadow-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroomingModal;