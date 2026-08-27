import { Navigate, Outlet } from 'react-router-dom'
import { USER_ROLES } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'
import Loader from './Loader'

function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <Loader minHeight={520} />
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirectTo =
      user.role === USER_ROLES.recruiter
        ? '/recruiter/dashboard'
        : '/candidate/dashboard'

    return <Navigate replace to={redirectTo} />
  }

  return <Outlet />
}

export default ProtectedRoute
