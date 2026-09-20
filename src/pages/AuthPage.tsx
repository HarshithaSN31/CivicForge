import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Layers, Mail, Lock, User as UserIcon, Building2, Key, CheckCircle2, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'verify' | 'forgot-password';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser, verifyCode, loginUser, requestPasswordReset, confirmPasswordReset, needsConfirmation, unconfirmedEmail } = useAuth();

  // Determine initial mode from path or prop
  const pathMode = location.pathname.includes('register')
    ? 'register'
    : location.pathname.includes('verify')
    ? 'verify'
    : location.pathname.includes('forgot-password')
    ? 'forgot-password'
    : 'login';

  const mode = initialMode || pathMode;

  const [isSignUp, setIsSignUp] = useState(mode === 'register');
  const [isVerificationStep, setIsVerificationStep] = useState(mode === 'verify');
  const [isForgotPassword, setIsForgotPassword] = useState(mode === 'forgot-password');
  const [resetStep, setResetStep] = useState<'REQUEST' | 'CONFIRM'>('REQUEST');

  // Sync state if route mode changes
  useEffect(() => {
    if (mode === 'register') {
      setIsSignUp(true);
      setIsVerificationStep(false);
      setIsForgotPassword(false);
    } else if (mode === 'verify') {
      setIsVerificationStep(true);
      setIsSignUp(false);
      setIsForgotPassword(false);
    } else if (mode === 'forgot-password') {
      setIsForgotPassword(true);
      setIsSignUp(false);
      setIsVerificationStep(false);
    } else {
      setIsSignUp(false);
      setIsVerificationStep(false);
      setIsForgotPassword(false);
    }
  }, [mode]);

  // Form Fields
  const [email, setEmail] = useState(unconfirmedEmail || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [department, setDepartment] = useState('Road Infrastructure Division');
  const [verificationCode, setVerificationCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isForgotPassword) {
        if (resetStep === 'REQUEST') {
          await requestPasswordReset(email);
          setResetStep('CONFIRM');
          setSuccessMessage(`📧 A password reset code was sent by Amazon Cognito to ${email}.`);
        } else {
          await confirmPasswordReset(email, verificationCode, newPassword);
          setSuccessMessage('✅ Password reset successfully! You can now sign in with your new password.');
          setIsForgotPassword(false);
          setIsSignUp(false);
          navigate('/login');
        }
        return;
      }

      if (isVerificationStep || needsConfirmation) {
        const targetEmail = unconfirmedEmail || email;
        await verifyCode(targetEmail, verificationCode);
        setSuccessMessage('✅ Email verified successfully! Redirecting...');
        setTimeout(() => {
          navigate(role === 'AUTHORITY' ? '/authority' : '/citizen');
        }, 800);
        return;
      }

      if (isSignUp) {
        const res = await registerUser({
          email,
          password,
          name,
          role,
          city,
          state,
          department: role === 'AUTHORITY' ? department : undefined,
        });

        if (!res.isSignUpComplete) {
          setIsVerificationStep(true);
          setSuccessMessage(`📧 A verification code has been sent by Amazon Cognito to ${email}. Please enter it below to confirm your account.`);
        } else {
          setSuccessMessage('✅ Account registered successfully!');
          navigate(role === 'AUTHORITY' ? '/authority' : '/citizen');
        }
      } else {
        const user = await loginUser(email, password);
        setSuccessMessage(`Welcome back, ${user.name}!`);
        const redirectPath = (location.state as any)?.from?.pathname || (user.role === 'AUTHORITY' ? '/authority' : '/citizen');
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-civic-navy text-white flex items-center justify-center mx-auto shadow-md">
          <Layers className="w-6 h-6 text-civic-accent" />
        </div>
        <h1 className="text-2xl font-extrabold text-civic-navy tracking-tight">
          {isForgotPassword
            ? 'Reset Password'
            : isVerificationStep || needsConfirmation
            ? 'Verify Your Email'
            : isSignUp
            ? 'Register Amazon Cognito Account'
            : 'Sign In to CivicForge'}
        </h1>
        <p className="text-xs text-slate-500">
          Amazon Cognito User Pool Authentication • Strict Role & Owner Authorization
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Card>
        <form onSubmit={handleAuthSubmit}>
          <CardBody className="space-y-4 text-xs">
            {/* Password Reset Flow */}
            {isForgotPassword ? (
              <div className="space-y-3">
                {resetStep === 'REQUEST' ? (
                  <>
                    <Alert variant="info" title="Forgot Password">
                      Enter your registered email address to receive a password reset verification code.
                    </Alert>
                    <div className="space-y-1">
                      <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-civic-border rounded-md focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert variant="info" title="Enter Reset Code">
                      Check <strong>{email}</strong> for the 6-digit confirmation code.
                    </Alert>
                    <div>
                      <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px] mb-1">
                        Reset Code
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="123456"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-civic-border rounded-md font-mono text-center text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-civic-border rounded-md focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : isVerificationStep || needsConfirmation ? (
              <div className="space-y-3">
                <Alert variant="info" title="Verification Code Required">
                  Enter the 6-digit verification code sent to <strong>{unconfirmedEmail || email}</strong> by Amazon Cognito.
                </Alert>
                <div>
                  <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px] mb-1">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-civic-border rounded-md font-mono text-center text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Role Selection Tabs */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-civic-navy uppercase tracking-wider">
                    Select Access Role
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-md">
                    <button
                      type="button"
                      onClick={() => setRole('CITIZEN')}
                      className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                        role === 'CITIZEN' ? 'bg-civic-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Citizen / Volunteer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('AUTHORITY')}
                      className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                        role === 'AUTHORITY' ? 'bg-civic-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" /> Municipal Authority
                    </button>
                  </div>
                </div>

                {/* Registration Fields */}
                {isSignUp && (
                  <>
                    <div className="space-y-1">
                      <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Harshitha Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-civic-border rounded-md focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-1.5 border border-civic-border rounded-md bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-1.5 border border-civic-border rounded-md bg-white text-xs"
                        />
                      </div>
                    </div>

                    {role === 'AUTHORITY' && (
                      <div>
                        <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                          Department / Division
                        </label>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3 py-1.5 border border-civic-border rounded-md bg-white text-xs"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Email */}
                <div className="space-y-1">
                  <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-civic-border rounded-md focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                      Password <span className="text-red-500">*</span>
                    </label>
                    {!isSignUp && (
                      <Link to="/forgot-password" className="text-[10px] text-civic-accent font-semibold hover:underline">
                        Forgot Password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-civic-border rounded-md focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                    />
                  </div>
                </div>
              </>
            )}
          </CardBody>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              {isForgotPassword
                ? resetStep === 'REQUEST'
                  ? 'Send Reset Code'
                  : 'Submit New Password'
                : isVerificationStep || needsConfirmation
                ? 'Confirm Email & Sign In'
                : isSignUp
                ? 'Register Cognito Account'
                : `Sign In as ${role}`}
            </Button>

            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  navigate('/login');
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 w-full font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            ) : (
              !isVerificationStep &&
              !needsConfirmation && (
                <div className="flex flex-col gap-2 text-center w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      navigate(isSignUp ? '/login' : '/register');
                    }}
                    className="text-xs text-civic-accent font-semibold hover:underline"
                  >
                    {isSignUp ? 'Already registered? Sign In to Cognito' : "Don't have an account? Register new Cognito account"}
                  </button>
                </div>
              )
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;

