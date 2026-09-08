import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import { NavLink } from 'react-router-dom'

const candidateItems = [
  {
    label: 'Dashboard',
    path: '/candidate/dashboard',
    icon: DashboardOutlinedIcon,
  },
  {
    label: 'My Applications',
    path: '/candidate/applications',
    icon: DescriptionOutlinedIcon,
  },
  {
    label: 'Profile',
    path: '/candidate/profile',
    icon: PersonOutlineOutlinedIcon,
  },
  {
    label: 'Browse Jobs',
    path: '/jobs',
    icon: WorkOutlineOutlinedIcon,
  },
]

const recruiterItems = [
  {
    label: 'Dashboard',
    path: '/recruiter/dashboard',
    icon: DashboardOutlinedIcon,
  },
  {
    label: 'My Jobs',
    path: '/recruiter/jobs',
    icon: WorkOutlineOutlinedIcon,
  },
  {
    label: 'Applications',
    path: '/recruiter/applications',
    icon: DescriptionOutlinedIcon,
  },
]

function Sidebar({ role = 'candidate', onNavigate }) {
  const items = role === 'recruiter' ? recruiterItems : candidateItems

  return (
    <Box sx={{ width: 260 }}>
      <Toolbar />
      <List sx={{ px: 1.5 }}>
        {items.map((item) => {
          const Icon = item.icon

          return (
            <ListItemButton
              component={NavLink}
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.active': {
                  bgcolor: 'primary.light',
                  color: 'primary.dark',
                  fontWeight: 800,
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}

export default Sidebar
