import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { experienceLevels, skills } from '../../data/mockData'

const allSkills = Array.from(
  new Set([...skills, 'Python', 'TypeScript', 'Docker', 'SQL', 'GraphQL', 'DevOps']),
)

function JobFilters({ filters, onChange }) {
  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

  const hasActiveFilters = Boolean(
    filters.search || filters.location || filters.experience || filters.skill,
  )

  const handleClearFilters = () => {
    onChange({
      search: '',
      location: '',
      experience: '',
      skill: '',
    })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2.5} alignItems="center">
        {/* Search jobs */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search jobs"
            placeholder="Title, company, keyword"
            size="medium"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.search ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear search"
                    edge="end"
                    onClick={() => updateFilter('search', '')}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>

        {/* Location */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Location"
            placeholder="City or remote"
            size="medium"
            value={filters.location}
            onChange={(event) => updateFilter('location', event.target.value)}
          />
        </Grid>

        {/* Experience Dropdown - Spacious full width box */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="medium" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
            <InputLabel id="experience-select-label">Experience Level</InputLabel>
            <Select
              label="Experience Level"
              labelId="experience-select-label"
              value={filters.experience}
              onChange={(event) => updateFilter('experience', event.target.value)}
            >
              <MenuItem value="">
                <em>All Experience Levels</em>
              </MenuItem>
              {experienceLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Skill Dropdown - Spacious full width box */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="medium" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
            <InputLabel id="skill-select-label">Required Skill</InputLabel>
            <Select
              label="Required Skill"
              labelId="skill-select-label"
              value={filters.skill}
              onChange={(event) => updateFilter('skill', event.target.value)}
            >
              <MenuItem value="">
                <em>All Technical Skills</em>
              </MenuItem>
              {allSkills.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {hasActiveFilters && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={handleClearFilters}
            size="small"
            startIcon={<ClearIcon />}
            variant="outlined"
            color="secondary"
          >
            Clear All Filters
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default JobFilters
