import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiDollarSign, 
  FiShoppingBag,
  FiTrendingUp,
  FiDownload,
  FiFilter,
  FiUser,
  FiClock
} from 'react-icons/fi';
import DateFilter from '../components/DateFilter';

const MyTransactions = () => {
  const navigate = useNavigate();
  const allStudents = useSelector((state) => state.students.students);
  
  // Get current salesrep info (in a real app, this would come from auth)
  const salesrepName = "John Doe"; // This would come from Redux auth state
  const salesrepId = "SR001";
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'range', 'month'

  // Load transactions from localStorage
  useEffect(() => {
    // In a real app, this would fetch only transactions made by this salesrep
    const storedTransactions = localStorage.getItem('salesTransactions');
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Sample data for demonstration
      const sampleTransactions = generateSampleTransactions();
      setTransactions(sampleTransactions);
      localStorage.setItem('salesTransactions', JSON.stringify(sampleTransactions));
    }
  }, []);

  // Generate sample transactions for demonstration
  const generateSampleTransactions = () => {
    const today = new Date();
    const transactions = [];
    
    // Generate transactions for the last 7 days
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      
      const students = [
        { id: 1, name: 'Oluwaseun Okonkwo', studentId: 'STU0001' },
        { id: 2, name: 'Chiamaka Okafor', studentId: 'STU0002' },
        { id: 3, name: 'Emeka Bello', studentId: 'STU0003' },
        { id: 4, name: 'Aisha Abubakar', studentId: 'STU0004' },
        { id: 5, name: 'Yakubu Oluwaseun', studentId: 'STU0005' }
      ];
      
      const student = students[Math.floor(Math.random() * students.length)];
      
      const items = [
        { name: 'School Uniform', price: 15000 },
        { name: 'Mathematics Textbook', price: 8500 },
        { name: 'English Textbook', price: 7500 },
        { name: 'School Bag', price: 12000 },
        { name: 'Calculator', price: 8000 }
      ];
      
      const item = items[Math.floor(Math.random() * items.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;
      const total = item.price * quantity;
      
      transactions.push({
        id: `TRX${String(i + 1).padStart(3, '0')}`,
        date: date.toISOString().split('T')[0],
        time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        studentId: student.studentId,
        studentName: student.name,
        itemName: item.name,
        quantity: quantity,
        unitPrice: item.price,
        total: total,
        type: Math.random() > 0.7 ? 'special' : 'regular',
        paymentMethod: Math.random() > 0.5 ? 'cash' : 'transfer',
        status: 'completed',
        salesrepId: salesrepId,
        salesrepName: salesrepName
      });
    }
    
    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Filter transactions based on selected mode and dates
  useEffect(() => {
    let filtered = [...transactions];

    // Filter by date based on view mode
    if (viewMode === 'day') {
      filtered = filtered.filter(t => t.date === selectedDate);
    } else if (viewMode === 'range') {
      if (startDate || endDate) {
        filtered = filtered.filter(t => {
          const transactionDate = new Date(t.date);
          const start = startDate ? new Date(startDate) : new Date('2000-01-01');
          const end = endDate ? new Date(endDate) : new Date();
          end.setHours(23, 59, 59, 999);
          return transactionDate >= start && transactionDate <= end;
        });
      }
    } else if (viewMode === 'month') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    }

    // Filter by transaction type
    if (transactionType !== 'all') {
      filtered = filtered.filter(t => t.type === transactionType);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTransactions(filtered);
  }, [transactions, viewMode, selectedDate, startDate, endDate, transactionType]);

  // Calculate statistics
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageTransaction = totalTransactions > 0 ? Math.round(totalSales / totalTransactions) : 0;
  
  const cashTotal = filteredTransactions
    .filter(t => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.total, 0);
  
  const transferTotal = filteredTransactions
    .filter(t => t.paymentMethod === 'transfer')
    .reduce((sum, t) => sum + t.total, 0);

  const regularTotal = filteredTransactions
    .filter(t => t.type === 'regular')
    .reduce((sum, t) => sum + t.total, 0);
  
  const specialTotal = filteredTransactions
    .filter(t => t.type === 'special')
    .reduce((sum, t) => sum + t.total, 0);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = [
      'Date', 'Time', 'Student ID', 'Student Name', 'Item', 
      'Quantity', 'Unit Price', 'Total', 'Type', 'Payment Method', 'Status'
    ];
    
    const rows = filteredTransactions.map(t => [
      t.date,
      t.time,
      t.studentId,
      t.studentName,
      t.itemName,
      t.quantity,
      t.unitPrice,
      t.total,
      t.type === 'special' ? 'Special' : 'Regular',
      t.paymentMethod,
      t.status
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salesrep-transactions-${salesrepId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goBack = () => navigate(-1);

  // Get date display text
  const getDateDisplayText = () => {
    if (viewMode === 'day') {
      return `Transactions for ${selectedDate}`;
    } else if (viewMode === 'range') {
      if (startDate && endDate) {
        return `Transactions from ${startDate} to ${endDate}`;
      } else if (startDate) {
        return `Transactions from ${startDate}`;
      } else if (endDate) {
        return `Transactions up to ${endDate}`;
      }
      return 'All Transactions';
    } else if (viewMode === 'month') {
      return `Transactions for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`;
    }
    return 'Transactions';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Transaction Report</h1>
            <p className="text-sm text-gray-500 mt-1">
              Salesrep: {salesrepName} ({salesrepId})
            </p>
          </div>
        </div>
        
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiDownload /> Export Report
        </button>
      </div>

      {/* View Mode Selector */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily Report
          </button>
          <button
            onClick={() => setViewMode('range')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'range'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Date Range
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly Report
          </button>
        </div>
      </div>

      {/* Date Selection based on view mode */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {viewMode === 'day' && (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        {viewMode === 'range' && (
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onFilter={() => {}}
            onReset={() => {
              setStartDate('');
              setEndDate('');
            }}
          />
        )}

        {viewMode === 'month' && (
          <div className="text-center text-gray-600">
            <FiCalendar className="inline mr-2" />
            Showing all transactions for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
        )}

        {/* Transaction Type Filter */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Transaction Type
          </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full md:w-64 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Transactions</option>
            <option value="regular">Regular Sales</option>
            <option value="special">Special Shopping</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600">₦{totalSales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiDollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{getDateDisplayText()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-green-600">{totalTransactions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiShoppingBag className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{totalTransactions} sales</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Cash/Transfer</p>
              <p className="text-lg font-bold text-purple-600">₦{cashTotal.toLocaleString()} / ₦{transferTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiTrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Cash / Transfer breakdown</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Regular/Special</p>
              <p className="text-lg font-bold text-orange-600">₦{regularTotal.toLocaleString()} / ₦{specialTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiShoppingBag className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Regular / Special shopping</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Date/Time</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Student</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Item</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Qty</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Unit Price</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Total</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{transaction.date}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock size={10} /> {transaction.time}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{transaction.studentName}</p>
                        <p className="text-xs text-gray-500">{transaction.studentId}</p>
                      </div>
                    </td>
                    <td className="p-4">{transaction.itemName}</td>
                    <td className="p-4 text-center">{transaction.quantity}</td>
                    <td className="p-4">₦{transaction.unitPrice.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-green-600">₦{transaction.total.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'special' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type === 'special' ? 'Special' : 'Regular'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.paymentMethod === 'cash'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-gray-500">
                    <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Found</h3>
                    <p className="text-gray-500">
                      {viewMode === 'day' && `No transactions for ${selectedDate}`}
                      {viewMode === 'range' && 'No transactions in selected date range'}
                      {viewMode === 'month' && 'No transactions this month'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredTransactions.length} transactions
          </div>
          <div className="text-sm font-medium">
            Total: <span className="text-green-600 font-bold">₦{totalSales.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTransactions;