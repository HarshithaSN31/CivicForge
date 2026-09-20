import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Camera,
  Award,
  UserCheck
} from 'lucide-react';

export const AuthorityVerifyActivitiesPage: React.FC = () => {
  const { activities, verifyVolunteerActivity } = useData();
  const { currentUser } = useAuth();

  const authorityId = currentUser?.id || 'user-auth-1';
  const authorityName = currentUser?.name || 'Executive Engineer Suresh Rao';

  const pendingActivities = activities.filter((a) => a.status === 'SUBMITTED_FOR_VERIFICATION');
  const verifiedActivities = activities.filter((a) => a.status === 'VERIFIED');

  const handleVerify = (activityId: string) => {
    verifyVolunteerActivity(activityId, authorityId, authorityName, 'VERIFY');
    alert('✅ Volunteer activity verified! Stats updated & published to Community Feed.');
  };

  const handleReject = (activityId: string) => {
    verifyVolunteerActivity(activityId, authorityId, authorityName, 'REJECT');
    alert('❌ Volunteer activity rejected.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      {/* Top Banner */}
      <div className="bg-civic-navy text-white p-6 rounded-xl shadow-civic space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Authority Inspection & Proof of Work Verification Queue
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Verify Volunteer Proof of Work</h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Review on-site before & after photos, GPS location evidence, and work descriptions submitted by citizen volunteers before issuing official civic contribution credits.
        </p>
      </div>

      {/* Pending Queue */}
      <Card>
        <CardHeader className="bg-amber-50/80 border-b border-amber-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Pending Proof of Work Submissions ({pendingActivities.length})
          </h3>
          <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
            Requires Authority Approval
          </span>
        </CardHeader>
        <CardBody className="p-5 space-y-6">
          {pendingActivities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No pending volunteer proof of work submissions awaiting verification.
            </div>
          ) : (
            pendingActivities.map((act) => (
              <div key={act.id} className="border border-slate-200 rounded-lg p-5 bg-white space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Task: #{act.taskId}
                    </span>
                    <h4 className="font-bold text-base text-civic-navy">{act.taskTitle}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Volunteer: <strong>{act.volunteerName}</strong>
                    </span>
                    <Badge variant="amber" size="sm">
                      SUBMITTED
                    </Badge>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs">{act.workDescription}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-md">
                  <span className="flex items-center gap-1 font-semibold text-civic-navy">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Hours Logged: {act.hoursSpent}h
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-civic-accent" />
                    {act.location.formattedAddress}
                  </span>
                </div>

                {/* Photos Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {act.beforePhotoUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">
                        Initial Hazard Photo (Before)
                      </span>
                      <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                        <img src={act.beforePhotoUrl} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 block">
                      Uploaded Proof of Work Photo (After)
                    </span>
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-emerald-500 bg-slate-900">
                      <img src={act.afterPhotoUrl} alt="After" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-700 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(act.id)}
                    icon={<XCircle className="w-4 h-4" />}
                  >
                    Reject Submission
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleVerify(act.id)}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Verify Completion & Issue Credits
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {/* Verified History */}
      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Recently Verified Volunteer Activities ({verifiedActivities.length})
          </h3>
        </CardHeader>
        <CardBody className="p-4 space-y-3">
          {verifiedActivities.map((act) => (
            <div key={act.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <div className="font-bold text-civic-navy text-xs">{act.taskTitle}</div>
                <div className="text-[11px] text-slate-500">
                  Volunteer: {act.volunteerName} • {act.hoursSpent}h spent
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Verified by {act.verifiedByAuthorityName || authorityName} on {act.verifiedAt ? new Date(act.verifiedAt).toLocaleDateString() : 'Today'}
                </div>
              </div>
              <Badge variant="green" size="md" className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </Badge>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};
