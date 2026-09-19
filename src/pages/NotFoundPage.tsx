import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Layers } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-civic-navy text-white flex items-center justify-center mx-auto">
        <Layers className="w-6 h-6 text-civic-accent" />
      </div>
      <h1 className="text-3xl font-extrabold text-civic-navy">Page Not Found (404)</h1>
      <p className="text-xs text-slate-500">
        The requested page does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">Return to Homepage</Button>
      </Link>
    </div>
  );
};
