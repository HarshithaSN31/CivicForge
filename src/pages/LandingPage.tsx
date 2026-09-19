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
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide">
          <Layers className="w-4 h-4 text-civic-accent" />
          <span>Civic Intelligence Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-civic-navy tracking-tight leading-tight">
          Civic problems shouldn't disappear into complaint boxes.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
          CivicForge turns scattered citizen reports into connected civic intelligence—helping communities and authorities see what is actually happening.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/report">
            <Button size="lg" variant="primary" icon={<FileText className="w-5 h-5" />}>
              Report a Problem
            </Button>
          </Link>
          <Link to="/map">
            <Button size="lg" variant="outline" icon={<MapPin className="w-5 h-5 text-civic-accent" />}>
              Explore Civic Intelligence
            </Button>
          </Link>
          <Button
            size="lg"
            variant="secondary"
            icon={<Building2 className="w-5 h-5" />}
            onClick={() => {
              switchRole('AUTHORITY');
              navigate('/authority');
            }}
          >
            Authority Portal Demo
          </Button>
        </div>
      </section>

      {/* Fundamental Visual Story Pipeline */}
      <section className="bg-white border border-civic-border rounded-xl p-6 sm:p-10 shadow-civic space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-civic-navy">
            How CivicForge Works: The Central Product Loop
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Instead of treating duplicate complaints as isolated tickets, CivicForge groups potentially related reports into actionable civic incidents while keeping original reports intact.
          </p>
        </div>

        {/* 5-Step Visual Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-civic-accent flex items-center justify-center mx-auto font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Citizen Report</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Photo + text + location pin submitted by citizen.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Bedrock AI Analysis</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Category, severity, and department recommended.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Relationship Search</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Multi-factor scoring (distance, category, text, time).
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Civic Incident</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Grouped into possible incident (e.g., AI confidence: 91%).
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2 relative">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-sm">
              5
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Authority Action</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Assigned to dept → In Progress → Resolved status update.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Core Principles Card */}
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
            <h3 className="font-bold text-base text-civic-navy">Probabilistic AI Framing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI outputs are transparently framed with relationship confidence scores ("AI confidence: 91%", "Human review recommended") rather than false absolute claims.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-civic-navy">High Information Clarity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mobile-first reporting for citizens paired with high-density GIS operations dashboards for municipal authorities.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
