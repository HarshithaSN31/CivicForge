import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '../../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentRole } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-civic-light">
      <Header />

      <div className="flex-1 flex w-full">
        {currentRole === 'AUTHORITY' && <Sidebar />}

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};
