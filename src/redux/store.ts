// store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import folderReducer from "./slices/folders";  // Import the default export here
import workspacesReducer from "./slices/workspaces"; // Same for Workspaces
import { TypedUseSelectorHook, useSelector } from "react-redux";

const rootReducer = combineReducers({
  folderReducer, // Assign the folderReducer to the "Folder" state key
  workspacesReducer, // Assign the workspacesReducer to the "Workspaces" state key
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;

// Optionally, export a custom useSelector hook

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
