import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Layers, Search, Filter, ArrowRight, Building2, Users } from 'lucide-react';

export const AuthorityIncidentsPage: React.FC = () => {
  const { incidents } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.assignedDepartment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSev = selectedSeverity === 'ALL' || inc.severity === selectedSeverity;
    return matchesSearch && matchesSev;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-civic-navy tracking-tight">Possible Civic Incidents</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Grouped civic incidents automatically clustered by distance, category, text similarity, and time window.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search incidents by title, summary, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Incidents Table / List */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
            <Layers className="w-4 h-4 text-civic-accent" />
            Grouped Civic Incidents ({filteredIncidents.length})
          </h3>
        </CardHeader>
        <CardBody className="p-0 divide-y divide-slate-100">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No civic incidents found matching your query filters.
            </div>
          ) : (
            filteredIncidents.map((inc) => (
              <div key={inc.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Possible Incident #{inc.incidentNumber}
                    </span>
                    <h3 className="font-bold text-base text-civic-navy hover:text-civic-accent">
                      <Link to={`/incident/${inc.id}`}>{inc.title}</Link>
                    </h3>
                    <Badge status={inc.status} size="sm" />
                    <Badge severity={inc.severity} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {inc.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{inc.category}</span>
                    <span>AI confidence: {inc.aiConfidence}%</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {inc.assignedDepartment}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {inc.reportIds.length} related reports ({inc.affectedCitizensCount} citizens)
                    </span>
                  </div>
                </div>

                <Link to={`/incident/${inc.id}`} className="self-start sm:self-center">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Inspect Incident &rarr;
                  </Button>
                </Link>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
};
