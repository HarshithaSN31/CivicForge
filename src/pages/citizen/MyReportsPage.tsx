import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileText, MapPin, Search, Filter, Layers, ArrowRight } from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { issues, incidents } = useData();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const incidentMap = new Map<string, typeof incidents[0]>();
  incidents.forEach((inc) => incidentMap.set(inc.id, inc));

  const userIssues = issues.filter(
    (i) => i.reporterId === currentUser.id || i.reporterId === 'user-citizen-1' || i.reporterId === 'user-citizen-2'
  );

  const filteredIssues = userIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || issue.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-civic-navy tracking-tight">My Citizen Reports</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Track status updates, assigned departments, and grouped incident details for all submitted reports.
          </p>
        </div>
        <Link to="/report">
          <Button variant="primary" size="md">Report New Problem</Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="Road Infrastructure">Road Infrastructure</option>
              <option value="Water & Sewerage">Water & Sewerage</option>
              <option value="Sanitation & Waste">Sanitation & Waste</option>
              <option value="Electricity & Lighting">Electricity & Lighting</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Parks & Environment">Parks & Environment</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Reports List */}
      <Card>
        <CardBody className="p-0 divide-y divide-slate-100">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No citizen reports found matching your query.
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const incident = issue.incidentId ? incidentMap.get(issue.incidentId) : undefined;
              return (
                <div key={issue.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-civic-navy hover:text-civic-accent">
                        <Link to={`/issue/${issue.id}`}>{issue.title}</Link>
                      </h3>
                      <Badge status={issue.status} size="sm" />
                      <Badge severity={issue.severity} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{issue.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {issue.location.address || 'Reported Location'}
                      </span>
                      <span>Assigned: {issue.department}</span>
                      <span>Filed: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>

                    {incident && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-amber-700" />
                        <span>Associated with Possible Incident #{incident.incidentNumber}</span>
                        <span className="text-amber-700 font-normal">| AI confidence: {incident.aiConfidence}%</span>
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
