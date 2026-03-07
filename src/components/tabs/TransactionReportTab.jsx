import React, { useState, useMemo } from 'react';
import { FiDownload, FiCalendar, FiFilter, FiTrendingUp, FiShoppingBag, FiLock } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import DateFilter from '../DateFilter';

const TransactionReportTab = ({ student }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('all'); // all, deposits, purchases, special
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, highest, lowest

  // Get fresh student data from Redux
  const allStudents = useSelector((state) => state.students.students);
  const currentStudent = allStudents.find(s => s.id === student?.id);

  // Get all transactions
  const allTransactions = useMemo(() => {
    if (!currentStudent?.transactions) return [];
    
    return currentStudent.transactions
      .map((t, index) => ({
        id: t.id || `trans_${index}`,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type === 'credit' ? 'deposit' : (t.category || 'purchase'),
        category: t.category || (t.type === 'credit' ? 'deposit' : 'regular'),
        balance: t.balance,
        status: t.status || 'completed'
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [currentStudent]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Apply date filter
    if (startDate || endDate) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        const start = startDate ? new Date(startDate) : new Date('2000-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    // Apply transaction type filter
    if (transactionType !== 'all') {
      filtered = filtered.filter(t => {
        if (transactionType === 'deposits') return t.type === 'deposit';
        if (transactionType === 'purchases') return t.category === 'regular';
        if (transactionType === 'special') return t.category === 'special';
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortOrder === 'highest') return b.amount - a.amount;
      if (sortOrder === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return filtered;
  }, [allTransactions, startDate, endDate, transactionType, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDeposits = allTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPurchases = allTransactions
      .filter(t => t.category === 'regular')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSpecial = allTransactions
      .filter(t => t.category === 'special')
      .reduce((sum, t) => sum + t.amount, 0);

    const averageTransaction = allTransactions.length > 0
      ? Math.round(allTransactions.reduce((sum, t) => sum + t.amount, 0) / allTransactions.length)
      : 0;

    return {
      totalDeposits,
      totalPurchases,
      totalSpecial,
      totalTransactions: allTransactions.length,
      averageTransaction,
      currentBalance: currentStudent?.balance || 0
    };
  }, [allTransactions, currentStudent]);

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Amount', 'Balance After', 'Status'];
    const csvData = filteredTransactions.map(t => [
      t.date,
      t.description,
      t.category === 'special' ? 'Special' : (t.type === 'deposit' ? 'Deposit' : 'Purchase'),
      t.type === 'deposit' ? `+${t.amount}` : `-${t.amount}`,
      t.balance || 0,
      t.status
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${currentStudent?.name || 'student'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setTransactionType('all');
    setSortOrder('newest');
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Transaction Report</h3>
        <button
          onClick={exportToCSV}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Current Balance</p>
          <p className="text-2xl font-bold text-blue-800">₦{stats.currentBalance.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-green-800">₦{stats.totalDeposits.toLocaleString()}</p>
          <p className="text-xs text-green-500 mt-1">
            {allTransactions.filter(t => t.type === 'deposit').length} transactions
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-orange-600 mb-1">Regular Purchases</p>
          <p className="text-2xl font-bold text-orange-800">₦{stats.totalPurchases.toLocaleString()}</p>
          <p className="text-xs text-orange-500 mt-1">
            {allTransactions.filter(t => t.category === 'regular').length} purchases
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Special Shopping</p>
          <p className="text-2xl font-bold text-purple-800">₦{stats.totalSpecial.toLocaleString()}</p>
          <p className="text-xs text-purple-500 mt-1">
            {allTransactions.filter(t => t.category === 'special').length} deductions
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-600" />
          <h4 className="font-medium text-gray-700">Filter Transactions</h4>
        </div>

        {/* Date Filter */}
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onFilter={() => {}} // Apply is automatic through useMemo
          onReset={resetFilters}
        />

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Transaction Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="deposits">Deposits Only</option>
              <option value="purchases">Regular Purchases</option>
              <option value="special">Special Shopping</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(startDate || endDate || transactionType !== 'all') && (
          <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
            <span className="font-medium">Active filters:</span>
            {startDate && <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">From: {startDate}</span>}
            {endDate && <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">To: {endDate}</span>}
            {transactionType !== 'all' && (
              <span className="bg-purple-100 px-2 py-1 rounded-full text-xs">
                Type: {transactionType}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Type</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Balance</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={12} className="text-gray-400" />
                      <span>{transaction.date}</span>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{transaction.description}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                      transaction.category === 'special' 
                        ? 'bg-purple-100 text-purple-800'
                        : transaction.type === 'deposit'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.category === 'special' && <FiLock size={10} />}
                      {transaction.type === 'deposit' ? 'Deposit' : 
                       transaction.category === 'special' ? 'Special' : 'Purchase'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sm">₦{(transaction.balance || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  <FiShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-lg font-medium mb-1">No transactions found</p>
                  <p className="text-sm">Try adjusting your filters or make a deposit/purchase</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {filteredTransactions.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-blue-600" />
            <span className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {allTransactions.length} transactions
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Net Flow: </span>
            <span className={stats.totalDeposits - stats.totalPurchases - stats.totalSpecial >= 0 
              ? 'text-green-600' : 'text-red-600'}>
              ₦{(stats.totalDeposits - stats.totalPurchases - stats.totalSpecial).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionReportTab;