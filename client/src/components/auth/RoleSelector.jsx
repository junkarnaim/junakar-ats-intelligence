import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined'
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'
import { Card, CardActionArea, Grid, Stack, Typography } from '@mui/material'

const roles = [
  {
    value: 'candidate',
    title: 'Candidate',
    description: 'Browse roles, upload resumes, and track applications.',
    icon: PersonSearchOutlinedIcon,
  },
  {
    value: 'recruiter',
    title: 'Recruiter',
    description: 'Create jobs, review applicants, and rank candidates.',
    icon: BusinessCenterOutlinedIcon,
  },
]

function RoleSelector({ value, onChange }) {
  return (
    <Grid container spacing={2}>
      {roles.map((role) => {
        const Icon = role.icon
        const selected = value === role.value

        return (
          <Grid item xs={12} sm={6} key={role.value}>
            <Card
              variant="outlined"
              sx={{
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: selected ? 'primary.light' : 'background.paper',
                boxShadow: 'none',
              }}
            >
              <CardActionArea onClick={() => onChange(role.value)} sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Icon color={selected ? 'primary' : 'action'} />
                  <Typography fontWeight={800}>{role.title}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {role.description}
                  </Typography>
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default RoleSelector
