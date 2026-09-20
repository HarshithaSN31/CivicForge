import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, confirmSignUp, signIn, signOut, getCurrentUser, fetchUserAttributes, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { User, UserRole } from '../types';

interface SignUpInput {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  city?: string;
  state?: string;
  district?: string;
  department?: string;
}

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  isLoggedIn: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  needsConfirmation: boolean;
  unconfirmedEmail: string | null;
  authError: string | null;
  switchRole: (role: UserRole) => void;
  registerUser: (input: SignUpInput) => Promise<{ isSignUpComplete: boolean; nextStep: any }>;
  verifyCode: (email: string, code: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<User>;
  logoutUser: () => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<any>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AUTH_USER_KEY = 'civicforge_real_cognito_user';
const LOCAL_DEMO_USERS_KEY = 'civicforge_demo_registered_users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => currentUser?.role || 'CITIZEN');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [needsConfirmation, setNeedsConfirmation] = useState<boolean>(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const isUnconfiguredError = (err: any) => {
    if (!err) return false;
    const msg = (err.message || '').toLowerCase();
    const name = err.name || '';
    return (
      name === 'ResourceNotFoundException' ||
      msg.includes('userpool') ||
      msg.includes('user pool client') ||
      (msg.includes('client') && msg.includes('does not exist')) ||
      msg.includes('not configured') ||
      msg.includes('network') ||
      msg.includes('fetch')
    );
  };

  useEffect(() => {
    async function checkAuthSession() {
      try {
        const cognitoUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        const user: User = {
          id: cognitoUser.userId,
          email: attributes.email || '',
          name: attributes.name || attributes.email?.split('@')[0] || 'Registered User',
          role: (attributes['custom:role'] as UserRole) || 'CITIZEN',
          department: attributes['custom:department'],
          isVolunteer: true,
          volunteerStatus: 'ACTIVE',
          stats: {
            verifiedActivitiesCount: 0,
            volunteerHours: 0,
            tasksCompleted: 0,
            areasHelpedCount: 0,
            incidentsSupportedCount: 0,
            creditsReceivedCount: 0,
          },
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(user);
        setCurrentRole(user.role);
        setIsDemoMode(false);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        setAuthError(null);
      } catch (err: any) {
        if (err.name === 'UserUnauthenticatedException' || err.message?.includes('not authenticated')) {
          // Check if local demo session is active
          const saved = localStorage.getItem(AUTH_USER_KEY);
          if (saved) {
            try {
              const localUser = JSON.parse(saved);
              setCurrentUser(localUser);
              setCurrentRole(localUser.role);
              setIsDemoMode(true);
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        } else if (isUnconfiguredError(err)) {
          // AWS Cognito is unavailable/unconfigured -> Enable Local Demo Mode automatically
          setIsDemoMode(true);
          setAuthError(null);
          const saved = localStorage.getItem(AUTH_USER_KEY);
          if (saved) {
            try {
              const localUser = JSON.parse(saved);
              setCurrentUser(localUser);
              setCurrentRole(localUser.role);
            } catch {}
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthSession();
  }, []);

  const switchRole = (role: UserRole) => {
    if (role === 'AUTHORITY' && currentUser?.role !== 'AUTHORITY') {
      alert('🔒 Access Denied: Municipal Authority portal requires an authenticated Authority account.');
      return;
    }

    setCurrentRole(role);
    if (currentUser) {
      const updated: User = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    }
  };

  // Helper to read demo users from localStorage
  const getDemoUsers = (): any[] => {
    try {
      const raw = localStorage.getItem(LOCAL_DEMO_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Helper to save demo users to localStorage
  const saveDemoUsers = (users: any[]) => {
    localStorage.setItem(LOCAL_DEMO_USERS_KEY, JSON.stringify(users));
  };

  const registerUser = async (input: SignUpInput) => {
    // 1. Try AWS Cognito Registration first if not forced demo
    if (!isDemoMode) {
      try {
        const { isSignUpComplete, nextStep } = await signUp({
          username: input.email,
          password: input.password,
          options: {
            userAttributes: {
              email: input.email,
              name: input.name,
              'custom:role': input.role,
              ...(input.department ? { 'custom:department': input.department } : {}),
            },
          },
        });

        setUnconfirmedEmail(input.email);
        setNeedsConfirmation(!isSignUpComplete);

        const draftUser: User = {
          id: `usr-${Date.now()}`,
          email: input.email,
          name: input.name,
          role: input.role,
          city: input.city || 'Bengaluru',
          state: input.state || 'Karnataka',
          district: input.district || 'Bengaluru Urban',
          department: input.department,
          isVolunteer: input.role === 'CITIZEN' || input.role === 'VOLUNTEER',
          volunteerStatus: 'ACTIVE',
          stats: {
            verifiedActivitiesCount: 0,
            volunteerHours: 0,
            tasksCompleted: 0,
            areasHelpedCount: 0,
            incidentsSupportedCount: 0,
            creditsReceivedCount: 0,
          },
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(`draft_user_${input.email}`, JSON.stringify(draftUser));

        return { isSignUpComplete, nextStep };
      } catch (err: any) {
        if (err.name === 'UsernameExistsException') {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        if (err.name === 'InvalidParameterException' || err.message?.includes('password')) {
          throw new Error('Password must be at least 8 characters with numbers, symbols, uppercase and lowercase letters.');
        }
        if (!isUnconfiguredError(err)) {
          throw new Error(err.message || 'Registration failed.');
        }
        // Fallthrough to Local Demo Mode fallback on unconfigured Cognito
      }
    }

    // 2. LOCAL DEMO MODE FALLBACK REGISTRATION
    setIsDemoMode(true);
    const existingUsers = getDemoUsers();
    const existing = existingUsers.find((u) => u.email.toLowerCase() === input.email.toLowerCase());

    if (existing) {
      throw new Error('An account with this email already exists locally. Please sign in instead.');
    }

    const demoUser: User & { _password?: string } = {
      id: `usr-demo-${Date.now()}`,
      email: input.email,
      name: input.name,
      role: input.role,
      city: input.city || 'Bengaluru',
      state: input.state || 'Karnataka',
      district: input.district || 'Bengaluru Urban',
      department: input.department,
      isVolunteer: true,
      volunteerStatus: 'ACTIVE',
      stats: {
        verifiedActivitiesCount: 0,
        volunteerHours: 0,
        tasksCompleted: 0,
        areasHelpedCount: 0,
        incidentsSupportedCount: 0,
        creditsReceivedCount: 0,
      },
      createdAt: new Date().toISOString(),
      _password: input.password,
    };

    existingUsers.push(demoUser);
    saveDemoUsers(existingUsers);

    // Automatically sign in the registered demo user
    setCurrentUser(demoUser);
    setCurrentRole(demoUser.role);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));

    return { isSignUpComplete: true, nextStep: { signUpStep: 'DONE' } };
  };

  const verifyCode = async (email: string, code: string) => {
    if (isDemoMode) {
      setNeedsConfirmation(false);
      setUnconfirmedEmail(null);
      const draft = localStorage.getItem(`draft_user_${email}`);
      if (draft) {
        const user: User = JSON.parse(draft);
        setCurrentUser(user);
        setCurrentRole(user.role);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.removeItem(`draft_user_${email}`);
      }
      return;
    }

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      setNeedsConfirmation(false);
      setUnconfirmedEmail(null);

      const draft = localStorage.getItem(`draft_user_${email}`);
      if (draft) {
        const user: User = JSON.parse(draft);
        setCurrentUser(user);
        setCurrentRole(user.role);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.removeItem(`draft_user_${email}`);
      }
    } catch (err: any) {
      if (isUnconfiguredError(err)) {
        setIsDemoMode(true);
        setNeedsConfirmation(false);
        setUnconfirmedEmail(null);
        return;
      }
      throw new Error(err.message || 'Email verification failed. Please check the 6-digit code.');
    }
  };

  const loginUser = async (email: string, password: string): Promise<User> => {
    // 1. Try AWS Cognito Login first if not forced demo mode
    if (!isDemoMode) {
      try {
        const { isSignedIn, nextStep } = await signIn({
          username: email,
          password,
        });

        if (!isSignedIn && nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          setUnconfirmedEmail(email);
          setNeedsConfirmation(true);
          throw new Error('Please verify your email before signing in.');
        }

        let cognitoUser: any = null;
        let attributes: any = {};
        try {
          cognitoUser = await getCurrentUser();
          attributes = await fetchUserAttributes();
        } catch {}

        const draft = localStorage.getItem(`draft_user_${email}`);
        const draftUser = draft ? JSON.parse(draft) : null;

        const user: User = {
          id: cognitoUser?.userId || draftUser?.id || `usr-${Date.now()}`,
          email,
          name: attributes?.name || draftUser?.name || email.split('@')[0].replace(/[._]/g, ' '),
          role: (attributes?.['custom:role'] as UserRole) || draftUser?.role || 'CITIZEN',
          department: attributes?.['custom:department'] || draftUser?.department,
          city: draftUser?.city || 'Bengaluru',
          state: draftUser?.state || 'Karnataka',
          district: draftUser?.district || 'Bengaluru Urban',
          isVolunteer: true,
          volunteerStatus: 'ACTIVE',
          stats: {
            verifiedActivitiesCount: 0,
            volunteerHours: 0,
            tasksCompleted: 0,
            areasHelpedCount: 0,
            incidentsSupportedCount: 0,
            creditsReceivedCount: 0,
          },
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(user);
        setCurrentRole(user.role);
        setIsDemoMode(false);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return user;
      } catch (err: any) {
        if (err.name === 'UserNotFoundException' || err.message?.includes('User does not exist')) {
          throw new Error('Account not found. Please register first.');
        }
        if (err.name === 'NotAuthorizedException' || err.message?.includes('Incorrect username or password')) {
          throw new Error('Incorrect email or password.');
        }
        if (err.name === 'UserNotConfirmedException' || err.message?.includes('verify your email')) {
          setUnconfirmedEmail(email);
          setNeedsConfirmation(true);
          throw new Error('Please verify your email before signing in.');
        }
        if (!isUnconfiguredError(err)) {
          throw new Error(err.message || 'Authentication failed.');
        }
        // Fallthrough to Local Demo Mode login
      }
    }

    // 2. LOCAL DEMO MODE FALLBACK LOGIN
    setIsDemoMode(true);
    const existingUsers = getDemoUsers();
    const demoUser = existingUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!demoUser) {
      throw new Error('Account not found in local demo mode. Please register first.');
    }

    if (demoUser._password && demoUser._password !== password) {
      throw new Error('Incorrect email or password.');
    }

    setCurrentUser(demoUser);
    setCurrentRole(demoUser.role);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));
    return demoUser;
  };

  const logoutUser = async () => {
    try {
      await signOut();
    } catch {}
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const requestPasswordReset = async (email: string) => {
    if (isDemoMode) {
      return { nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' } };
    }
    try {
      const output = await resetPassword({ username: email });
      return output;
    } catch (err: any) {
      if (isUnconfiguredError(err)) {
        setIsDemoMode(true);
        return { nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' } };
      }
      throw new Error(err.message || 'Password reset request failed.');
    }
  };

  const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
    if (isDemoMode) {
      const users = getDemoUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user._password = newPassword;
        saveDemoUsers(users);
      }
      return;
    }
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (err: any) {
      if (isUnconfiguredError(err)) {
        setIsDemoMode(true);
        const users = getDemoUsers();
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          user._password = newPassword;
          saveDemoUsers(users);
        }
        return;
      }
      throw new Error(err.message || 'Failed to reset password. Please check the code.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn: !!currentUser,
        isLoading,
        isDemoMode,
        needsConfirmation,
        unconfirmedEmail,
        authError,
        switchRole,
        registerUser,
        verifyCode,
        loginUser,
        logoutUser,
        logout: logoutUser,
        requestPasswordReset,
        confirmPasswordReset,
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

