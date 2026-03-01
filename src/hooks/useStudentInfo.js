import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { depositMoney, toggleStudentStatus, withdrawMoney } from '../features/students/studentSlice';

export const useStudentInfo = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleDeposit = (student) => {
    const amount = prompt("Enter deposit amount for " + student.name);
    if (!amount || isNaN(amount)) return;
    dispatch(depositMoney({ id: student.id, amount: Number(amount) }));
    alert(`₦${amount} deposited successfully!`);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (Number(withdrawAmount) > (selectedStudent.balance || 0)) {
      alert('Insufficient balance!');
      return;
    }

    dispatch(withdrawMoney({ 
      id: selectedStudent.id, 
      amount: Number(withdrawAmount),
      description: 'Manual withdrawal'
    }));
    
    alert(`Withdrawal of ₦${withdrawAmount} processed successfully!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const handleToggleStatus = (student) => {
    if (window.confirm(`Are you sure you want to ${student.status ? 'deactivate' : 'activate'} ${student.name}?`)) {
      dispatch(toggleStudentStatus(student.id));
    }
  };

  const handleSpecialDeduction = (amount, description) => {
    dispatch(withdrawMoney({ 
      id: selectedStudent.id, 
      amount: amount,
      description: description || 'Special shopping deduction (No limit)',
      isSpecial: true
    }));
    alert(`Special deduction of ₦${amount.toLocaleString()} processed successfully!`);
  };

  const selectStudent = (student) => {
    console.log('Selecting student:', student); // Debug log
    setSelectedStudent(student);
    setSearchTerm(''); // Clear search after selection
  };

  const clearSelectedStudent = () => {
    setSelectedStudent(null);
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    selectedStudent,
    setSelectedStudent,
    activeTab,
    setActiveTab,
    withdrawAmount,
    setWithdrawAmount,
    showWithdrawModal,
    setShowWithdrawModal,

    // Actions
    handleDeposit,
    handleWithdraw,
    handleToggleStatus,
    handleSpecialDeduction,
    selectStudent,
    clearSelectedStudent
  };
};