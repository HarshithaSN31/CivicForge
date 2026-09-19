import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { CitizenDashboardPage } from './pages/citizen/CitizenDashboardPage';
import { ReportIssuePage } from './pages/citizen/ReportIssuePage';
import { MyReportsPage } from './pages/citizen/MyReportsPage';
import { IssueDetailPage } from './pages/citizen/IssueDetailPage';
import { CivicIncidentDetailPage } from './pages/authority/CivicIncidentDetailPage';
import { AuthorityDashboardPage } from './pages/authority/AuthorityDashboardPage';
import { AuthorityReportsPage } from './pages/authority/AuthorityReportsPage';
import { AuthorityIncidentsPage } from './pages/authority/AuthorityIncidentsPage';
import { AuthorityCivicMapPage } from './pages/authority/AuthorityCivicMapPage';
import { AnalyticsPage } from './pages/authority/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public & Landing */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Citizen Experience Routes */}
              <Route path="/citizen" element={<CitizenDashboardPage />} />
              <Route path="/report" element={<ReportIssuePage />} />
              <Route path="/my-reports" element={<MyReportsPage />} />
              <Route path="/issue/:id" element={<IssueDetailPage />} />
              <Route path="/map" element={<AuthorityCivicMapPage />} />

              {/* Signature Concept Detail Route */}
              <Route path="/incident/:id" element={<CivicIncidentDetailPage />} />

              {/* Authority Experience Routes */}
              <Route path="/authority" element={<AuthorityDashboardPage />} />
              <Route path="/authority/reports" element={<AuthorityReportsPage />} />
              <Route path="/authority/incidents" element={<AuthorityIncidentsPage />} />
              <Route path="/authority/map" element={<AuthorityCivicMapPage />} />
              <Route path="/authority/analytics" element={<AnalyticsPage />} />

              {/* Settings & 404 */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
