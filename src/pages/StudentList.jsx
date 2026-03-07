import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiFilter, FiEye, FiUserPlus } from 'react-icons/fi';

const StudentList = () => {
  const navigate = useNavigate();
  const allStudents = useSelector((state) => state.students.students);
  
  // Debug: Log the entire first student and all available fields
  useEffect(() => {
    console.log('=== STUDENT LIST DEBUG ===');
    console.log('Total students:', allStudents.length);
    
    if (allStudents.length > 0) {
      console.log('First student (full object):', allStudents[0]);
      console.log('First student keys:', Object.keys(allStudents[0]));
      console.log('First student class value:', allStudents[0].class);
      console.log('First student className value:', allStudents[0].className);
      
      // Check a few more students
      console.log('Sample students:', allStudents.slice(0, 5).map(s => ({
        id: s.id,
        name: s.name,
        class: s.class,
        className: s.className,
        hasClass: 'class' in s,
        hasClassName: 'className' in s
      })));
    }
  }, [allStudents]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedHouse, setSelectedHouse] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Get unique classes for filter dropdown
  const classes = useMemo(() => {
    // Try both class and className fields
    const uniqueClasses = [...new Set(allStudents.map(s => s.class || s.className))];
    const filtered = uniqueClasses.filter(cls => cls && cls !== 'undefined' && cls !== 'null');
    console.log('Available classes for filter:', filtered);
    return filtered.sort();
  }, [allStudents]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    console.log('Filtering students with selectedClass:', selectedClass);
    
    let filtered = [...allStudents].map(student => ({
      ...student,
      // Ensure we have a displayClass value
      displayClass: student.class || student.className || 'Unknown'
    }));

    // Apply class filter
    if (selectedClass !== 'all') {
      filtered = filtered.filter(s => 
        (s.class === selectedClass) || 
        (s.className === selectedClass) ||
        (s.displayClass === selectedClass)
      );
    }

    // Apply house filter
    if (selectedHouse !== 'all') {
      filtered = filtered.filter(s => s.house === selectedHouse);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        (s.name || '').toLowerCase().includes(term) ||
        (s.studentId || '').toLowerCase().includes(term) ||
        (s.displayClass || '').toLowerCase().includes(term)
      );
    }

    // Apply sorting with null checks
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
      } 
      else if (sortBy === 'class') {
        const classA = a.displayClass || '';
        const classB = b.displayClass || '';
        return classA.localeCompare(classB);
      } 
      else if (sortBy === 'balance') {
        const balanceA = a.balance || 0;
        const balanceB = b.balance || 0;
        return balanceB - balanceA;
      } 
      else if (sortBy === 'status') {
        const statusA = a.status ? 1 : 0;
        const statusB = b.status ? 1 : 0;
        return statusB - statusA;
      }
      return 0;
    });

    console.log('Filtered students count:', filtered.length);
    if (filtered.length > 0) {
      console.log('First filtered student class:', filtered[0].displayClass);
    }

    return filtered;
  }, [allStudents, searchTerm, selectedClass, selectedHouse, sortBy]);

  // Get counts for summary
  const totalStudents = allStudents.length;
  const activeStudents = allStudents.filter(s => s.status).length;
  const totalBalance = allStudents.reduce((sum, s) => sum + (s.balance || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <button
          onClick={() => navigate('/admin/add-student')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FiUserPlus /> Add New Student
        </button>
      </div>

      {/* Debug Info - Remove after fixing */}
      <div className="bg-yellow-50 p-3 mb-4 rounded text-xs">
        <p>Debug: Classes available: {classes.join(', ') || 'None'}</p>
        <p>Selected class: {selectedClass}</p>
        <p>Students with class: {allStudents.filter(s => s.class || s.className).length} / {allStudents.length}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Active Students</p>
          <p className="text-2xl font-bold text-green-600">{activeStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold text-purple-600">₦{totalBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          {/* House Filter */}
          <select
            value={selectedHouse}
            onChange={(e) => setSelectedHouse(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Houses</option>
            <option value="Red">Red House</option>
            <option value="Blue">Blue House</option>
            <option value="Green">Green House</option>
            <option value="Yellow">Yellow House</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="class">Sort by Class</option>
            <option value="balance">Sort by Balance</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(selectedClass !== 'all' || selectedHouse !== 'all' || searchTerm) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <FiFilter size={14} />
            <span>Active filters:</span>
            {selectedClass !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Class: {selectedClass}
              </span>
            )}
            {selectedHouse !== 'all' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                House: {selectedHouse}
              </span>
            )}
            {searchTerm && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClass('all');
                setSelectedHouse('all');
              }}
              className="text-red-600 hover:text-red-800 text-xs ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-3 text-sm text-gray-600">
        Showing {filteredStudents.length} of {totalStudents} students
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Class</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">House</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Balance</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{student.studentId || student.id}</td>
                  <td className="p-3 font-medium">{student.name}</td>
                  <td className="p-3 font-medium text-blue-600">
                    {student.displayClass}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      student.house === "Red" ? "bg-red-100 text-red-800" :
                      student.house === "Blue" ? "bg-blue-100 text-blue-800" :
                      student.house === "Green" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {student.house || 'None'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 font-medium">₦{(student.balance || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/admin/student-profile/${student.id}`)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      title="View profile"
                    >
                      <FiEye size={16} />
                      <span className="text-sm">View</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No students found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => navigate('/admin/add-student')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
        >
          + Add New Student
        </button>
        <button
          onClick={() => navigate('/admin/promote-student')}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm"
        >
          Promote Students
        </button>
        <button
          onClick={() => navigate('/admin/student-info')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
        >
          Student Information
        </button>
      </div>
    </div>
  );
};

export default StudentList;