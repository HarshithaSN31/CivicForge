import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { IssueStatus } from '../../types';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { CivicMap } from '../../components/map/CivicMapAbstraction';
import {
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileText,
  ArrowLeft,
  Cpu,
  Building2,
  Users,
  Plus,
  HeartHandshake
} from 'lucide-react';

export const CivicIncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, issues, events, updateIncidentStatus, assignIncident, addIncidentNote, createCivicTask } = useData();
  const { currentRole, currentUser } = useAuth();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<IssueStatus>('IN_PROGRESS');
  const [statusNote, setStatusNote] = useState('');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignedDept, setAssignedDept] = useState('Road Maintenance Division');
  const [assignedOfficer, setAssignedOfficer] = useState('Executive Engineer Suresh Rao');

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [newOfficerNote, setNewOfficerNote] = useState('');

  // Volunteer Task Creation Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskWorkType, setTaskWorkType] = useState('Field Safety Audit & Hazard Marking');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('2026-09-25');
  const [taskStartTime, setTaskStartTime] = useState('09:00 AM');
  const [taskDuration, setTaskDuration] = useState('2 Hours');
  const [volunteersNeeded, setVolunteersNeeded] = useState(5);
  const [safetyInstructions, setSafetyInstructions] = useState('Wear reflective safety vests and gloves.');

  const incident = incidents.find((inc) => inc.id === id);
  const groupedIssues = issues.filter((iss) => incident?.reportIds.includes(iss.id));
  const incidentEvents = events.filter((e) => e.incidentId === id);

  if (!incident) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold text-civic-navy">Civic Incident Not Found</h2>
        <p className="text-xs text-slate-500">The requested incident ID does not exist in the system.</p>
        <Button variant="outline" onClick={() => navigate('/authority/incidents')}>
          Back to Incidents
        </Button>
      </div>
    );
  }

  const handleStatusUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateIncidentStatus(incident.id, selectedNewStatus, currentUser?.name || 'Authority', statusNote);
    setStatusModalOpen(false);
    setStatusNote('');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignIncident(incident.id, assignedDept, assignedOfficer);
    setAssignModalOpen(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerNote.trim()) return;
    addIncidentNote(incident.id, newOfficerNote, currentUser?.name || 'Authority');
    setNoteModalOpen(false);
    setNewOfficerNote('');
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDescription.trim()) return;

    createCivicTask({
      incidentId: incident.id,
      title: taskTitle,
      description: taskDescription,
      workType: taskWorkType,
      location: incident.primaryLocation,
      date: taskDate,
      startTime: taskStartTime,
      expectedDuration: taskDuration,
      volunteersNeeded: Number(volunteersNeeded),
      safetyInstructions,
      authorityId: currentUser?.id || 'user-auth-1',
      authorityName: currentUser?.name || 'Executive Engineer Suresh Rao',
    });

    setTaskModalOpen(false);
    alert('✅ Official Verified Civic Task created and published to Citizen Volunteer Hub!');
  };

  const mapMarkers = groupedIssues.map((iss) => ({
    id: iss.id,
    latitude: iss.location.latitude,
    longitude: iss.location.longitude,
    title: iss.title,
    category: iss.category,
    status: iss.status,
    severity: iss.severity,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-civic-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Incidents
      </button>

      {/* Signature Incident Banner Header */}
      <div className="bg-civic-navy text-white rounded-xl p-6 shadow-civic-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Possible Civic Incident #{incident.incidentNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
                AI confidence: {incident.aiConfidence}%
              </span>
              <span className="text-xs text-slate-300">
                {incident.reportIds.length} independent reports
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">{incident.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {incident.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <Badge status={incident.status} size="md" />
            <Badge severity={incident.severity} size="md" />
          </div>
        </div>

        {/* Authority Action Control Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 font-semibold">
              <Building2 className="w-4 h-4 text-amber-400" />
              Dept: {incident.assignedDepartment}
            </span>
            {incident.assignedTo && (
              <span className="flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Officer: {incident.assignedTo}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-400" />
              {incident.affectedCitizensCount} Citizens Affected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 text-xs"
              onClick={() => {
                setTaskTitle(`Field Action: ${incident.title}`);
                setTaskDescription(`Official civic task for Incident #${incident.incidentNumber} near ${incident.primaryLocation.formattedAddress}`);
                setTaskModalOpen(true);
              }}
              icon={<HeartHandshake className="w-3.5 h-3.5 text-amber-400" />}
            >
              Create Verified Volunteer Task
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              onClick={() => setAssignModalOpen(true)}
            >
              Assign Dept/Officer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStatusModalOpen(true)}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Change Incident Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              onClick={() => setNoteModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Note
            </Button>
          </div>
        </div>
      </div>

      {/* Language & Data Integrity Disclaimer */}
      <Alert variant="warning" title="Probabilistic AI Relationship Notice">
        CivicForge groups potentially related reports into possible civic incidents using multi-factor signals. Original citizen reports remain 100% independent and are never merged or deleted. Human review by municipal authority is recommended before closing.
      </Alert>

      {/* Transparent Relationship Signals */}
      {incident.relationshipSignals && (
        <Card className="border-2 border-amber-200 bg-amber-50/50">
          <CardHeader className="bg-amber-100/60">
            <div className="flex items-center justify-between w-full">
              <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-700" />
                Why These Reports May Be Related (Transparent AI Relationship Signals)
              </h3>
              <span className="text-xs font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                Composite Score: {Math.round(incident.relationshipSignals.compositeScore * 100)}%
              </span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white border border-amber-200 rounded-md">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Geographic Proximity</span>
                <span className="text-sm font-bold text-civic-navy mt-0.5 block">{incident.relationshipSignals.distanceMeters}m apart</span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {Math.round(incident.relationshipSignals.distanceScore * 100)}% proximity weight
                </span>
              </div>

              <div className="p-3 bg-white border border-amber-200 rounded-md">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Category Match</span>
                <span className="text-sm font-bold text-civic-navy mt-0.5 block">{incident.category}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {Math.round(incident.relationshipSignals.categoryMatchScore * 100)}% match score
                </span>
              </div>

              <div className="p-3 bg-white border border-amber-200 rounded-md">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Semantic Similarity</span>
                <span className="text-sm font-bold text-civic-navy mt-0.5 block">High Text Overlap</span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {Math.round(incident.relationshipSignals.textSimilarityScore * 100)}% text similarity
                </span>
              </div>

              <div className="p-3 bg-white border border-amber-200 rounded-md">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Time Window</span>
                <span className="text-sm font-bold text-civic-navy mt-0.5 block">Within 2.5 Hours</span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {Math.round(incident.relationshipSignals.temporalScore * 100)}% temporal score
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 border border-amber-200 rounded-md space-y-1">
              <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wider">
                Signal Breakdown Explanations:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                {incident.relationshipSignals.explanation.map((exp, idx) => (
                  <li key={idx}>{exp}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Grid: Interactive GIS Map + Original Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                <MapPin className="w-4 h-4 text-civic-accent" />
                Affected Area GIS Map & Pin Cluster
              </h3>
            </CardHeader>
            <CardBody className="p-0">
              <CivicMap
                center={[incident.primaryLocation.latitude, incident.primaryLocation.longitude]}
                zoom={15}
                className="h-80 w-full rounded-b-lg"
                markers={mapMarkers}
              />
            </CardBody>
          </Card>

          {/* Evidence Photos Matrix */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                <Camera className="w-4 h-4 text-civic-accent" />
                Aggregated Citizen Evidence Matrix
              </h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groupedIssues.flatMap((iss) => iss.photoUrls).length === 0 ? (
                  <p className="text-xs text-slate-500 col-span-2">No photo evidence attached to reports in this incident.</p>
                ) : (
                  groupedIssues.flatMap((iss) =>
                    iss.photoUrls.map((url, i) => (
                      <div key={`${iss.id}-${i}`} className="border border-civic-border rounded-lg overflow-hidden bg-slate-900 shadow-xs space-y-1 p-1">
                        <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-48 object-cover rounded" />
                        <div className="p-1.5 flex justify-between items-center text-[10px] text-slate-300">
                          <span className="font-semibold truncate">{iss.title}</span>
                          <Link to={`/issue/${iss.id}`} className="text-blue-400 hover:underline">
                            Inspect Report &rarr;
                          </Link>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                  <FileText className="w-4 h-4 text-civic-accent" />
                  Associated Reports ({groupedIssues.length})
                </h3>
                <span className="text-[10px] font-semibold text-slate-500">Preserved Independently</span>
              </div>
            </CardHeader>
            <CardBody className="p-0 divide-y divide-slate-100">
              {groupedIssues.map((issue) => (
                <div key={issue.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-civic-navy hover:text-civic-accent">
                      <Link to={`/issue/${issue.id}`}>{issue.title}</Link>
                    </h4>
                    <Badge status={issue.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>By: {issue.reporterName}</span>
                    <Link to={`/issue/${issue.id}`} className="text-civic-accent font-semibold hover:underline">
                      Inspect &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Audit Event History */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
                <Clock className="w-4 h-4 text-civic-accent" />
                Authority Audit Log
              </h3>
            </CardHeader>
            <CardBody className="p-4 space-y-3">
              {incidentEvents.length === 0 ? (
                <p className="text-xs text-slate-500">No events logged yet.</p>
              ) : (
                <div className="relative pl-4 border-l-2 border-slate-200 space-y-3 text-xs">
                  {incidentEvents.map((ev) => (
                    <div key={ev.id} className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                      <div className="font-bold text-civic-navy">{ev.action}</div>
                      <div className="text-[10px] text-slate-500">
                        {ev.actorName} ({ev.actorRole}) • {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {ev.note && <p className="mt-1 text-slate-600 italic bg-slate-50 p-2 rounded text-[11px]">"{ev.note}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Create Verified Volunteer Task Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="Create Verified Civic Volunteer Task"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-civic-navy mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-2.5 border border-civic-border rounded-md text-xs focus:ring-2 focus:ring-civic-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-civic-navy mb-1">Work Type</label>
              <select
                value={taskWorkType}
                onChange={(e) => setTaskWorkType(e.target.value)}
                className="w-full p-2 border border-civic-border rounded-md text-xs bg-white"
              >
                <option value="Pothole Safety & Patching">Pothole Safety & Patching</option>
                <option value="Drainage Cleanup">Drainage Cleanup</option>
                <option value="Lighting Safety Survey">Lighting Safety Survey</option>
                <option value="Community Waste Drive">Community Waste Drive</option>
                <option value="Footpath Audit & Hazard Clearance">Footpath Audit & Hazard Clearance</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-civic-navy mb-1">Volunteers Needed</label>
              <input
                type="number"
                min="1"
                max="50"
                value={volunteersNeeded}
                onChange={(e) => setVolunteersNeeded(Number(e.target.value))}
                className="w-full p-2 border border-civic-border rounded-md text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-civic-navy mb-1">Detailed Work Description</label>
            <textarea
              rows={3}
              required
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full p-2.5 border border-civic-border rounded-md text-xs focus:ring-2 focus:ring-civic-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-civic-navy mb-1">Date</label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="w-full p-2 border border-civic-border rounded-md text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-civic-navy mb-1">Start Time</label>
              <input
                type="text"
                value={taskStartTime}
                onChange={(e) => setTaskStartTime(e.target.value)}
                className="w-full p-2 border border-civic-border rounded-md text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-civic-navy mb-1">Expected Duration</label>
              <input
                type="text"
                value={taskDuration}
                onChange={(e) => setTaskDuration(e.target.value)}
                className="w-full p-2 border border-civic-border rounded-md text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-civic-navy mb-1">Safety Instructions & Equipment</label>
            <input
              type="text"
              value={safetyInstructions}
              onChange={(e) => setSafetyInstructions(e.target.value)}
              className="w-full p-2 border border-civic-border rounded-md text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<HeartHandshake className="w-4 h-4" />}>
              Publish Official Task to Citizen Hub
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Incident #${incident.incidentNumber} Status`}
        maxWidth="md"
      >
        <form onSubmit={handleStatusUpdateSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
              Select New Status
            </label>
            <select
              value={selectedNewStatus}
              onChange={(e) => setSelectedNewStatus(e.target.value as IssueStatus)}
              className="w-full px-3 py-2 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            >
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
              Authority Resolution Note
            </label>
            <textarea
              rows={3}
              placeholder="Detail actions taken, work crew dispatches, or resolution summary..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="w-full px-3 py-2 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Update Status & Dispatch Notifications
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Department & Officer"
        maxWidth="md"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
              Department
            </label>
            <select
              value={assignedDept}
              onChange={(e) => setAssignedDept(e.target.value)}
              className="w-full px-3 py-2 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            >
              <option value="Road Maintenance Division">Road Maintenance Division</option>
              <option value="Water & Sanitation Dept">Water & Sanitation Dept</option>
              <option value="Power & Lighting Operations">Power & Lighting Operations</option>
              <option value="Waste Management Bureau">Waste Management Bureau</option>
              <option value="Emergency & Safety Services">Emergency & Safety Services</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
              Lead Response Officer
            </label>
            <input
              type="text"
              value={assignedOfficer}
              onChange={(e) => setAssignedOfficer(e.target.value)}
              className="w-full px-3 py-2 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Add Officer Note to Audit Trail"
        maxWidth="md"
      >
        <form onSubmit={handleAddNoteSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
              Audit Note
            </label>
            <textarea
              rows={4}
              required
              placeholder="Log inspection observations, crew notes, or citizen correspondence..."
              value={newOfficerNote}
              onChange={(e) => setNewOfficerNote(e.target.value)}
              className="w-full px-3 py-2 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Add Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
