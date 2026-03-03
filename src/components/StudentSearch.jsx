import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StudentSearch = ({ searchTerm, onSearchChange, onSearch, filteredStudents, onSelectStudent }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <form onSubmit={onSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Search
        </button>
      </form>

      {/* Search Results Dropdown */}
      {searchTerm && filteredStudents.length > 0 && (
        <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center transition-colors"
            >
              <div 
                className="flex-1"
                onClick={() => {
                  onSelectStudent(student);
                  onSearchChange('');
                }}
              >
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-500">
                  ID: {student.studentId || student.id} | Class: {student.className} | House: {student.house}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/student-profile/${student.id}`);
                }}
                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
              >
                View Full Profile →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {searchTerm && filteredStudents.length === 0 && (
        <div className="mt-2 p-4 text-center text-gray-500 border border-gray-200 rounded-lg">
          No students found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default StudentSearch;