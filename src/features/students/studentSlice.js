import { createSlice } from "@reduxjs/toolkit";
import { studentData as initialData } from "../../data/studentData";

// Convert the static data object into an array for Redux
const initialStudents = Object.values(initialData).flat();

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: initialStudents,
    loading: false,
    error: null
  },
  reducers: {
    addStudent: (state, action) => {
      state.students.push(action.payload);
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
        student.balance = (student.balance || 0) + amount;
      }
    }
  }
});

export const { addStudent, updateStudent, toggleStudentStatus, depositMoney } = studentSlice.actions;
export default studentSlice.reducer;