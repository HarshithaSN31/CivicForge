import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import {
  User as UserIcon,
  Bell,
  ChevronDown,
  Layers,
  HeartHandshake,
  Users,
  Trophy,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const { notifications, markNotificationRead, activities } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingActivitiesCount = activities.filter((a) => a.status === 'SUBMITTED_FOR_VERIFICATION').length;

  const handleRoleToggle = () => {
    const nextRole = currentRole === 'CITIZEN' ? 'AUTHORITY' : 'CITIZEN';
    switchRole(nextRole);
    if (nextRole === 'AUTHORITY') {
      navigate('/authority');
    } else {
      navigate('/citizen');
    }
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
                  CivicForge <span className="text-xs text-amber-400 font-extrabold">🇮🇳 INDIA</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-300 font-medium tracking-wide">
                  Civic Intelligence & Verified Action Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-medium text-slate-200">
            {currentRole === 'CITIZEN' ? (
              <>
                <Link
                  to="/citizen"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/citizen' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/report"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/report' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Report Issue
                </Link>
                <Link
                  to="/tasks"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 ${
                    location.pathname === '/tasks' || location.pathname === '/volunteer' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                  Volunteer Tasks
                </Link>
                <Link
                  to="/feed"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 ${
                    location.pathname === '/feed' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Community Feed
                </Link>
                <Link
                  to="/leaderboard"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 ${
                    location.pathname === '/leaderboard' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  Top Contributors
                </Link>
                <Link
                  to="/profile"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/profile' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/authority"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/authority' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/authority/incidents"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname.startsWith('/authority/incidents') ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Incidents
                </Link>
                <Link
                  to="/authority/reports"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/authority/reports' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  Citizen Reports
                </Link>
                <Link
                  to="/authority/verify-activities"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 ${
                    location.pathname === '/authority/verify-activities' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Verify Activities
                  {pendingActivitiesCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] bg-amber-500 text-slate-900 rounded-full font-bold">
                      {pendingActivitiesCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/authority/map"
                  className={`px-2.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800 transition-colors ${
                    location.pathname === '/authority/map' ? 'bg-slate-800 text-white font-semibold' : ''
                  }`}
                >
                  GIS Map
                </Link>
              </>
            )}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-civic-navy" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-civic-border text-slate-800 z-50 overflow-hidden text-xs">
                  <div className="p-3 bg-slate-50 border-b border-civic-border flex justify-between items-center font-bold">
                    <span>Notifications ({unreadCount} new)</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-slate-500 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-slate-500 text-xs">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 cursor-pointer hover:bg-slate-50 ${
                            !notif.read ? 'bg-blue-50/50 font-medium' : ''
                          }`}
                        >
                          <div className="font-bold text-civic-navy flex items-center justify-between">
                            <span>{notif.title}</span>
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-civic-accent" />}
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{notif.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={handleRoleToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors shadow-xs"
              title="Toggle view between Citizen and Authority"
            >
              <UserIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* User Account / Logout */}
            {currentUser ? (
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Log Out of Amazon Cognito"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Sign In / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
