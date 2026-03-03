import { createSlice } from "@reduxjs/toolkit";
import { studentData as initialData } from "../../data/studentData";

// Convert the static data object into an array for Redux
const initialStudents = Object.values(initialData).flat();

// Add transaction history to each student
const studentsWithHistory = initialStudents.map(student => ({
  ...student,
  transactions: student.transactions || [
    // Sample transactions for existing students
    { 
      id: `txn_${Date.now()}_1`, 
      date: new Date().toISOString().split('T')[0], 
      type: 'deposit', 
      description: 'Initial balance', 
      amount: student.balance || 0,
      balance: student.balance || 0
    }
  ]
}));

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: studentsWithHistory,
    loading: false,
    error: null
  },
  reducers: {
    addStudent: (state, action) => {
      const newStudent = {
        ...action.payload,
        transactions: [
          {
            id: `txn_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'deposit',
            description: 'Initial deposit',
            amount: action.payload.balance || 0,
            balance: action.payload.balance || 0
          }
        ]
      };
      state.students.push(newStudent);
    },
    
    updateStudent: (state, action) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    
    toggleStudentStatus: (state, action) => {
      const student = state.students.find(s => s.id === action.payload);
      if (student) {
        student.status = !student.status;
      }
    },
    
    depositMoney: (state, action) => {
      const { id, amount } = action.payload;
      const student = state.students.find(s => s.id === id);
      if (student) {
        const newBalance = (student.balance || 0) + amount;
        student.balance = newBalance;
        
        // Add transaction record
        if (!student.transactions) student.transactions = [];
        student.transactions.push({
          id: `txn_${Date.now()}_${student.transactions.length}`,
          date: new Date().toISOString().split('T')[0],
          type: 'credit',
          category: 'deposit',
          description: 'Deposit',
          amount: amount,
          balance: newBalance
        });
      }
    },
    
    withdrawMoney: (state, action) => {
      const { id, amount, description, isSpecial } = action.payload;
      const student = state.students.find(s => s.id === id);
      if (student) {
        const newBalance = (student.balance || 0) - amount;
        student.balance = newBalance;
        
        // Add transaction record
        if (!student.transactions) student.transactions = [];
        student.transactions.push({
          id: `txn_${Date.now()}_${student.transactions.length}`,
          date: new Date().toISOString().split('T')[0],
          type: 'debit',
          category: isSpecial ? 'special' : 'regular',
          description: description || (isSpecial ? 'Special shopping' : 'Purchase'),
          amount: amount,
          balance: newBalance
        });
      }
    }
  }
});

export const { 
  addStudent, 
  updateStudent, 
  toggleStudentStatus, 
  depositMoney, 
  withdrawMoney 
} = studentSlice.actions;

export default studentSlice.reducer;