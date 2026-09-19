import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Shield, Layers, Mail, Lock, User as UserIcon, Building2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchRole } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('sarah.jenkins@example.com');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('Sarah Jenkins');
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      await login(email, role);
      if (role === 'AUTHORITY') {
        navigate('/authority');
      } else {
        navigate('/citizen');
      }
    } catch (err: any) {
      setMessage(err.message || 'Authentication failed.');
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
          {isSignUp ? 'Create CivicForge Account' : 'Sign In to CivicForge'}
        </h1>
        <p className="text-xs text-slate-500">
          Amazon Cognito Authentication • Role-Based Access Control
        </p>
      </div>

      {message && <Alert variant="info">{message}</Alert>}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4 text-xs">
            {/* Role Selection Tabs */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-civic-navy uppercase tracking-wider">
                Select Portal Access Role
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-md">
                <button
                  type="button"
                  onClick={() => setRole('CITIZEN')}
                  className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'CITIZEN' ? 'bg-civic-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" /> Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setRole('AUTHORITY')}
                  className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                    role === 'AUTHORITY' ? 'bg-civic-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> Authority
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-civic-border rounded-md focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                Email Address
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

            <div className="space-y-1">
              <label className="block font-bold text-civic-navy uppercase tracking-wider text-[10px]">
                Password
              </label>
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
          </CardBody>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              {isSignUp ? 'Register Account' : `Sign In as ${role}`}
            </Button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-civic-accent font-semibold hover:underline text-center w-full"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register as Citizen/Authority'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
