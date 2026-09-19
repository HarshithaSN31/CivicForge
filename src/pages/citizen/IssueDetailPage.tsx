import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { CivicMap } from '../../components/map/CivicMapAbstraction';
import {
  FileText,
  MapPin,
  Clock,
  Layers,
  CheckCircle2,
  Building2,
  ArrowLeft,
  ShieldCheck,
  User,
  Camera
} from 'lucide-react';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues, incidents, events } = useData();

  const issue = issues.find((i) => i.id === id);
  const incident = issue?.incidentId ? incidents.find((inc) => inc.id === issue.incidentId) : undefined;
  const issueEvents = events.filter((e) => e.issueId === id || (incident && e.incidentId === incident.id));

  if (!issue) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold text-civic-navy">Citizen Report Not Found</h2>
        <p className="text-xs text-slate-500">The requested report ID does not exist or has been removed.</p>
        <Button variant="outline" onClick={() => navigate('/my-reports')}>
          Back to My Reports
        </Button>
      </div>
    );
  }

  const statuses = ['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
  const currentStatusIdx = statuses.indexOf(issue.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-civic-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Info */}
      <div className="bg-white border border-civic-border rounded-xl p-6 shadow-civic space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report #{issue.id.slice(-6)}</span>
              <span className="text-xs font-semibold text-slate-500">• {new Date(issue.createdAt).toLocaleString()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-civic-navy tracking-tight">{issue.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge status={issue.status} size="md" />
            <Badge severity={issue.severity} size="md" />
          </div>
        </div>

        {/* Status Lifecycle Progress Tracker */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-civic-navy uppercase tracking-wider block mb-3">
            Resolution Lifecycle Status
          </span>
          <div className="grid grid-cols-5 gap-2 text-center">
            {statuses.map((st, idx) => {
              const isPassed = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              return (
                <div key={st} className="space-y-1">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-civic-accent ring-2 ring-blue-300'
                        : isPassed
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold block ${
                      isCurrent ? 'text-civic-navy font-bold' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Associated Incident */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Details & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                <FileText className="w-4 h-4 text-civic-accent" />
                Original Citizen Report Details
              </h3>
            </CardHeader>
            <CardBody className="space-y-4 text-xs text-civic-dark">
              <div>
                <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                  Description
                </span>
                <p className="mt-1 leading-relaxed text-sm text-slate-800 bg-slate-50 p-3 rounded border border-slate-200/80">
                  {issue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                    Category
                  </span>
                  <span className="font-bold text-civic-navy text-xs mt-0.5 block">{issue.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                    Assigned Department
                  </span>
                  <span className="font-bold text-civic-navy text-xs mt-0.5 block">{issue.department}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                  Reporter
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{issue.reporterName}</span>
                </div>
              </div>

              {/* Photo Evidence Matrix */}
              {issue.photoUrls.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px] mb-2 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> Photo Evidence (S3 Private Storage)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {issue.photoUrls.map((url, i) => (
                      <div key={i} className="border border-civic-border rounded-lg overflow-hidden bg-slate-900 shadow-xs">
                        <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-44 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Interactive Location Map */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                <MapPin className="w-4 h-4 text-civic-accent" />
                Reported Location
              </h3>
            </CardHeader>
            <CardBody className="p-0">
              <CivicMap
                center={[issue.location.latitude, issue.location.longitude]}
                zoom={14}
                className="h-64 w-full rounded-b-lg"
                markers={[
                  {
                    id: issue.id,
                    latitude: issue.location.latitude,
                    longitude: issue.location.longitude,
                    title: issue.title,
                    category: issue.category,
                    status: issue.status,
                    severity: issue.severity,
                  },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Associated Civic Incident + Audit Timeline */}
        <div className="space-y-6">
          {/* Associated Civic Incident Card */}
          {incident ? (
            <Card className="border-2 border-amber-300 bg-amber-50/40">
              <CardHeader className="bg-amber-100/80">
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-700" />
                    Possible Civic Incident
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                    AI confidence: {incident.aiConfidence}%
                  </span>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 text-xs">
                <h4 className="font-bold text-sm text-civic-navy">
                  <Link to={`/incident/${incident.id}`} className="hover:underline text-civic-accent">
                    Possible Civic Incident #{incident.incidentNumber}
                  </Link>
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">{incident.title}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-amber-200">
                  <span>{incident.reportIds.length} related reports</span>
                  <Badge status={incident.status} size="sm" />
                </div>
                <Link to={`/incident/${incident.id}`}>
                  <Button variant="secondary" size="sm" className="w-full mt-2">
                    View Civic Incident Details &rarr;
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="p-4 text-xs text-slate-500 space-y-2">
                <span className="font-bold text-civic-navy block">Incident Association Pending</span>
                <p>This report is currently being processed by the multi-factor relationship engine.</p>
              </CardBody>
            </Card>
          )}

          {/* Audit Event Timeline */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                <Clock className="w-4 h-4 text-civic-accent" />
                Audit Trail & History
              </h3>
            </CardHeader>
            <CardBody className="p-4 space-y-4">
              {issueEvents.length === 0 ? (
                <p className="text-xs text-slate-500">No events recorded yet.</p>
              ) : (
                <div className="relative pl-4 border-l-2 border-slate-200 space-y-4 text-xs">
                  {issueEvents.map((ev) => (
                    <div key={ev.id} className="relative group">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-civic-accent ring-4 ring-white" />
                      <div className="font-bold text-civic-navy">{ev.action}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{ev.actorName} ({ev.actorRole})</span>
                        <span>•</span>
                        <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {ev.note && (
                        <p className="mt-1 text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic text-[11px]">
                          "{ev.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
