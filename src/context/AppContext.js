import React, { createContext, useReducer } from 'react';

// Initial State
const initialState = {
  isAuthenticated: false,
  user: null,
  locations: [],
  attendance: {
    clockInTime: null,
    clockOutTime: null,
  },
};

// Create Context
export const AppContext = createContext(initialState);

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [...state.locations, action.payload],
      };
    case 'CLOCK_IN':
      return {
        ...state,
        attendance: { ...state.attendance, clockInTime: action.payload },
      };
    case 'CLOCK_OUT':
      return {
        ...state,
        attendance: { ...state.attendance, clockOutTime: action.payload },
      };
    default:
      return state;
  }
};

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
