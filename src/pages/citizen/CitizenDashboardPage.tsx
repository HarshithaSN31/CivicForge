import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MapPin,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const { issues, incidents } = useData();
  const { currentUser } = useAuth();

  // Filter reports belonging to this citizen or show all recent for demo
  const userIssues = issues.filter((i) => i.reporterId === currentUser.id || i.reporterId === 'user-citizen-1');

  const activeCount = userIssues.filter((i) => i.status === 'REPORTED' || i.status === 'UNDER_REVIEW').length;
  const inProgressCount = userIssues.filter((i) => i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS').length;
  const resolvedCount = userIssues.filter((i) => i.status === 'RESOLVED').length;

  const incidentMap = new Map<string, typeof incidents[0]>();
  incidents.forEach((inc) => incidentMap.set(inc.id, inc));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-civic-navy text-white p-6 rounded-xl shadow-civic">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track your submitted reports and view related civic incidents in your community.
          </p>
        </div>
        <Link to="/report">
          <Button variant="secondary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
            Report a Problem
          </Button>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Reports</p>
              <h3 className="text-2xl font-extrabold text-civic-navy mt-0.5">{activeCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
              <h3 className="text-2xl font-extrabold text-civic-navy mt-0.5">{inProgressCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-civic-accent flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</p>
              <h3 className="text-2xl font-extrabold text-civic-navy mt-0.5">{resolvedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Citizen Reports Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-base font-bold text-civic-navy flex items-center gap-2">
              <FileText className="w-4 h-4 text-civic-accent" />
              Recent Citizen Reports
            </h2>
            <Link to="/my-reports" className="text-xs font-semibold text-civic-accent hover:underline flex items-center gap-1">
              View All Reports &rarr;
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0 divide-y divide-slate-100">
          {userIssues.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm text-slate-500">You haven't submitted any civic reports yet.</p>
              <Link to="/report">
                <Button variant="primary" size="sm">Report a Civic Problem</Button>
              </Link>
            </div>
          ) : (
            userIssues.slice(0, 5).map((issue) => {
              const associatedIncident = issue.incidentId ? incidentMap.get(issue.incidentId) : undefined;
              const relatedCount = associatedIncident ? associatedIncident.reportIds.length : 1;

              return (
                <div key={issue.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-civic-navy hover:text-civic-accent">
                        <Link to={`/issue/${issue.id}`}>{issue.title}</Link>
                      </h3>
                      <Badge status={issue.status} size="sm" />
                      <Badge severity={issue.severity} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{issue.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {issue.location.address || 'Reported Location'}
                      </span>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Possible Civic Incident Association Badge */}
                    {associatedIncident && (
                      <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-amber-700" />
                        <span>
                          Grouped into Possible Incident #{associatedIncident.incidentNumber} ({relatedCount} related reports)
                        </span>
                        <span className="text-amber-700 font-normal">| AI confidence: {associatedIncident.aiConfidence}%</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/issue/${issue.id}`} className="self-start sm:self-center">
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Details
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </CardBody>
      </Card>
    </div>
  );
};
