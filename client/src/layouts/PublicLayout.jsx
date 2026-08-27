import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Box component="main">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

export default PublicLayout
