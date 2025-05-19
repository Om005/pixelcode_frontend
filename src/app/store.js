import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "../features/fileSlicer";

export const store = configureStore({
  reducer: {
    fileSlicer: fileReducer,
  },
});
