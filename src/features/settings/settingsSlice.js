import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  schoolName: "My School",
  topbarColor: "#1e293b",
  sidebarColor: "#0f172a",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    changeSchoolName: (state, action) => {
      state.schoolName = action.payload;
    },
  },
});

export const { changeSchoolName } = settingsSlice.actions;
export default settingsSlice.reducer;