import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import CandidateLayout from '../layouts/CandidateLayout'
import PublicLayout from '../layouts/PublicLayout'
import RecruiterLayout from '../layouts/RecruiterLayout'
import ApplyJob from '../pages/candidate/ApplyJob'
import CandidateDashboard from '../pages/candidate/CandidateDashboard'
import CandidateProfile from '../pages/candidate/CandidateProfile'
import MyApplications from '../pages/candidate/MyApplications'
import Home from '../pages/public/Home'
import JobDetails from '../pages/public/JobDetails'
import Jobs from '../pages/public/Jobs'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import RecruiterApplications from '../pages/recruiter/RecruiterApplications'
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard'
import RecruiterJobs from '../pages/recruiter/RecruiterJobs'
import { USER_ROLES } from '../utils/constants'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.candidate]} />}>
        <Route element={<CandidateLayout />} path="candidate">
          <Route index element={<Navigate replace to="/candidate/dashboard" />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="jobs/:id/apply" element={<ApplyJob />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.recruiter]} />}>
        <Route element={<RecruiterLayout />} path="recruiter">
          <Route index element={<Navigate replace to="/recruiter/dashboard" />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="jobs" element={<RecruiterJobs />} />
          <Route path="applications" element={<RecruiterApplications />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default AppRoutes
