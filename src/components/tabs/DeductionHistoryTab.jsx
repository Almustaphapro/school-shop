import React, { useState, useEffect, useMemo } from 'react';
import { FiDownload, FiCalendar } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import DateFilter from '../DateFilter';

const DeductionHistoryTab = ({ student }) => {
  const [filteredDeductions, setFilteredDeductions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get fresh student data from Redux
  const allStudents = useSelector((state) => state.students.students);
  const currentStudent = allStudents.find(s => s.id === student?.id);

  // Get deductions from transactions
  const deductions = useMemo(() => {
    if (!currentStudent?.transactions) return [];
    
    return currentStudent.transactions
      .filter(t => t.type === 'debit') // Only debits (withdrawals/purchases)
      .map((t, index) => ({
        id: t.id || `ded_${index}`,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.category || 'regular',
        status: 'completed',
        balance: t.balance
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
  }, [currentStudent]);

  useEffect(() => {
    setFilteredDeductions(deductions);
  }, [deductions]);

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredDeductions(deductions);
      return;
    }

    const filtered = deductions.filter(deduction => {
      const deductionDate = new Date(deduction.date);
      const start = startDate ? new Date(startDate) : new Date('2000-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      
      return deductionDate >= start && deductionDate <= end;
    });

    setFilteredDeductions(filtered);
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredDeductions(deductions);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Balance After'];
    const csvData = filteredDeductions.map(d => [
      d.date,
      d.description,
      d.amount,
      d.type === 'special' ? 'Special' : 'Regular',
      d.balance || 0
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deductions-${currentStudent?.name || 'student'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate totals
  const totalDeductions = filteredDeductions.reduce((sum, d) => sum + d.amount, 0);
  const regularTotal = filteredDeductions
    .filter(d => d.type === 'regular')
    .reduce((sum, d) => sum + d.amount, 0);
  const specialTotal = filteredDeductions
    .filter(d => d.type === 'special')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      {/* Header with Export */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Deduction History</h3>
        <button
          onClick={exportToCSV}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Total Deductions</p>
          <p className="text-2xl font-bold text-blue-800">₦{totalDeductions.toLocaleString()}</p>
          <p className="text-xs text-blue-500 mt-1">{filteredDeductions.length} transactions</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Regular Shopping</p>
          <p className="text-2xl font-bold text-green-800">₦{regularTotal.toLocaleString()}</p>
          <p className="text-xs text-green-500 mt-1">
            {filteredDeductions.filter(d => d.type === 'regular').length} purchases
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Special Shopping</p>
          <p className="text-2xl font-bold text-purple-800">₦{specialTotal.toLocaleString()}</p>
          <p className="text-xs text-purple-500 mt-1">
            {filteredDeductions.filter(d => d.type === 'special').length} deductions
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

      {/* Deductions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Description</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Type</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Balance After</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeductions.length > 0 ? (
              filteredDeductions.map((deduction) => (
                <tr key={deduction.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={12} className="text-gray-400" />
                      <span>{deduction.date}</span>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{deduction.description}</td>
                  <td className="p-3 font-medium text-red-600">-₦{deduction.amount.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deduction.type === 'special' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {deduction.type === 'special' ? 'Special' : 'Regular'}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-600">
                    ₦{(deduction.balance || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  {deductions.length === 0 ? (
                    <div>
                      <p className="mb-2">No deductions yet</p>
                      <p className="text-sm">Use the Special Shopping tab to make deductions</p>
                    </div>
                  ) : (
                    'No deductions found for the selected date range'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Running Balance Chart Suggestion */}
      {filteredDeductions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-bold">📊 Balance Trend:</span> Current balance is ₦{(currentStudent?.balance || 0).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default DeductionHistoryTab;