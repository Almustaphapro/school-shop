import React, { useState, useEffect } from 'react';
import { FiDownload, FiShoppingBag } from 'react-icons/fi';
import DateFilter from '../DateFilter';

const PurchaseHistoryTab = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample purchase data - in real app, this would come from Redux/API
  useEffect(() => {
    const samplePurchases = [
      { id: 1, date: '2024-03-01', item: 'School Uniform', amount: 15000, status: 'completed', paymentMethod: 'cash' },
      { id: 2, date: '2024-02-28', item: 'Mathematics Textbook', amount: 8500, status: 'completed', paymentMethod: 'transfer' },
      { id: 3, date: '2024-02-25', item: 'School Bag', amount: 12000, status: 'completed', paymentMethod: 'cash' },
      { id: 4, date: '2024-02-20', item: 'Science Kit', amount: 25000, status: 'pending', paymentMethod: 'card' },
      { id: 5, date: '2024-02-15', item: 'Exercise Books (Pack)', amount: 5000, status: 'completed', paymentMethod: 'cash' },
      { id: 6, date: '2024-02-10', item: 'Calculator', amount: 8000, status: 'completed', paymentMethod: 'transfer' },
      { id: 7, date: '2024-02-05', item: 'Sports Wear', amount: 18000, status: 'completed', paymentMethod: 'cash' },
      { id: 8, date: '2024-02-01', item: 'Laboratory Gown', amount: 12000, status: 'completed', paymentMethod: 'card' },
    ];
    setPurchases(samplePurchases);
    setFilteredPurchases(samplePurchases);
  }, []);

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredPurchases(purchases);
      return;
    }

    const filtered = purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      const start = startDate ? new Date(startDate) : new Date('2000-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      
      return purchaseDate >= start && purchaseDate <= end;
    });

    setFilteredPurchases(filtered);
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredPurchases(purchases);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Item', 'Amount', 'Payment Method', 'Status'];
    const csvData = filteredPurchases.map(p => [
      p.date,
      p.item,
      p.amount,
      p.paymentMethod,
      p.status
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchases-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate totals
  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);
  const completedTotal = filteredPurchases
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      {/* Header with Export */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Purchase History</h3>
        <button
          onClick={exportToCSV}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-blue-800">₦{totalAmount.toLocaleString()}</p>
          <p className="text-xs text-blue-500 mt-1">{filteredPurchases.length} purchases</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-800">₦{completedTotal.toLocaleString()}</p>
          <p className="text-xs text-green-500 mt-1">
            {filteredPurchases.filter(p => p.status === 'completed').length} transactions
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Average per Purchase</p>
          <p className="text-2xl font-bold text-purple-800">
            ₦{filteredPurchases.length > 0 ? Math.round(totalAmount / filteredPurchases.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <DateFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFilter={applyDateFilter}
        onReset={resetFilter}
      />

      {/* Purchases Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Item</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Payment</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <FiShoppingBag size={12} className="text-gray-400" />
                      <span>{purchase.date}</span>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{purchase.item}</td>
                  <td className="p-3 font-medium text-red-600">-₦{purchase.amount.toLocaleString()}</td>
                  <td className="p-3 capitalize">{purchase.paymentMethod}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      purchase.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No purchases found for the selected date range
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistoryTab;