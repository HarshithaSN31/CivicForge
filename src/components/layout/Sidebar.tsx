import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  MapPin,
  BarChart3,
  Settings,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Sidebar: React.FC = () => {
  const { incidents, issues } = useData();
  const highPriorityCount = incidents.filter((i) => i.severity === 'HIGH' || i.severity === 'CRITICAL').length;
  const newReportsCount = issues.filter((i) => i.status === 'REPORTED' || i.status === 'UNDER_REVIEW').length;

  const navItems = [
    { label: 'Overview', path: '/authority', icon: LayoutDashboard },
    { label: 'Incidents Queue', path: '/authority/incidents', icon: Layers, badge: highPriorityCount > 0 ? highPriorityCount : undefined, badgeColor: 'bg-red-500' },
    { label: 'Citizen Reports', path: '/authority/reports', icon: Inbox, badge: newReportsCount > 0 ? newReportsCount : undefined, badgeColor: 'bg-amber-500' },
    { label: 'Civic GIS Map', path: '/authority/map', icon: MapPin },
    { label: 'Intelligence Analytics', path: '/authority/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-civic-navy text-slate-300 min-h-[calc(100vh-4rem)] border-r border-slate-800 flex flex-col justify-between hidden md:flex">
      <div className="p-4 space-y-6">
        {/* Authority Ops Header */}
        <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Authority Operations
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Civic response unit & incident triage
          </p>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1 font-sans text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/authority'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-civic-accent text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AWS Bedrock Engine
          </span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
            Active
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-normal">
          Multi-factor relationship engine online.
        </p>
      </div>
    </aside>
  );
};
