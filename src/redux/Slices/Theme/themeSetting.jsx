import { combineReducers } from 'redux';
import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isOpen: true,
};

const headerState = {
  text: "",
  path: ""
}

// Create slice
const itemsSlice = createSlice({
  name: "checkCondition",
  initialState,
  reducers: {
    // Add item action
    updateState(state, action) {
      state.isOpen = !state.isOpen;
    },
  },
});

// Create slice
const itemText = createSlice({
  name: "itemText",
  initialState: headerState,
  reducers: {
    // Add item action
    textState(state, action) {
      return {
        ...state,
        text: action.payload.text,
        path: action.payload.path
      }
    },
  },
});

// Combine reducers
const rootReducer = combineReducers({
  checkCondition: itemsSlice.reducer,
  itemText: itemText.reducer,
});

// Export actions and reducer
export const { updateState } = itemsSlice.actions;
export const { textState } = itemText.actions;
export default rootReducer;
