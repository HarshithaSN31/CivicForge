import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Inbox, Search, Filter, Layers, ArrowRight, MapPin } from 'lucide-react';

export const AuthorityReportsPage: React.FC = () => {
  const { issues, incidents } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const incidentMap = new Map<string, typeof incidents[0]>();
  incidents.forEach((inc) => incidentMap.set(inc.id, inc));

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || issue.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-civic-navy tracking-tight">Citizen Reports Queue</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Searchable operations queue of all original citizen reports.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports by title, description, or citizen name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">REPORTED</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Reports Table / List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
              <Inbox className="w-4 h-4 text-civic-accent" />
              All Citizen Reports ({filteredIssues.length})
            </h3>
            <span className="text-xs text-slate-500 font-semibold">100% Original Reports Preserved</span>
          </div>
        </CardHeader>
        <CardBody className="p-0 divide-y divide-slate-100">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No reports found matching your query filters.
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const incident = issue.incidentId ? incidentMap.get(issue.incidentId) : undefined;
              return (
                <div key={issue.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-civic-navy hover:text-civic-accent">
                        <Link to={`/issue/${issue.id}`}>{issue.title}</Link>
                      </h4>
                      <Badge status={issue.status} size="sm" />
                      <Badge severity={issue.severity} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{issue.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {issue.location.address || 'Reported Location'}
                      </span>
                      <span>Reporter: {issue.reporterName}</span>
                      <span>Filed: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>

                    {incident && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold">
                        <Layers className="w-3 h-3 text-amber-700" />
                        <span>Grouped under Incident #{incident.incidentNumber} ({incident.aiConfidence}% confidence)</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/issue/${issue.id}`} className="self-start sm:self-center">
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Inspect
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
