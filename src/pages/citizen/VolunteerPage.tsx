import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Users, MapPin, CheckCircle2, HeartHandshake, ShieldCheck } from 'lucide-react';

export const VolunteerPage: React.FC = () => {
  const { volunteerOpportunities, enrollVolunteerOpportunity } = useData();
  const { currentUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [enrolledMap, setEnrolledMap] = useState<Record<string, boolean>>({});

  const filteredVolunteers = volunteerOpportunities.filter((vol) => {
    return selectedCity === 'ALL' || vol.city === selectedCity;
  });

  const handleEnroll = (id: string) => {
    enrollVolunteerOpportunity(id);
    setEnrolledMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-civic-navy text-white p-6 rounded-xl shadow-civic space-y-2">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Build Bharat Civic Volunteer Network
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Community Action & Volunteer Hub (India Only)</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Join verified citizen volunteers across Indian cities to conduct field evidence audits, verify pothole clusters, and support municipal ward committees.
        </p>
      </div>

      <Alert variant="info" title="🇮🇳 India-Only Volunteer Scope">
        All volunteer opportunities are strictly restricted to verified locations within India (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, Pune, etc.). Overseas activities are not accepted.
      </Alert>

      {/* Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-civic-navy">
            <MapPin className="w-4 h-4 text-civic-accent" />
            <span>Filter Opportunities by City:</span>
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

      {/* Volunteer Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVolunteers.map((vol) => {
          const isEnrolled = enrolledMap[vol.id];
          return (
            <Card key={vol.id} className="flex flex-col justify-between hover:border-civic-accent transition-colors">
              <CardHeader className="bg-slate-50/80">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-civic-navy flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-civic-accent" />
                    {vol.city}, {vol.state} (India)
                  </span>
                  <Badge variant="blue" size="sm">
                    {vol.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody className="space-y-3 p-5 flex-1 text-xs">
                <h3 className="font-bold text-base text-civic-navy">{vol.title}</h3>
                <p className="text-slate-600 leading-relaxed text-xs">{vol.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 font-medium text-[11px]">
                  <span>Organizer: <strong>{vol.organizerName}</strong></span>
                  <span className="flex items-center gap-1 font-bold text-civic-navy">
                    <Users className="w-3.5 h-3.5 text-civic-accent" />
                    {vol.enrolledVolunteers} / {vol.requiredVolunteers} Enrolled
                  </span>
                </div>
              </CardBody>
              <div className="p-4 border-t border-civic-border bg-slate-50/40">
                <Button
                  variant={isEnrolled ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full"
                  disabled={isEnrolled}
                  onClick={() => handleEnroll(vol.id)}
                  icon={isEnrolled ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : undefined}
                >
                  {isEnrolled ? 'Successfully Enrolled as Volunteer' : 'Enroll as Citizen Volunteer'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
