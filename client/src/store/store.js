import { configureStore } from "@reduxjs/toolkit";
import loggedInSlice from "./loginSlice"
const store = configureStore({
  reducer: {
    loggedIn: loggedInSlice,
  },
});
export default store;
