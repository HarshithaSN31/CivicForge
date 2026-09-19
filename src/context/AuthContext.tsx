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

const LOCAL_STORAGE_USER_KEY = 'civicforge_auth_user';
const LOCAL_STORAGE_DEMO_KEY = 'civicforge_demo_mode';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial demo mode state (defaults to false for Real Production Database Mode)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_DEMO_KEY);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('CITIZEN');
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (isDemoMode) return DEMO_USERS.citizen1;
    const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch {}
    }
    return {
      id: 'prod-user-default',
      email: 'citizen@community.org',
      name: 'Registered Citizen',
      role: 'CITIZEN',
      createdAt: new Date().toISOString(),
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, JSON.stringify(isDemoMode));
    if (isDemoMode) {
      if (currentRole === 'AUTHORITY') setCurrentUser(DEMO_USERS.authority1);
      else setCurrentUser(DEMO_USERS.citizen1);
    } else {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
    }
  }, [isDemoMode, currentRole]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (!isDemoMode) {
      const updatedUser = {
        ...currentUser,
        role,
        department: role === 'AUTHORITY' ? (currentUser.department || 'Civic Response Division') : undefined,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const toggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    if (!enabled) {
      // Transitioning to Production Mode -> ensure clean production user
      const prodUser: User = {
        id: `user-prod-${Date.now()}`,
        email: 'citizen@community.org',
        name: 'Registered Citizen',
        role: currentRole,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(prodUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(prodUser));
    }
  };

  const login = async (email: string, role: UserRole) => {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0].replace('.', ' '),
      role,
      department: role === 'AUTHORITY' ? 'Civic Response Division' : undefined,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setCurrentRole(role);
    setIsLoggedIn(true);
    if (!isDemoMode) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    if (!isDemoMode) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
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
