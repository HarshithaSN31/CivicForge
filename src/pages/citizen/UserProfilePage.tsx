import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  User as UserIcon,
  Award,
  Clock,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Layers,
  FileText
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { issues, activities, usersMap } = useData();

  const userId = currentUser?.id || 'user-citizen-1';
  const userData = usersMap[userId] || currentUser;

  const stats = userData?.stats || {
    verifiedActivitiesCount: 12,
    volunteerHours: 28,
    tasksCompleted: 14,
    areasHelpedCount: 5,
    incidentsSupportedCount: 8,
    creditsReceivedCount: 19,
  };

  const userIssues = issues.filter((i) => i.reporterId === userId);
  const userActivities = activities.filter((a) => a.volunteerId === userId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      {/* Profile Card Header */}
      <Card className="bg-civic-navy text-white overflow-hidden shadow-civic border-0">
        <CardBody className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt={userData?.name || 'User'}
            className="w-24 h-24 rounded-full object-cover border-4 border-civic-accent shadow-md shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold">{userData?.name || 'Ananya Sharma'}</h1>
              <Badge variant="amber" size="sm" className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Citizen Volunteer (IN)
              </Badge>
            </div>
            <p className="text-slate-300 text-xs">{userData?.email || 'ananya.sharma@civicforge.in'}</p>
            <div className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-civic-accent" />
              {userData?.city || 'Bengaluru'}, {userData?.state || 'Karnataka'} (India)
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Contribution Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <div className="text-lg font-extrabold text-civic-navy">{stats.verifiedActivitiesCount}</div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Verified Actions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-extrabold text-civic-navy">{stats.volunteerHours}h</div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Hours Volunteered</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-lg font-extrabold text-civic-navy">{stats.creditsReceivedCount}</div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Kudos & Credits</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <Layers className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-lg font-extrabold text-civic-navy">{stats.incidentsSupportedCount}</div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Incidents Solved</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <MapPin className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <div className="text-lg font-extrabold text-civic-navy">{stats.areasHelpedCount}</div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Areas Helped</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
          <FileText className="w-5 h-5 text-teal-600 mx-auto mb-1" />
          <div className="text-lg font-extrabold text-civic-navy">{userIssues.length}</div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Reports Filed</div>
        </div>
      </div>

      {/* Verified Badges */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-sm text-civic-navy flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Verified Civic Badges & Certifications
          </h3>
        </CardHeader>
        <CardBody className="p-4 flex flex-wrap gap-3">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2.5">
            <span className="text-xl">🇮🇳</span>
            <div>
              <div className="font-bold text-civic-navy text-xs">Build Bharat Pioneer</div>
              <div className="text-[10px] text-slate-500">Top 5% civic volunteer in Karnataka</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-2.5">
            <span className="text-xl">🛣️</span>
            <div>
              <div className="font-bold text-civic-navy text-xs">Road Safety Specialist</div>
              <div className="text-[10px] text-slate-500">10+ verified pothole audit tasks</div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-2.5">
            <span className="text-xl">🌧️</span>
            <div>
              <div className="font-bold text-civic-navy text-xs">Monsoon Flood Responder</div>
              <div className="text-[10px] text-slate-500">Active drainage clearing in Bengaluru</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Volunteer History */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-sm text-civic-navy">Verified Volunteer Activities History</h3>
        </CardHeader>
        <CardBody className="p-4 space-y-3">
          {userActivities.length === 0 ? (
            <p className="text-slate-500">No verified activities recorded yet.</p>
          ) : (
            userActivities.map((act) => (
              <div key={act.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-civic-navy text-xs">{act.taskTitle}</div>
                  <div className="text-[11px] text-slate-500">{act.workDescription}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {act.hoursSpent}h spent • Verified by {act.verifiedByAuthorityName || 'Authority'}
                  </div>
                </div>
                <Badge variant={act.status === 'VERIFIED' ? 'green' : 'amber'}>
                  {act.status}
                </Badge>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
};
