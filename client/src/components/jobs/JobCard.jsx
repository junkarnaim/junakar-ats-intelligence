import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'

function JobCard({ job }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h6">{job.title}</Typography>
            <Typography color="text.secondary">{job.company}</Typography>
          </Box>
          <Chip color="success" label={job.status} size="small" />
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ color: 'text.secondary', my: 2 }}
        >
          <Stack alignItems="center" direction="row" spacing={0.75}>
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography variant="body2">{job.location}</Typography>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={0.75}>
            <BusinessCenterOutlinedIcon fontSize="small" />
            <Typography variant="body2">{job.experience}</Typography>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={0.75}>
            <PaymentsOutlinedIcon fontSize="small" />
            <Typography variant="body2">{job.salary}</Typography>
          </Stack>
        </Stack>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {job.description}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={1}>
          {job.requiredSkills.map((skill) => (
            <Chip key={skill} label={skill} size="small" />
          ))}
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        <Stack
          alignItems={{ xs: 'stretch', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Typography color="text.secondary" variant="body2">
            Posted {formatDate(job.postedAt)} • {job.applications} applications
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to={`/jobs/${job.id}`} variant="outlined">
              View details
            </Button>
            <Button
              component={RouterLink}
              to={`/candidate/jobs/${job.id}/apply`}
              variant="contained"
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default JobCard
