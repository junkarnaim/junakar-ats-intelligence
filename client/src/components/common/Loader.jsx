import { Box, CircularProgress } from '@mui/material'

function Loader({ minHeight = 240 }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight,
        width: 1,
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default Loader
