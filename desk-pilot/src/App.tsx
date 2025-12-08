import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Public & Auth
import { Landing } from './pages/public/Landing';
import { Privacy } from './pages/public/Privacy';
import { HowItWorks } from './pages/public/HowItWorks';
import { HRLogin } from './pages/auth/HRLogin';
import { HRSignup } from './pages/auth/HRSignup';
import { EmployeeLogin } from './pages/auth/EmployeeLogin';
import { AcceptInvite } from './pages/auth/AcceptInvite';

// HR
import { HRDashboard } from './pages/hr/HRDashboard';
import { HRAnalytics } from './pages/hr/HRAnalytics';
import { EmployeeAnalyticsDetail } from './pages/hr/EmployeeAnalyticsDetail';
import { AddEmployees } from './pages/hr/AddEmployees';
import { CompanySettings } from './pages/hr/CompanySettings';
import { ProtectedHRRoute } from './components/auth/ProtectedHRRoute';

// Employee
import { EmployeeHome } from './pages/employee/EmployeeHome';
import { ExerciseLibrary } from './pages/employee/ExerciseLibrary';
import { ExerciseDetail } from './pages/employee/ExerciseDetail';
import { History } from './pages/employee/History';
import { Leaderboard } from './pages/employee/Leaderboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<Landing />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="how-it-works" element={<HowItWorks />} />

        {/* Auth */}
        <Route path="auth/hr/login" element={<HRLogin />} />
        <Route path="auth/hr/signup" element={<HRSignup />} />
        <Route path="auth/employee/login" element={<EmployeeLogin />} />
        <Route path="join" element={<AcceptInvite />} />

        {/* HR - Protected Routes */}
        <Route element={<ProtectedHRRoute />}>
          <Route path="hr/dashboard" element={<HRDashboard />} />
          <Route path="hr/analytics" element={<HRAnalytics />} />
          <Route path="hr/analytics/:employeeId" element={<EmployeeAnalyticsDetail />} />
          <Route path="hr/employees" element={<AddEmployees />} />
          <Route path="hr/settings" element={<CompanySettings />} />
        </Route>

        {/* Employee - In real app, these would be protected */}
        <Route path="employee/home" element={<EmployeeHome />} />
        <Route path="employee/exercises" element={<ExerciseLibrary />} />
        <Route path="employee/exercise/:id" element={<ExerciseDetail />} />
        <Route path="employee/history" element={<History />} />
        <Route path="employee/leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
