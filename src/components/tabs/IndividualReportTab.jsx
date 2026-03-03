import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';
import DateFilter from '../DateFilter';

const IndividualReportTab = ({ student }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample transaction data
  useEffect(() => {
    const sampleTransactions = [
      { id: 1, date: '2024-03-01', description: 'Deposit', amount: 10000, type: 'credit' },
      { id: 2, date: '2024-02-28', description: 'School Uniform', amount: 15000, type: 'debit' },
      { id: 3, date: '2024-02-25', description: 'Deposit', amount: 20000, type: 'credit' },
      { id: 4, date: '2024-02-20', description: 'Mathematics Textbook', amount: 8500, type: 'debit' },
      { id: 5, date: '2024-02-15', description: 'Special Permission', amount: 5000, type: 'debit' },
      { id: 6, date: '2024-02-10', description: 'Deposit', amount: 15000, type: 'credit' },
      { id: 7, date: '2024-02-05', description: 'School Bag', amount: 12000, type: 'debit' },
      { id: 8, date: '2024-02-01', description: 'Deposit', amount: 8000, type: 'credit' },
    ];
    setTransactions(sampleTransactions);
    setFilteredTransactions(sampleTransactions);
  }, []);

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const start = startDate ? new Date(startDate) : new Date('2000-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      
      end.setHours(23, 59, 59, 999);
      
      return transactionDate >= start && transactionDate <= end;
    });

    setFilteredTransactions(filtered);
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredTransactions(transactions);
  };

  // Calculate totals
  const totalCredits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const netFlow = totalCredits - totalDebits;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Financial Report for {student?.name}</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Current Balance</p>
          <p className="text-2xl font-bold text-blue-800">₦{(student?.balance || 0).toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-green-800">₦{totalCredits.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 mb-1">Total Purchases</p>
          <p className="text-2xl font-bold text-red-800">₦{totalDebits.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg ${netFlow >= 0 ? 'bg-purple-50' : 'bg-orange-50'}`}>
          <p className={`text-sm ${netFlow >= 0 ? 'text-purple-600' : 'text-orange-600'} mb-1`}>
            Net Flow
          </p>
          <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-purple-800' : 'text-orange-800'}`}>
            ₦{netFlow.toLocaleString()}
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

      {/* Transaction History */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <FiTrendingUp className="text-blue-600" />
          Transaction History {startDate && endDate && `(${startDate} to ${endDate})`}
        </h4>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 px-3 border-b hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FiCalendar size={12} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{transaction.date}</span>
                  <span className="font-medium ml-2">{transaction.description}</span>
                </div>
                <span className={`font-medium ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected date range
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualReportTab;