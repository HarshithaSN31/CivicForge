import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CivicMap, MapMarkerData } from '../../components/map/CivicMapAbstraction';
import { MapPin, Filter, Layers, Eye, Info } from 'lucide-react';

export const AuthorityCivicMapPage: React.FC = () => {
  const { incidents, issues } = useData();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewLayer, setViewLayer] = useState<'INCIDENTS' | 'REPORTS'>('INCIDENTS');
  const [activeMarker, setActiveMarker] = useState<MapMarkerData | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesCat = categoryFilter === 'ALL' || inc.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  const filteredIssues = issues.filter((iss) => {
    const matchesCat = categoryFilter === 'ALL' || iss.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || iss.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  const markers: MapMarkerData[] =
    viewLayer === 'INCIDENTS'
      ? filteredIncidents.map((inc) => ({
          id: inc.id,
          latitude: inc.primaryLocation.latitude,
          longitude: inc.primaryLocation.longitude,
          title: inc.title,
          category: inc.category,
          status: inc.status,
          severity: inc.severity,
          reportCount: inc.reportIds.length,
          isIncident: true,
        }))
      : filteredIssues.map((iss) => ({
          id: iss.id,
          latitude: iss.location.latitude,
          longitude: iss.location.longitude,
          title: iss.title,
          category: iss.category,
          status: iss.status,
          severity: iss.severity,
          isIncident: false,
        }));

  const mapCenter: [number, number] = markers.length > 0
    ? [markers[0].latitude, markers[0].longitude]
    : [20.5937, 78.9629]; // India Center

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-civic-navy tracking-tight">Authority Civic GIS Map (India)</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Geographic view of incident clusters, individual reports, and hotspot concentrations in India.
          </p>
        </div>
      </div>

      {/* Layer Controls & Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md w-full sm:w-auto">
            <button
              onClick={() => setViewLayer('INCIDENTS')}
              className={`px-3 py-1.5 rounded font-bold transition-colors ${
                viewLayer === 'INCIDENTS' ? 'bg-civic-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Incident Clusters ({filteredIncidents.length})
            </button>
            <button
              onClick={() => setViewLayer('REPORTS')}
              className={`px-3 py-1.5 rounded font-bold transition-colors ${
                viewLayer === 'REPORTS' ? 'bg-civic-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Individual Reports ({filteredIssues.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-civic-border rounded-md font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
              >
                <option value="ALL">All Categories</option>
                <option value="Roads & Potholes">Roads & Potholes</option>
                <option value="Garbage & Waste">Garbage & Waste</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Drainage & Sewage">Drainage & Sewage</option>
                <option value="Flooding & Waterlogging">Flooding & Waterlogging</option>
                <option value="Streetlights">Streetlights</option>
                <option value="Traffic & Footpaths">Traffic & Footpaths</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-civic-border rounded-md font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="REPORTED">REPORTED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Main Map + Selected Marker Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {markers.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-xs text-center">
              No civic incidents in this area yet.
            </div>
          )}
          <CivicMap
            center={mapCenter}
            zoom={markers.length > 0 ? 12 : 5}
            className="h-[550px] w-full rounded-lg"
            markers={markers}
            onMarkerClick={(m) => setActiveMarker(m)}
          />
        </div>

        {/* Selected Marker Detail Card */}
        <div className="space-y-6">
          {activeMarker ? (
            <Card className="border-2 border-civic-accent">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs uppercase tracking-wider text-civic-navy">
                    {activeMarker.isIncident ? 'Selected Incident Cluster' : 'Selected Citizen Report'}
                  </span>
                  <Badge severity={activeMarker.severity} size="sm" />
                </div>
              </CardHeader>
              <CardBody className="space-y-3 text-xs">
                <h3 className="font-bold text-base text-civic-navy">{activeMarker.title}</h3>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Category: <strong>{activeMarker.category}</strong></span>
                  <Badge status={activeMarker.status} size="sm" />
                </div>
                {activeMarker.reportCount !== undefined && (
                  <p className="text-slate-600 text-xs">
                    Associated Reports: <strong>{activeMarker.reportCount}</strong>
                  </p>
                )}
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(activeMarker.isIncident ? `/incident/${activeMarker.id}` : `/issue/${activeMarker.id}`)
                    }
                    icon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Full Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="p-6 text-center text-slate-500 text-xs space-y-2">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-civic-navy">No Pin Selected</p>
              <p className="text-[11px] text-slate-500">
                Click any incident pin or report marker on the GIS map to inspect details.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
