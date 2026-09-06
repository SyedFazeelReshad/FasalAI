import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import FarmerDashboard from '../pages/farmer/Dashboard';
import Detect from '../pages/farmer/Detect';
import PredictionResult from '../pages/farmer/PredictionResult';
import Cases from '../pages/farmer/Cases';
import Advisory from '../pages/farmer/Advisory';
import ExtensionDashboard from '../pages/extension/Dashboard';
import ExtensionCases from '../pages/extension/Cases';
import OfficialDashboard from '../pages/official/Dashboard';
import OfficialCases from '../pages/official/Cases';
import OfficialTrends from '../pages/official/Trends';
import OfficialHotspots from '../pages/official/Hotspots';
import OfficialRiskAreas from '../pages/official/RiskAreas';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Farmer Routes */}
      <Route path="/farmer/*" element={
        <AppShell role="farmer" user={{ name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com' }}>
          <Routes>
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="detect" element={<Detect />} />
            <Route path="detection/result/:caseId" element={<PredictionResult />} />
            <Route path="cases" element={<Cases />} />
            <Route path="advisory/:caseId" element={<Advisory />} />
            <Route path="farms" element={<FarmerDashboard />} />
            <Route path="farms/add" element={<FarmerDashboard />} />
            <Route path="settings" element={<FarmerDashboard />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </AppShell>
      } />

      {/* Extension Worker Routes */}
      <Route path="/extension/*" element={
        <AppShell role="extension" user={{ name: 'Priya Sharma', email: 'priya.sharma@example.com' }}>
          <Routes>
            <Route path="dashboard" element={<ExtensionDashboard />} />
            <Route path="cases" element={<ExtensionCases />} />
            <Route path="cases/pending" element={<ExtensionCases />} />
            <Route path="cases/:caseId" element={<ExtensionCases />} />
            <Route path="verified" element={<ExtensionCases />} />
            <Route path="settings" element={<ExtensionCases />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </AppShell>
      } />

      {/* Agriculture Official Routes */}
      <Route path="/official/*" element={
        <AppShell role="official" user={{ name: 'Dr. Amit Singh', email: 'amit.singh@example.com' }}>
          <Routes>
            <Route path="dashboard" element={<OfficialDashboard />} />
            <Route path="cases" element={<OfficialCases />} />
            <Route path="trends" element={<OfficialTrends />} />
            <Route path="hotspots" element={<OfficialHotspots />} />
            <Route path="risk-areas" element={<OfficialRiskAreas />} />
            <Route path="reports" element={<OfficialCases />} />
            <Route path="settings" element={<OfficialCases />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </AppShell>
      } />

      {/* Default redirect to farmer dashboard */}
      <Route path="/" element={<Navigate to="/farmer/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;