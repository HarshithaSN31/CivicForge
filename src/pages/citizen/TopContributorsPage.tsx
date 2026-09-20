import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Trophy, Award, Clock, CheckCircle2, MapPin } from 'lucide-react';

export const TopContributorsPage: React.FC = () => {
  const { getTopContributors } = useData();
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  const allContributors = getTopContributors();

  const filteredContributors = allContributors.filter(({ user }) => {
    return selectedCity === 'ALL' || user.city === selectedCity;
  });

  const getBadgeTitle = (index: number, hours: number) => {
    if (index === 0) return '🇮🇳 #1 Top Civic Leader';
    if (index === 1) return '⭐ Outstanding Volunteer';
    if (index === 2) return '🛡️ Civic Action Champion';
    if (hours >= 20) return '🌟 Veteran Civic Helper';
    return '🌱 Active Volunteer';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-civic-navy text-white p-6 rounded-xl shadow-civic space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          Build Bharat Citizen Honors (India Only)
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Top Verified Civic Contributors</h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Recognizing top citizen volunteers across Indian cities who actively complete verified authority tasks, audit infrastructure hazards, and improve their local communities.
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-civic-navy">
            <MapPin className="w-4 h-4 text-civic-accent" />
            <span>Filter Leaderboard by City:</span>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 border border-civic-border rounded-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
          >
            <option value="ALL">All Indian Cities</option>
            <option value="Bengaluru">Bengaluru, Karnataka</option>
            <option value="Mumbai">Mumbai, Maharashtra</option>
            <option value="New Delhi">New Delhi, Delhi</option>
          </select>
        </CardBody>
      </Card>

      {/* Leaderboard Grid */}
      {filteredContributors.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 font-medium">
          No verified volunteer contributions yet.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredContributors.map(({ user, stats }, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;

            return (
              <Card
                key={user.id}
                className={`hover:border-civic-accent transition-all ${
                  isTopThree ? 'border-2 border-amber-400/70 bg-slate-50/50' : ''
                }`}
              >
                <CardHeader className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs text-white ${
                        rank === 1
                          ? 'bg-amber-500'
                          : rank === 2
                          ? 'bg-slate-400'
                          : rank === 3
                          ? 'bg-amber-700'
                          : 'bg-slate-700'
                      }`}
                    >
                      #{rank}
                    </div>
                    <Badge variant={isTopThree ? 'amber' : 'blue'} size="sm">
                      {getBadgeTitle(index, stats?.volunteerHours || 0)}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-civic-accent" />
                    {user.city}
                  </div>
                </CardHeader>

                <CardBody className="p-5 space-y-4 text-xs text-center">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-civic-accent shadow-xs mb-2"
                      />
                      {isTopThree && (
                        <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1 shadow-xs">
                          <Trophy className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-civic-navy">{user.name}</h3>
                    <span className="text-[11px] text-slate-500">{user.email}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-left">
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Activities</div>
                      <div className="font-bold text-sm text-civic-navy flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {stats?.verifiedActivitiesCount || 0}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Hours</div>
                      <div className="font-bold text-sm text-civic-navy flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {stats?.volunteerHours || 0}h
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Credits</div>
                      <div className="font-bold text-sm text-civic-navy flex items-center gap-1 mt-0.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        {stats?.creditsReceivedCount || 0}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Incidents Supported: <strong>{stats?.incidentsSupportedCount || 0}</strong></span>
                    <span>Areas Helped: <strong>{stats?.areasHelpedCount || 0}</strong></span>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
