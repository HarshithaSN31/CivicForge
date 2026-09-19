import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/demoSeedData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isLoggedIn: boolean;
  isDemoMode: boolean;
  switchRole: (role: UserRole) => void;
  toggleDemoMode: (enabled: boolean) => void;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('CITIZEN');
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.citizen1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  useEffect(() => {
    // Synchronize active user when role switches in demo/dev mode
    if (currentRole === 'AUTHORITY') {
      setCurrentUser(DEMO_USERS.authority1);
    } else {
      setCurrentUser(DEMO_USERS.citizen1);
    }
  }, [currentRole]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const toggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
  };

  const login = async (email: string, role: UserRole) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0].replace('.', ' '),
      role,
      department: role === 'AUTHORITY' ? 'Civic Maintenance Division' : undefined,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    setCurrentRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn,
        isDemoMode,
        switchRole,
        toggleDemoMode,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
