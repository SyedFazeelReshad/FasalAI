import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import RoleSwitcherBanner from '../components/common/RoleSwitcherBanner';
import PortalSelect from '../pages/PortalSelect';

// Farmer imports
import FarmerDashboard from '../pages/farmer/Dashboard';
import Detect from '../pages/farmer/Detect';
import PredictionResult from '../pages/farmer/PredictionResult';
import Cases from '../pages/farmer/Cases';
import Advisory from '../pages/farmer/Advisory';

// Extension Worker imports
import ExtensionDashboard from '../pages/extension/Dashboard';
import ExtensionCases from '../pages/extension/Cases';

// Official imports
import OfficialDashboard from '../pages/official/Dashboard';
import OfficialCases from '../pages/official/Cases';
import OfficialTrends from '../pages/official/Trends';
import OfficialHotspots from '../pages/official/Hotspots';
import OfficialRiskAreas from '../pages/official/RiskAreas';

const AppRoutes = () => {
  return (
    <>
      <RoleSwitcherBanner />
      <Routes>
        {/* Unified 3-in-1 Selection Hub as default entry */}
        <Route path="/" element={<PortalSelect />} />

        {/* Farmer Ecosystem Routes */}
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

        {/* Extension Worker Ecosystem Routes */}
        <Route path="/extension/*" element={
          <AppShell role="extension" user={{ name: 'Dr. Anita Sharma', email: 'anita.sharma@kvk.gov.in' }}>
            <Routes>
              <Route path="dashboard" element={<ExtensionDashboard />} />
              <Route path="cases" element={<ExtensionCases />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AppShell>
        } />

        {/* Official Surveillance Routes */}
        <Route path="/official/*" element={
          <AppShell role="official" user={{ name: 'District Collector Desk', email: 'surveillance@agri.gov.in' }}>
            <Routes>
              <Route path="dashboard" element={<OfficialDashboard />} />
              <Route path="cases" element={<OfficialCases />} />
              <Route path="trends" element={<OfficialTrends />} />
              <Route path="hotspots" element={<OfficialHotspots />} />
              <Route path="risk-areas" element={<OfficialRiskAreas />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AppShell>
        } />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
