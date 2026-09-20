import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { CitizenDashboardPage } from './pages/citizen/CitizenDashboardPage';
import { ReportIssuePage } from './pages/citizen/ReportIssuePage';
import { MyReportsPage } from './pages/citizen/MyReportsPage';
import { IssueDetailPage } from './pages/citizen/IssueDetailPage';
import { TasksPage } from './pages/citizen/TasksPage';
import { CommunityFeedPage } from './pages/citizen/CommunityFeedPage';
import { TopContributorsPage } from './pages/citizen/TopContributorsPage';
import { UserProfilePage } from './pages/citizen/UserProfilePage';
import { CivicIncidentDetailPage } from './pages/authority/CivicIncidentDetailPage';
import { AuthorityDashboardPage } from './pages/authority/AuthorityDashboardPage';
import { AuthorityReportsPage } from './pages/authority/AuthorityReportsPage';
import { AuthorityIncidentsPage } from './pages/authority/AuthorityIncidentsPage';
import { AuthorityVerifyActivitiesPage } from './pages/authority/AuthorityVerifyActivitiesPage';
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
              {/* 1. PUBLIC ANONYMOUS ROUTES ONLY */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage initialMode="login" />} />
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />
              <Route path="/verify" element={<AuthPage initialMode="verify" />} />
              <Route path="/forgot-password" element={<AuthPage initialMode="forgot-password" />} />

              {/* 2. PROTECTED CITIZEN ROUTES (Require Authenticated Session) */}
              <Route path="/dashboard" element={<ProtectedRoute><CitizenDashboardPage /></ProtectedRoute>} />
              <Route path="/citizen" element={<ProtectedRoute><CitizenDashboardPage /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
              <Route path="/complaints" element={<ProtectedRoute><MyReportsPage /></ProtectedRoute>} />
              <Route path="/complaints/new" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
              <Route path="/complaints/:id" element={<ProtectedRoute><IssueDetailPage /></ProtectedRoute>} />
              <Route path="/my-reports" element={<ProtectedRoute><MyReportsPage /></ProtectedRoute>} />
              <Route path="/issue/:id" element={<ProtectedRoute><IssueDetailPage /></ProtectedRoute>} />
              <Route path="/incidents" element={<ProtectedRoute><AuthorityIncidentsPage /></ProtectedRoute>} />
              <Route path="/incidents/:id" element={<ProtectedRoute><CivicIncidentDetailPage /></ProtectedRoute>} />
              <Route path="/incident/:id" element={<ProtectedRoute><CivicIncidentDetailPage /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><AuthorityCivicMapPage /></ProtectedRoute>} />
              <Route path="/volunteer" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/volunteer/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/volunteer/tasks/:id" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/volunteer/my-tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/volunteer/activity" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/feed" element={<ProtectedRoute><CommunityFeedPage /></ProtectedRoute>} />
              <Route path="/posts/:id" element={<ProtectedRoute><CommunityFeedPage /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><TopContributorsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              {/* 3. PROTECTED MUNICIPAL AUTHORITY ROUTES (Require Authority Role) */}
              <Route path="/authority" element={<ProtectedRoute requireAuthority><AuthorityDashboardPage /></ProtectedRoute>} />
              <Route path="/authority/reports" element={<ProtectedRoute requireAuthority><AuthorityReportsPage /></ProtectedRoute>} />
              <Route path="/authority/incidents" element={<ProtectedRoute requireAuthority><AuthorityIncidentsPage /></ProtectedRoute>} />
              <Route path="/authority/incidents/:id" element={<ProtectedRoute requireAuthority><CivicIncidentDetailPage /></ProtectedRoute>} />
              <Route path="/authority/tasks" element={<ProtectedRoute requireAuthority><AuthorityVerifyActivitiesPage /></ProtectedRoute>} />
              <Route path="/authority/tasks/:id" element={<ProtectedRoute requireAuthority><AuthorityVerifyActivitiesPage /></ProtectedRoute>} />
              <Route path="/authority/verify-activities" element={<ProtectedRoute requireAuthority><AuthorityVerifyActivitiesPage /></ProtectedRoute>} />
              <Route path="/authority/map" element={<ProtectedRoute requireAuthority><AuthorityCivicMapPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute requireAuthority><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/authority/analytics" element={<ProtectedRoute requireAuthority><AnalyticsPage /></ProtectedRoute>} />

              {/* 4. 404 NOT FOUND */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;

