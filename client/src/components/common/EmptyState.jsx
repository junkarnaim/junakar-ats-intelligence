import { Box, Button, Paper, Typography } from '@mui/material'

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 3, md: 5 },
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mx: 'auto', maxWidth: 480 }}>
        {description}
      </Typography>
      {actionLabel ? (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        </Box>
      ) : null}
    </Paper>
  )
}

export default EmptyState
