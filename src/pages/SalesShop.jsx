import React, { useState } from 'react';
import { searchStudents } from '../data/studentData';

function SalesShop() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearched(false);
      return;
    }

    const results = searchStudents(search);
    setSearchResults(results);
    setSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const viewStudentDetails = (student) => {
    alert(`
Student Details:
----------------
Name: ${student.name}
Student ID: ${student.studentId}
Class: ${student.class || "N/A"}
House: ${student.house}
Balance: ₦${student.balance.toLocaleString()}
Status: ${student.status ? "Active" : "Inactive"}
    `);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Shop</h1>

      {/* Search Student */}
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl mx-auto">
        <label className="block text-sm font-medium mb-2">
          Search Student by Name or ID
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter student name or ID (e.g., STU0001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="mt-6">
            {searchResults.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Found {searchResults.length} student(s)
                </p>
                <div className="space-y-2">
                  {searchResults.map((student) => (
                    <div 
                      key={student.id} 
                      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => viewStudentDetails(student)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            ID: {student.studentId} | House: {student.house}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₦{student.balance.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            student.status 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {student.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No students found matching "{search}"
              </div>
            )}
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-4 text-sm text-gray-500">
          <p className="font-medium mb-1">Search tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Search by Student ID: STU0001, STU0002, etc.</li>
            <li>Search by Name: Oluwaseun, Chiamaka, etc.</li>
            <li>Click on any result to view full details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SalesShop;