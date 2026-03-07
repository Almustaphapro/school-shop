import { createSlice } from "@reduxjs/toolkit";
import { studentData as initialData } from "../../data/studentData";

// Convert the static data object into an array for Redux
const initialStudents = Object.entries(initialData).flatMap(([className, students]) => 
  students.map(student => ({
    id: student.id,
    studentId: student.studentId,
    name: student.name,
    house: student.house,
    status: student.status,
    balance: student.balance,
    class: className,
    className: className,
    transactions: student.transactions || [
      {
        id: `txn_${Date.now()}_${student.id}`,
        date: new Date().toISOString().split('T')[0],
        type: 'credit',
        category: 'deposit',
        description: 'Initial balance',
        amount: student.balance || 0,
        balance: student.balance || 0,
        status: 'completed'
      }
    ]
  }))
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: initialStudents,
    loading: false,
    error: null
  },
  reducers: {
    addStudent: (state, action) => {
      const newStudent = {
        ...action.payload,
        class: action.payload.class || action.payload.className,
        className: action.payload.className || action.payload.class,
        transactions: [
          {
            id: `txn_${Date.now()}_${action.payload.id}`,
            date: new Date().toISOString().split('T')[0],
            type: 'credit',
            category: 'deposit',
            description: 'Initial deposit',
            amount: action.payload.balance || 0,
            balance: action.payload.balance || 0,
            status: 'completed'
          }
        ]
      };
      state.students.push(newStudent);
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
          balance: newBalance,
          status: 'completed'
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
          balance: newBalance,
          status: 'completed'
        });
      }
    }
  }
});

export const { 
  addStudent, 
  toggleStudentStatus, 
  depositMoney, 
  withdrawMoney 
} = studentSlice.actions;

export default studentSlice.reducer;