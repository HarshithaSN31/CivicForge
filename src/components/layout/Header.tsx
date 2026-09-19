import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import {
  ShieldAlert,
  User as UserIcon,
  Bell,
  RefreshCw,
  PlusCircle,
  BarChart3,
  Map as MapIcon,
  FileText,
  CheckCircle2,
  ChevronDown,
  Layers,
  Database,
  Play
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, currentRole, switchRole, isDemoMode, toggleDemoMode } = useAuth();
  const { notifications, markNotificationRead, resetDemoData } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleToggle = () => {
    const nextRole = currentRole === 'CITIZEN' ? 'AUTHORITY' : 'CITIZEN';
    switchRole(nextRole);
    if (nextRole === 'AUTHORITY') {
      navigate('/authority');
    } else {
      navigate('/citizen');
    }
  };

  const handleResetDemo = () => {
    if (!isDemoMode) return;
    resetDemoData();
    alert('Seeded Demo dataset reset to initial 8-report narrative.');
  };

  return (
    <header className="sticky top-0 z-40 bg-civic-navy text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-civic-accent flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  CivicForge
                </span>
                <span className="hidden sm:block text-[11px] text-slate-300 font-medium tracking-wide">
                  Civic Intelligence Platform
                </span>
              </div>
            </Link>

            {/* Mode Indicator Badge */}
            <button
              onClick={() => toggleDemoMode(!isDemoMode)}
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title="Click to toggle between Production Database Mode and Seeded Demo Mode"
            >
              {isDemoMode ? (
                <>
                  <Play className="w-3 h-3 text-amber-400" /> Demo Mode Active (Seeded)
                </>
              ) : (
                <>
                  <Database className="w-3 h-3 text-emerald-400" /> Production Database Mode
                </>
              )}
            </button>
          </div>

          {/* Quick Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-200">
            {currentRole === 'CITIZEN' ? (
              <>
                <Link
                  to="/citizen"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/citizen' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/report"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/report' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Report Issue
                </Link>
                <Link
                  to="/my-reports"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/my-reports' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  My Reports
                </Link>
                <Link
                  to="/map"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/map' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Civic Map
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/authority"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/authority' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/authority/incidents"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname.startsWith('/authority/incidents') ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Incidents
                </Link>
                <Link
                  to="/authority/reports"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/authority/reports' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Reports Queue
                </Link>
                <Link
                  to="/authority/map"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/authority/map' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  GIS Intelligence
                </Link>
                <Link
                  to="/authority/analytics"
                  className={`px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/authority/analytics' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Analytics
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Demo Role Switcher Toggle */}
            <button
              onClick={handleRoleToggle}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-all"
              title="Switch role for portal inspection"
            >
              <RefreshCw className="w-3.5 h-3.5 text-civic-accent" />
              <span>Switch to {currentRole === 'CITIZEN' ? 'Authority' : 'Citizen'}</span>
            </button>

            {/* Reset Demo Data Button - ONLY ACTIVE IN DEMO MODE */}
            {isDemoMode && (
              <button
                onClick={handleResetDemo}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:text-white hover:bg-amber-800/60 bg-amber-900/40 rounded-md transition-colors border border-amber-700/50"
                title="Reset initial seed dataset for 3-minute demo replay"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                Reset Demo
              </button>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-semantic-red rounded-full ring-2 ring-civic-navy" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-civic-lg border border-civic-border overflow-hidden text-civic-dark z-50 animate-in fade-in duration-150">
                  <div className="p-3 border-b border-civic-border bg-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-civic-navy">
                      Notifications ({notifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs font-semibold text-semantic-blue">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-blue-50/40 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-civic-navy">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Info */}
            <div className="flex items-center pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:block ml-2 text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                {currentUser.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
