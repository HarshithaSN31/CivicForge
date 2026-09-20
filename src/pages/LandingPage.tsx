import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import {
  FileText,
  Cpu,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isLoggedIn, currentUser } = useAuth();

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide">
          <span className="text-base">🇮🇳</span>
          <span>BUILD BHARAT HACKATHON EDITION • INDIA CIVIC INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-civic-navy tracking-tight leading-tight">
          From scattered reports to actionable civic intelligence.
        </h1>

        <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
          Connecting citizen reports, public civic signals and community volunteer action to help Indian municipal authorities identify the real infrastructure problems behind scattered complaints.
        </p>

        {/* Public CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button size="lg" variant="primary" icon={<FileText className="w-5 h-5" />}>
                Go to Civic Dashboard ({currentUser?.name})
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" variant="primary" icon={<UserPlus className="w-5 h-5" />}>
                  Register Account
                </Button>
              </Link>

              <Link to="/login">
                <Button size="lg" variant="outline" icon={<LogIn className="w-5 h-5 text-civic-accent" />}>
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Visual Story Pipeline */}
      <section className="bg-white border border-civic-border rounded-xl p-6 sm:p-10 shadow-civic space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-civic-navy">
            How CivicForge Operates for Indian Municipalities
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Combining citizen reports, spatial-temporal AI clustering, and verified community volunteer actions.
          </p>
        </div>

        {/* 5-Step Visual Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-civic-accent flex items-center justify-center mx-auto font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Verified Indian Report</h3>
            <p className="text-slate-600 leading-normal">
              Photo evidence + GPS location pin verified within India.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Amazon Bedrock AI</h3>
            <p className="text-slate-600 leading-normal">
              Classifies Indian civic category & recommends department.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Multi-Factor Search</h3>
            <p className="text-slate-600 leading-normal">
              Calculates distance, category, and temporal scores.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Civic Incident Grouping</h3>
            <p className="text-slate-600 leading-normal">
              Associates probable related reports into a single incident.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-sm">
              5
            </div>
            <h3 className="font-bold text-sm text-civic-navy">Verified Action</h3>
            <p className="text-slate-600 leading-normal">
              Municipal response & verified volunteer proof-of-work S3 upload.
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
              CivicForge never merges or deletes original reports. Every complaint remains independent and fully preserved.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-civic-navy">Amazon Bedrock AI Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real Amazon Bedrock model inference with deterministic fallback logic for reliable civic intelligence.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-civic-navy">Verified Volunteer Action</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowers verified citizen volunteers across Indian cities to conduct field audits and upload proof of work.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
