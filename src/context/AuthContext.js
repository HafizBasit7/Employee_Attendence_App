import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  role: 'user',
  setRole: (_role) => {},
});

export function AuthProvider({ children }) {
  const [role, setRole] = useState('user');

  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


