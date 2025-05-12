import React, { createContext, useContext } from 'react';

// Create a User Context
const UserContext = createContext(null);

// UserProvider component to wrap the app with the context
export const UserProvider = ({ children }) => {
  // Replace with actual user fetching logic, such as API or context state
  const user = { userName: 'Prem' }; 

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user context
export const useUser = () => {
  return useContext(UserContext);
};
