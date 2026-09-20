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
  PlusCircle,
  MapPin,
  Layers,
  ArrowRight,
  HeartHandshake,
  Users,
  ShieldCheck
} from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const { issues, incidents, tasks, applications, getTaskCapacityStats } = useData();
  const { currentUser } = useAuth();

  const userIssues = issues.filter((i) => currentUser && i.reporterId === currentUser.id);
  const myApplications = applications.filter((a) => currentUser && a.userId === currentUser.id && a.status !== 'CANCELLED' && a.status !== 'DECLINED');

  const activeCount = userIssues.filter((i) => i.status === 'REPORTED' || i.status === 'UNDER_REVIEW').length;
  const availableTasksCount = tasks.filter((t) => t.enrolledVolunteersCount < t.volunteersNeeded).length;
  const joinedTasksCount = myApplications.length;

  const incidentMap = new Map<string, typeof incidents[0]>();
  incidents.forEach((inc) => incidentMap.set(inc.id, inc));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-civic-navy text-white p-6 rounded-xl shadow-civic">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {currentUser?.name || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track your submitted reports, view volunteer tasks, and support municipal action in your ward.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/report">
            <Button variant="secondary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
              Report Issue
            </Button>
          </Link>
          <Link to="/tasks">
            <Button variant="primary" size="md" icon={<HeartHandshake className="w-4 h-4" />}>
              Volunteer Tasks
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Reported Issues</p>
              <h3 className="text-2xl font-extrabold text-civic-navy mt-0.5">{userIssues.length}</h3>
              <span className="text-[11px] text-amber-600 font-medium">{activeCount} active reports</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks Available</p>
              <h3 className="text-2xl font-extrabold text-civic-navy mt-0.5">{availableTasksCount}</h3>
              <span className="text-[11px] text-blue-600 font-medium">Open for volunteers</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-civic-accent flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks I Joined</p>
              <h3 className="text-2xl font-extrabold text-civic-navy mt-0.5">{joinedTasksCount}</h3>
              <span className="text-[11px] text-emerald-600 font-medium">Active volunteer actions</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Section 1: Tasks I Joined */}
      {myApplications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <h2 className="text-base font-bold text-civic-navy flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tasks I Joined ({myApplications.length})
              </h2>
              <Link to="/tasks" className="text-xs font-semibold text-civic-accent hover:underline">
                View All Tasks &rarr;
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-slate-100">
            {myApplications.map((app) => {
              const task = tasks.find((t) => t.id === app.taskId);
              const capacity = task ? getTaskCapacityStats(task.id) : null;
              return (
                <div key={app.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-civic-navy">{app.taskTitle}</h3>
                      <Badge variant="green" size="sm">Joined ✓</Badge>
                    </div>
                    {capacity && (
                      <div className="flex items-center gap-3 text-slate-600 font-medium text-[11px]">
                        <span>👥 <strong>{capacity.registered} / {capacity.needed}</strong> volunteers joined</span>
                        <span>📍 {task?.location.city || 'Bengaluru'}</span>
                      </div>
                    )}
                  </div>
                  <Link to="/tasks">
                    <Button variant="outline" size="sm">View Task Details</Button>
                  </Link>
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}

      {/* Section 2: Volunteer Tasks Available */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-base font-bold text-civic-navy flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-500" />
              Volunteer Tasks Available ({tasks.length})
            </h2>
            <Link to="/tasks" className="text-xs font-semibold text-civic-accent hover:underline">
              Browse All Tasks &rarr;
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0 divide-y divide-slate-100">
          {tasks.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">No volunteer tasks posted yet.</div>
          ) : (
            tasks.slice(0, 4).map((task) => {
              const capacity = getTaskCapacityStats(task.id);
              const isUserJoined = myApplications.some((a) => a.taskId === task.id);
              return (
                <div key={task.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-civic-navy">{task.title}</h3>
                      <Badge variant={capacity.isFull ? 'red' : 'blue'} size="sm">
                        {task.workType}
                      </Badge>
                    </div>
                    <p className="text-slate-600 line-clamp-1 text-xs">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
                      <span>📍 {task.location.formattedAddress || `${task.location.city}, ${task.location.state}`}</span>
                      <span className="font-extrabold text-civic-navy">
                        👥 {capacity.registered} / {capacity.needed} volunteers joined
                      </span>
                    </div>
                  </div>
                  <Link to="/tasks">
                    <Button variant={isUserJoined ? 'outline' : 'primary'} size="sm">
                      {isUserJoined ? 'Joined ✓' : capacity.isFull ? 'Volunteers Full' : 'Join Task'}
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </CardBody>
      </Card>

      {/* Section 3: My Reported Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-base font-bold text-civic-navy flex items-center gap-2">
              <FileText className="w-4 h-4 text-civic-accent" />
              My Reported Issues ({userIssues.length})
            </h2>
            <Link to="/my-reports" className="text-xs font-semibold text-civic-accent hover:underline flex items-center gap-1">
              View All Reports &rarr;
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0 divide-y divide-slate-100">
          {userIssues.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm text-slate-500">No complaints submitted yet.</p>
              <Link to="/report">
                <Button variant="primary" size="sm">Report a Civic Problem</Button>
              </Link>
            </div>
          ) : (
            userIssues.slice(0, 5).map((issue) => {
              const associatedIncident = issue.incidentId ? incidentMap.get(issue.incidentId) : undefined;
              const relatedCount = associatedIncident ? associatedIncident.reportIds.length : 1;
              const vNeeded = issue.volunteersNeeded || 2;
              const vJoined = issue.volunteersJoined || 0;

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

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="font-semibold text-slate-700">{issue.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {issue.location.address || issue.location.formattedAddress || 'Reported Location'}
                      </span>
                      <span className="font-bold text-emerald-700">
                        👥 {vJoined} / {vNeeded} volunteers joined
                      </span>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>

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

