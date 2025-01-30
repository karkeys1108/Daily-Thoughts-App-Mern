import { createSlice } from "@reduxjs/toolkit";
const loggedInSlice = createSlice({
  name: "loggedIn",
  initialState: localStorage.getItem("isloggedinDairy")
    ? JSON.parse(localStorage.getItem("isloggedinDairy"))
    : false,
  reducers: {
    changeLoggedIn: (state, actions) => {
      const newState = actions.payload;
      localStorage.setItem("isloggedinDairy", JSON.stringify(newState));
      return newState;
    },
  },
});
export const { changeLoggedIn } = loggedInSlice.actions;
export default loggedInSlice.reducer;
