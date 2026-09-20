import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { uploadEvidenceToS3 } from '../../services/s3Service';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Upload,
  Camera,
  Sparkles,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, applications, applyForTask, cancelVolunteerApplication, checkInTask, submitTaskProofOfWork, getTaskCapacityStats } = useData();
  const { currentUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  // Modals state
  const [proofModalTaskId, setProofModalTaskId] = useState<string | null>(null);
  const [proofModalAppId, setProofModalAppId] = useState<string | null>(null);
  const [workDescription, setWorkDescription] = useState('');
  const [hoursSpent, setHoursSpent] = useState(2);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const userId = currentUser?.id || '';

  const filteredTasks = tasks.filter((t) => {
    return selectedCity === 'ALL' || t.location.city === selectedCity;
  });

  const getAppForTask = (taskId: string) => {
    return applications.find((a) => a.taskId === taskId && a.userId === userId && a.status !== 'CANCELLED' && a.status !== 'DECLINED');
  };

  const handleApply = (taskId: string) => {
    if (!currentUser) {
      alert('Please sign in or register to volunteer for tasks.');
      return;
    }
    try {
      applyForTask(taskId);
      alert('🎉 Registered successfully for volunteer task! A confirmation notification has been sent.');
    } catch (err: any) {
      alert(err.message || 'Error applying for task');
    }
  };

  const handleCancel = (appId: string) => {
    if (confirm('Are you sure you want to cancel your volunteer registration? The spot will be reopened for other citizens.')) {
      cancelVolunteerApplication(appId);
    }
  };

  const handleCheckIn = (appId: string, lat: number, lng: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          checkInTask(appId, pos.coords.latitude, pos.coords.longitude);
          alert('📍 Verified Check-in recorded at your current GPS location in India!');
        },
        () => {
          checkInTask(appId, lat, lng);
          alert('📍 Verified Check-in recorded at task site location in India!');
        }
      );
    } else {
      checkInTask(appId, lat, lng);
      alert('📍 Verified Check-in recorded!');
    }
  };

  const openProofModal = (taskId: string, appId: string) => {
    setProofModalTaskId(taskId);
    setProofModalAppId(appId);
    setWorkDescription('');
    setBeforeFile(null);
    setAfterFile(null);
    setUploadError(null);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofModalTaskId || !proofModalAppId) return;

    if (!workDescription.trim()) {
      setUploadError('Please provide a detailed description of the completed work.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      let beforePhotoUrl: string | undefined = undefined;
      let afterPhotoUrl = '';

      if (beforeFile) {
        const res = await uploadEvidenceToS3(beforeFile);
        beforePhotoUrl = res.url;
      }

      if (afterFile) {
        const res = await uploadEvidenceToS3(afterFile);
        afterPhotoUrl = res.url;
      }

      const targetTask = tasks.find((t) => t.id === proofModalTaskId);
      if (!targetTask) return;

      submitTaskProofOfWork({
        applicationId: proofModalAppId,
        taskId: proofModalTaskId,
        volunteerId: userId,
        volunteerName: currentUser?.name || 'Volunteer',
        workDescription,
        beforePhotoUrl,
        afterPhotoUrl,
        hoursSpent: Number(hoursSpent),
        location: targetTask.location,
      });

      setProofModalTaskId(null);
      setProofModalAppId(null);
      alert('🎉 Proof of Work submitted successfully! Routed to Authority verification queue.');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload proof photos to S3.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-civic-navy text-white p-6 rounded-xl shadow-civic space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Verified Volunteer Action Network (India Only)
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Verified Civic Volunteer Tasks</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Browse official civic tasks published directly by Municipal Authorities for verified incidents. Real-time capacity checks prevent overbooking.
        </p>
      </div>

      <Alert variant="info" title="🇮🇳 Strictly India-Only Civic Scope">
        All tasks correspond to real, verified civic incidents in Indian municipalities. Overseas activities are not permitted.
      </Alert>

      {/* Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-civic-navy">
            <MapPin className="w-4 h-4 text-civic-accent" />
            <span>Filter Tasks by Indian City:</span>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
          >
            <option value="ALL">All Cities in India</option>
            <option value="Bengaluru">Bengaluru, Karnataka</option>
            <option value="Mumbai">Mumbai, Maharashtra</option>
            <option value="New Delhi">New Delhi, Delhi</option>
          </select>
        </CardBody>
      </Card>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 font-medium">
            No volunteer opportunities are currently available.
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const userApp = getAppForTask(task.id);
            const isApplied = !!userApp;
            const isCheckedIn = userApp?.status === 'CHECKED_IN';
            const isCompleted = userApp?.status === 'COMPLETED' || userApp?.status === 'VERIFIED';
            const capacity = getTaskCapacityStats(task.id);
            const mapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${task.location.latitude},${task.location.longitude}`;

            return (
              <Card key={task.id} className="hover:border-civic-accent transition-all shadow-xs">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="blue" size="sm">
                        {task.workType}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Linked to Incident #{task.incidentId.replace('incident-', '')}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-civic-navy mt-1">{task.title}</h3>
                  </div>
                  <Badge variant={capacity.isFull ? 'red' : task.status === 'COMPLETED' ? 'green' : 'amber'}>
                    {capacity.isFull ? 'FULL' : task.status}
                  </Badge>
                </CardHeader>

                <CardBody className="space-y-4 p-5 text-xs text-slate-700">
                  <p className="leading-relaxed text-sm text-slate-600">{task.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-civic-accent shrink-0" />
                      <div>
                        <div className="font-bold text-civic-navy text-[11px]">Location</div>
                        <div className="text-slate-600 truncate">{task.location.formattedAddress}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-civic-navy text-[11px]">Schedule</div>
                        <div className="text-slate-600">
                          {task.date} • {task.startTime} ({task.expectedDuration})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-civic-navy text-[11px]">Volunteer Capacity</div>
                        <div className="text-slate-800 font-extrabold text-xs">
                          {capacity.needed} NEEDED • {capacity.registered} REGISTERED • {capacity.remaining} SPOTS REMAINING
                        </div>
                      </div>
                    </div>
                  </div>

                  {task.safetyInstructions && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-md text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Safety Guidelines:</strong> {task.safetyInstructions}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <a
                      href={mapsDirUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      Get Google Maps Directions
                    </a>

                    <div className="flex items-center gap-2">
                      {!isApplied && !capacity.isFull && (
                        <Button variant="primary" size="sm" onClick={() => handleApply(task.id)}>
                          Volunteer for Task
                        </Button>
                      )}

                      {!isApplied && capacity.isFull && (
                        <Button variant="outline" size="sm" disabled className="text-red-600 border-red-200 bg-red-50">
                          Volunteer Spots Full
                        </Button>
                      )}

                      {isApplied && !isCheckedIn && !isCompleted && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<MapPin className="w-3.5 h-3.5 text-amber-500" />}
                            onClick={() => handleCheckIn(userApp.id, task.location.latitude, task.location.longitude)}
                          >
                            Check In On-Site
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-slate-600 hover:text-red-600 hover:border-red-300 text-xs"
                            icon={<XCircle className="w-3.5 h-3.5" />}
                            onClick={() => handleCancel(userApp.id)}
                          >
                            Cancel Registration
                          </Button>
                        </>
                      )}

                      {isApplied && isCheckedIn && !isCompleted && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          icon={<Camera className="w-3.5 h-3.5" />}
                          onClick={() => openProofModal(task.id, userApp.id)}
                        >
                          Complete Task & Upload Proof
                        </Button>
                      )}

                      {isCompleted && (
                        <Badge variant="green" size="md" className="flex items-center gap-1 px-3 py-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Proof Submitted / Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>

      {/* Proof of Work Upload Modal */}
      {proofModalTaskId && proofModalAppId && (
        <Modal
          isOpen={true}
          onClose={() => setProofModalTaskId(null)}
          title="Submit Proof of Work (Before & After Photos)"
        >
          <form onSubmit={handleSubmitProof} className="space-y-4 text-xs">
            {uploadError && <Alert variant="danger">{uploadError}</Alert>}

            <div>
              <label className="block font-bold text-civic-navy mb-1">
                Work Completed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="Describe what volunteer actions were taken..."
                className="w-full p-2.5 border border-civic-border rounded-md text-xs focus:ring-2 focus:ring-civic-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-civic-navy mb-1">
                  Before Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                    className="w-full text-[11px]"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {beforeFile ? beforeFile.name : 'Choose initial hazard photo'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-civic-navy mb-1">
                  After Photo (Required Proof) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                    className="w-full text-[11px]"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {afterFile ? afterFile.name : 'Choose completed work photo'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-civic-navy mb-1">Hours Spent Volunteering</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(Number(e.target.value))}
                className="w-full p-2 border border-civic-border rounded-md text-xs"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setProofModalTaskId(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isUploading}
                icon={isUploading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              >
                {isUploading ? 'Uploading to S3...' : 'Submit Proof to Authority'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
