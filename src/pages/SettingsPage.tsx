import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { User, Settings, ShieldCheck, Bell, Cpu, Cloud } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, currentRole, switchRole } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-civic-navy tracking-tight">Account & System Settings</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          User profile, active AWS services status, and notification preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
            <User className="w-4 h-4 text-civic-accent" /> Profile & Role Information
          </h3>
        </CardHeader>
        <CardBody className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Name</span>
              <span className="font-bold text-civic-navy text-sm mt-0.5 block">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Email</span>
              <span className="font-bold text-civic-navy text-sm mt-0.5 block">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Active Role</span>
              <div className="mt-1">
                <Badge variant={currentRole === 'AUTHORITY' ? 'amber' : 'blue'} size="sm">
                  {currentRole}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Department</span>
              <span className="font-bold text-civic-navy text-sm mt-0.5 block">
                {currentUser.department || 'Citizen Member'}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Cloud & AWS Architecture Status */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
            <Cloud className="w-4 h-4 text-civic-accent" /> AWS Cloud Stack Status
          </h3>
        </CardHeader>
        <CardBody className="p-5 space-y-3 text-xs">
          <div className="p-3 bg-slate-50 border rounded-md flex justify-between items-center">
            <div>
              <span className="font-bold text-civic-navy block">Amazon Cognito User Pool</span>
              <span className="text-[10px] text-slate-500">JWT Token Auth & Role-Based Access Control</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Active</span>
          </div>

          <div className="p-3 bg-slate-50 border rounded-md flex justify-between items-center">
            <div>
              <span className="font-bold text-civic-navy block">Amazon Bedrock AI Engine</span>
              <span className="text-[10px] text-slate-500">Claude 3 Haiku Model JSON Processing</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Active</span>
          </div>

          <div className="p-3 bg-slate-50 border rounded-md flex justify-between items-center">
            <div>
              <span className="font-bold text-civic-navy block">Amazon DynamoDB Data Tables</span>
              <span className="text-[10px] text-slate-500">Amplify Data GraphQL Engine</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Active</span>
          </div>

          <div className="p-3 bg-slate-50 border rounded-md flex justify-between items-center">
            <div>
              <span className="font-bold text-civic-navy block">Amazon S3 Storage Bucket</span>
              <span className="text-[10px] text-slate-500">Private Photo Evidence Uploads</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Active</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
