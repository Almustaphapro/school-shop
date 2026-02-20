import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      id: "ST001",
      name: "John Doe",
      class: "JSS1A",
      balance: 5000,
      active: true,
    },
  ],
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    toggleStatus: (state, action) => {
      const student = state.list.find(
        (s) => s.id === action.payload
      );
      student.active = !student.active;
    },
  },
});

export const { toggleStatus } = studentSlice.actions;
export default studentSlice.reducer;