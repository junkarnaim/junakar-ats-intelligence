import SearchIcon from '@mui/icons-material/Search'
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { experienceLevels, skills } from '../../data/mockData'

function JobFilters({ filters, onChange }) {
  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <TextField
          fullWidth
          label="Search jobs"
          placeholder="Title, company, or keyword"
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3}>
        <TextField
          fullWidth
          label="Location"
          placeholder="City or remote"
          value={filters.location}
          onChange={(event) => updateFilter('location', event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={2}>
        <FormControl fullWidth>
          <InputLabel>Experience</InputLabel>
          <Select
            label="Experience"
            value={filters.experience}
            onChange={(event) => updateFilter('experience', event.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            {experienceLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4} md={2}>
        <FormControl fullWidth>
          <InputLabel>Skill</InputLabel>
          <Select
            label="Skill"
            value={filters.skill}
            onChange={(event) => updateFilter('skill', event.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            {skills.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default JobFilters
