import React from 'react';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

const PurchaseFilters = ({ 
  searchTerm, 
  onSearchChange, 
  dateFilter, 
  onDateFilterChange,
  sortBy,
  onSortChange 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or purchase ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FiFilter className="text-gray-600" />
        </button>
        
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FiDownload className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseFilters;