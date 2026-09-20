import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../ui/Alert';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuthority?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuthority = false }) => {
  const { currentUser, currentRole, isLoading, authError, isDemoMode } = useAuth();
  const location = useLocation();

  // 1. Loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-10 h-10 border-4 border-civic-navy border-t-civic-accent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-600">
          {isDemoMode ? 'Loading Local Demo Session...' : 'Verifying Amazon Cognito Session...'}
        </p>
      </div>
    );
  }

  // 2. Unauthenticated user -> Redirect immediately to /login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Auth Service Error Banner (Only shown if NOT in local demo mode)
  if (authError && !isDemoMode) {
    return (
      <div className="max-w-md mx-auto my-12 p-4">
        <Alert variant="danger" title="Authentication Service Notice">
          {authError}
        </Alert>
      </div>
    );
  }


  // 4. Role Authorization Guard: Non-Authority users accessing Municipal Authority routes
  if (requireAuthority && currentRole !== 'AUTHORITY' && currentUser.role !== 'AUTHORITY') {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-white rounded-xl shadow-lg border border-red-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          The Municipal Authority Portal is strictly restricted to verified authority accounts. Your authenticated account (<strong>{currentUser.email}</strong>) is registered as a Citizen.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <a
            href="/citizen"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-civic-navy text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            Return to Citizen Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
