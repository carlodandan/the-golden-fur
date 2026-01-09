import React from 'react';
import { Edit, Trash2, Plus, User, Mail, Phone, Calendar, Hash } from 'lucide-react';

const PetCard = ({ pet, onEditPet, onDeletePet, onAddGroomingRecord, onEditGroomingRecord, onDeleteGroomingRecord }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getSizeBadgeColor = (size) => {
    const sizeLower = size?.toLowerCase() || '';
    if (sizeLower.includes('s') || sizeLower === 'small') {
      return 'bg-green-100 text-green-800';
    } else if (sizeLower.includes('m') || sizeLower === 'medium') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (sizeLower.includes('l') || sizeLower === 'large') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Pet Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold">{pet.pet_name}</h3>
            </div>
            <p className="text-amber-100">Breed: {pet.breed}</p>
            {pet.record_number && (
                <div className="flex items-center bg-white/20 px-3 py-1 rounded-lg">
                  <Hash size={14} className="mr-1" />
                  <span className="font-mono text-sm">{pet.record_number}</span>
                </div>
              )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEditPet(pet)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="Edit Pet"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDeletePet(pet.id)}
              className="p-2 bg-white/20 hover:bg-red-500 rounded-lg transition"
              title="Delete Pet"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="p-6 border-b border-amber-50">
        <div className="space-y-3">
          <div className="flex items-center text-gray-700">
            <User size={18} className="mr-3 text-amber-500" />
            <span className="font-medium">Owner:</span>
            <span className="ml-2">{pet.customer_name}</span>
          </div>
          {pet.email && (
            <div className="flex items-center text-gray-700">
              <Mail size={18} className="mr-3 text-amber-500" />
              <span className="font-medium">Email:</span>
              <span className="ml-2">{pet.email}</span>
            </div>
          )}
          {pet.contact_number && (
            <div className="flex items-center text-gray-700">
              <Phone size={18} className="mr-3 text-amber-500" />
              <span className="font-medium">Contact:</span>
              <span className="ml-2">{pet.contact_number}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grooming History */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800 text-sm flex items-center">
            <Calendar className="mr-2" size={15} />
            Grooming History
          </h4>
          <button
            onClick={() => onAddGroomingRecord(pet)}
            className="flex items-center space-x-2 text-amber-600 text-sm hover:text-amber-700 font-small"
          >
            <Plus size={18} />
            <span>Add Record</span>
          </button>
        </div>

        {pet.records && pet.records.length > 0 ? (
          <div className="space-y-3">
            {pet.records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg group hover:bg-amber-100 transition">
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-24">
                    <div className="font-bold text-gray-800">{formatDate(record.grooming_date)}</div>
                    {record.record_number && (
                      <div className="text-xs text-gray-600 mt-1 flex items-center">
                        <Hash size={10} className="mr-1" />
                        {record.record_number}
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSizeBadgeColor(record.size)} whitespace-nowrap`}>
                    {record.size}
                  </span>
                  <div>
                    <div className="font-medium text-gray-800">{record.groomer}</div>
                    {record.hair_style && (
                      <div className="text-sm text-gray-600">{record.hair_style}</div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEditGroomingRecord(record)}
                    className="p-1 text-amber-600 hover:text-amber-800"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteGroomingRecord(record.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">No grooming records yet</div>
            <button
              onClick={() => onAddGroomingRecord(pet)}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Add the first record
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCard;