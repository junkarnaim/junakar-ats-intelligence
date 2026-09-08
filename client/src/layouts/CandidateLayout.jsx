import MenuIcon from '@mui/icons-material/Menu'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { useAuth } from '../hooks/useAuth'

const drawerWidth = 260

function CandidateLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ bgcolor: 'background.default', display: 'flex', minHeight: '100vh' }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            aria-label="Open sidebar"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Stack alignItems="center" direction="row" spacing={1.25} sx={{ mr: 'auto' }}>
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: 'primary.main',
                borderRadius: 2,
                color: 'common.white',
                display: 'grid',
                height: 36,
                placeItems: 'center',
                width: 36,
              }}
            >
              <WorkOutlineOutlinedIcon fontSize="small" />
            </Box>
            <Typography variant="h6">ATS Intelligence</Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Button onClick={handleLogout} variant="outlined">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ flexShrink: { md: 0 }, width: { md: drawerWidth } }}
      >
        <Drawer
          ModalProps={{ keepMounted: true }}
          onClose={() => setMobileOpen(false)}
          open={mobileOpen}
          sx={{ display: { xs: 'block', md: 'none' } }}
          variant="temporary"
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              borderRight: 1,
              borderColor: 'divider',
              width: drawerWidth,
            },
          }}
          variant="permanent"
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default CandidateLayout
