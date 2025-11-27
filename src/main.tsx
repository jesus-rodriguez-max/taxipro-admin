import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './auth/login';
import RequireAdmin from './auth/requireAdmin';
import Layout from './components/Layout';
import Dashboard from './dashboard';
import DriversList from './dashboard/drivers/list';
import DriverDetails from './dashboard/drivers/details';
import DriverDocuments from './dashboard/drivers/documents';
import SuspendDriver from './dashboard/drivers/suspend';
import PassengersList from './dashboard/passengers/list';
import PassengerDetails from './dashboard/passengers/details';
import TripsList from './dashboard/trips/list';
import LiveTrips from './dashboard/trips/live';
import SafetyAlerts from './dashboard/safety/alerts';
import SafetyRecordings from './dashboard/safety/recordings';
import FeatureFlags from './dashboard/settings/flags';
import Tariffs from './dashboard/settings/tariffs';
import StripeSettings from './dashboard/settings/stripe';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAdmin>
              <Layout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="drivers" element={<DriversList />} />
          <Route path="drivers/:id" element={<DriverDetails />} />
          <Route path="drivers/:id/documents" element={<DriverDocuments />} />
          <Route path="drivers/:id/suspend" element={<SuspendDriver />} />
          <Route path="passengers" element={<PassengersList />} />
          <Route path="passengers/:id" element={<PassengerDetails />} />
          <Route path="trips" element={<TripsList />} />
          <Route path="trips/live" element={<LiveTrips />} />
          <Route path="safety" element={<SafetyAlerts />} />
          <Route path="safety/recordings" element={<SafetyRecordings />} />
          <Route path="settings" element={<FeatureFlags />} />
          <Route path="settings/tariffs" element={<Tariffs />} />
          <Route path="settings/stripe" element={<StripeSettings />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
