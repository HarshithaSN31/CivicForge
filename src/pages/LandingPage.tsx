import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  FileText,
  Cpu,
  Layers,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  Building2,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INDIAN_CITIES_NAV } from '../components/map/CivicMapAbstraction';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide">
          <span className="text-base">🇮🇳</span>
          <span>BUILD BHARAT HACKATHON EDITION • INDIA CIVIC INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-civic-navy tracking-tight leading-tight">
          Civic problems shouldn't disappear into complaint boxes.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
          Connecting citizen reports, public civic signals and community action to help Indian cities identify the problems behind the complaints.
        </p>

        {/* Primary & Secondary Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/report">
            <Button size="lg" variant="primary" icon={<FileText className="w-5 h-5" />}>
              Raise a Complaint
            </Button>
          </Link>
          <Link to="/volunteer">
            <Button size="lg" variant="secondary" icon={<HeartHandshake className="w-5 h-5" />}>
              Volunteer
            </Button>
          </Link>
          <Link to="/map">
            <Button size="lg" variant="outline" icon={<MapPin className="w-5 h-5 text-civic-accent" />}>
              Explore India Civic Map
            </Button>
          </Link>
          <Button
            size="lg"
            variant="ghost"
            className="text-civic-navy hover:bg-slate-200/60 font-semibold"
            icon={<Building2 className="w-5 h-5 text-amber-600" />}
            onClick={() => {
              switchRole('AUTHORITY');
              navigate('/authority');
            }}
          >
            Authority Login
          </Button>
        </div>
      </section>

      {/* India City Navigation Bar */}
      <section className="bg-white border border-civic-border rounded-xl p-5 shadow-civic space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-civic-navy flex items-center gap-2">
            <Compass className="w-4 h-4 text-civic-accent" />
            Explore Indian Municipal Zones & Cities
          </h3>
          <span className="text-[11px] text-slate-500">Verified India Locations Only</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {INDIAN_CITIES_NAV.map((city) => (
            <Link
              key={city.name}
              to="/map"
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-civic-navy hover:text-white text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-civic-accent" />
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Visual Story Pipeline */}
      <section className="bg-white border border-civic-border rounded-xl p-6 sm:p-10 shadow-civic space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-civic-navy">
            How CivicForge Works for Indian Cities
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Combining citizen complaints, public civic signals, and open municipal data to group related problems for municipal authorities (BBMP, MCGM, NDMC, etc.).
          </p>
        </div>

        {/* 5-Step Visual Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-civic-accent flex items-center justify-center mx-auto font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Indian Citizen Report</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Photo + text + verified Indian location pin.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-civic-navy">India-Aware Bedrock AI</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Classifies Indian categories & recommends municipal dept.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Relationship Search</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Multi-factor scoring (distance, category, text, time).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Civic Incident</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Grouped into possible incident (e.g., AI confidence: 91%).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-sm">
              5
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Municipal Action</h3>
            <p className="text-xs text-slate-600 leading-normal">
              BBMP / MCGM officer dispatch → In Progress → Resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-civic-navy">Original Reports Preserved</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CivicForge never silently merges or deletes citizen reports. Every original photo, description, and timestamp remains accessible and independent.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-civic-navy">India-Aware AI & Open Data</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combines citizen reports with approved Indian open data sources (data.gov.in) and verified social signals.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-civic-navy">Community Volunteer Action</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowers verified citizen volunteers across Indian cities to conduct field audits and support ward committees.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
