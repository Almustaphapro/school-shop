import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiPlus, FiDollarSign, FiCalendar, FiPackage, FiTrendingUp } from 'react-icons/fi';

// Import components
import PurchaseStatsCard from '../components/PurchaseStatsCard';
import PurchaseFilters from '../components/PurchaseFilters';
import PurchaseTable from '../components/PurchaseTable';
import AddPurchaseModal from '../components/AddPurchaseModal';
import { usePurchases } from '../hooks/usePurchases';

const MyPurchase = () => {
  const navigate = useNavigate();
  const allStudents = useSelector((state) => state.students.students);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const {
    purchases,
    stats,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    addPurchase
  } = usePurchases();

  // Shop items data
  const shopItems = [
    { id: 1, name: 'School Uniform', price: 15000, category: 'Uniform' },
    { id: 2, name: 'Mathematics Textbook', price: 8500, category: 'Books' },
    { id: 3, name: 'English Textbook', price: 7500, category: 'Books' },
    { id: 4, name: 'Science Kit', price: 25000, category: 'Supplies' },
    { id: 5, name: 'School Bag', price: 12000, category: 'Accessories' },
    { id: 6, name: 'Calculator', price: 8000, category: 'Supplies' },
    { id: 7, name: 'Exercise Books (Pack)', price: 5000, category: 'Books' },
    { id: 8, name: 'Pencil Case', price: 3500, category: 'Accessories' },
    { id: 9, name: 'Sports Wear', price: 18000, category: 'Uniform' },
    { id: 10, name: 'Laboratory Gown', price: 12000, category: 'Uniform' },
  ];

  const handleAddPurchase = (newPurchase) => {
    addPurchase(newPurchase);
    setShowAddModal(false);
    alert('Purchase added successfully!');
  };

  const handleViewDetails = (purchase) => {
    alert(`Purchase Details:\n\nID: ${purchase.id}\nStudent: ${purchase.studentName}\nTotal: ₦${purchase.totalAmount.toLocaleString()}\nDate: ${purchase.date}`);
  };

  const goBack = () => navigate(-1);

  const statsConfig = [
    { title: 'Total Spending', value: `₦${stats.totalSpending.toLocaleString()}`, icon: <FiDollarSign size={24} />, color: 'blue', subtitle: 'All time purchases' },
    { title: 'This Month', value: `₦${stats.thisMonthSpending.toLocaleString()}`, icon: <FiCalendar size={24} />, color: 'green', subtitle: new Date().toLocaleString('default', { month: 'long' }) },
    { title: 'Total Purchases', value: stats.totalPurchases, icon: <FiPackage size={24} />, color: 'purple', subtitle: `${purchases.length} shown` },
    { title: 'Average', value: `₦${stats.averagePerPurchase.toLocaleString()}`, icon: <FiTrendingUp size={24} />, color: 'orange', subtitle: 'Per purchase' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full">
            <FiArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Purchase</h1>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> Add New Purchase
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {statsConfig.map((stat, index) => (
          <PurchaseStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <PurchaseFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Purchases Table */}
      <PurchaseTable
        purchases={purchases}
        onViewDetails={handleViewDetails}
        onAddNew={() => setShowAddModal(true)}
      />

      {/* Add Purchase Modal */}
      <AddPurchaseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPurchase}
        students={allStudents}
        shopItems={shopItems}
      />
    </div>
  );
};

export default MyPurchase;