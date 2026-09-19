import React from 'react';
import { Layers, Shield, Cpu, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-civic-navy text-slate-400 border-t border-slate-800 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <div className="w-6 h-6 rounded bg-civic-accent flex items-center justify-center text-white text-xs">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span>CivicForge</span>
          <span className="text-slate-500 font-normal">| From scattered reports to actionable civic intelligence.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Original Reports Preserved
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Amazon Bedrock AI
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            AWS Amplify Backend
          </span>
        </div>
      </div>
    </footer>
  );
};
