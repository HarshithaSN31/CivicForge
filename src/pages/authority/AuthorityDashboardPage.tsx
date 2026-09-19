import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CivicMap } from '../../components/map/CivicMapAbstraction';
import { generateCivicIntelligenceInsights } from '../../services/bedrockService';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  MapPin,
  TrendingUp,
  ArrowRight,
  Clock,
  Building2,
  Users
} from 'lucide-react';

export const AuthorityDashboardPage: React.FC = () => {
  const { incidents, issues } = useData();
  const navigate = useNavigate();

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');
  const highPriorityIncidents = incidents.filter((i) => (i.severity === 'HIGH' || i.severity === 'CRITICAL') && i.status !== 'RESOLVED');
  const newReports = issues.filter((i) => i.status === 'REPORTED' || i.status === 'UNDER_REVIEW');
  const resolvedThisWeek = incidents.filter((i) => i.status === 'RESOLVED').length;

  const aiInsights = generateCivicIntelligenceInsights(issues, incidents);

  const mapMarkers = incidents.map((inc) => ({
    id: inc.id,
    latitude: inc.primaryLocation.latitude,
    longitude: inc.primaryLocation.longitude,
    title: inc.title,
    category: inc.category,
    status: inc.status,
    severity: inc.severity,
    reportCount: inc.reportIds.length,
    isIncident: true,
  }));

  return (
    <div className="space-y-6">
      {/* Top Operations Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-civic-navy text-white p-6 rounded-xl shadow-civic">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <LayoutDashboard className="w-4 h-4" /> Operations Overview
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">Civic Intelligence Command Dashboard</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time incident triage, automated report clustering, and multi-department dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/authority/incidents">
            <Button variant="secondary" size="md" icon={<Layers className="w-4 h-4" />}>
              View Incidents Queue ({activeIncidents.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Incidents</p>
              <h3 className="text-2xl font-extrabold text-civic-navy mt-0.5">{activeIncidents.length}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Grouped from {issues.length} citizen reports</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-civic-accent flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">High Priority</p>
              <h3 className="text-2xl font-extrabold text-red-600 mt-0.5">{highPriorityIncidents.length}</h3>
              <p className="text-[10px] text-red-600 font-semibold mt-1">Requires immediate triage</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Citizen Reports</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{newReports.length}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Pending authority review</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resolved This Week</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-0.5">{resolvedThisWeek}</h3>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">+14% resolution velocity</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Incidents + GIS Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Incidents List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h2 className="text-base font-bold text-civic-navy flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Priority Civic Incidents Requiring Review
                </h2>
                <Link to="/authority/incidents" className="text-xs font-semibold text-civic-accent hover:underline">
                  View All ({incidents.length}) &rarr;
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0 divide-y divide-slate-100">
              {incidents.slice(0, 4).map((inc) => (
                <div key={inc.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Incident #{inc.incidentNumber}
                      </span>
                      <h3 className="font-bold text-sm text-civic-navy hover:text-civic-accent">
                        <Link to={`/incident/${inc.id}`}>{inc.title}</Link>
                      </h3>
                      <Badge status={inc.status} size="sm" />
                      <Badge severity={inc.severity} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {inc.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{inc.reportIds.length} related reports</span>
                      <span>AI confidence: {inc.aiConfidence}%</span>
                      <span>Dept: {inc.assignedDepartment}</span>
                    </div>
                  </div>

                  <Link to={`/incident/${inc.id}`} className="self-start sm:self-center">
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Inspect
                    </Button>
                  </Link>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Civic Hotspots GIS Map */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-civic-accent" />
                  Live Civic Incident Clusters & Hotspots Map
                </h3>
                <Link to="/authority/map" className="text-xs font-semibold text-civic-accent hover:underline">
                  Full GIS View &rarr;
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <CivicMap
                center={[37.7749, -122.4194]}
                zoom={13}
                className="h-72 w-full rounded-b-lg"
                markers={mapMarkers}
                onMarkerClick={(m) => navigate(`/incident/${m.id}`)}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right Column: AI Insights Drawer & Recent Citizen Queue */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <Card className="border-2 border-indigo-200 bg-indigo-50/40">
            <CardHeader className="bg-indigo-100/70">
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-700" />
                  Amazon Bedrock AI Insights
                </h3>
                <span className="text-[10px] font-bold text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  Real-time Prediction
                </span>
              </div>
            </CardHeader>
            <CardBody className="p-4 space-y-3 text-xs">
              <p className="text-[11px] text-indigo-900 font-semibold italic">
                Notice: AI-generated trends are predictive predictions derived from spatial-temporal clustering.
              </p>
              <div className="space-y-2">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-indigo-200 rounded-md text-slate-800 font-sans text-xs leading-relaxed shadow-2xs">
                    {insight}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Recent Unassigned Reports Queue */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                <Inbox className="w-4 h-4 text-civic-accent" />
                Recent Unassigned Citizen Reports
              </h3>
            </CardHeader>
            <CardBody className="p-0 divide-y divide-slate-100 text-xs">
              {issues.slice(0, 4).map((issue) => (
                <div key={issue.id} className="p-3.5 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <Link to={`/issue/${issue.id}`} className="font-bold text-civic-navy hover:underline truncate max-w-[180px]">
                      {issue.title}
                    </Link>
                    <Badge status={issue.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{issue.category}</span>
                    <span>{new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
