import { Box, Container, Pagination, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loader from '../../components/common/Loader'
import JobCard from '../../components/jobs/JobCard'
import JobFilters from '../../components/jobs/JobFilters'
import { useJobs } from '../../hooks/useJobs'

const pageSize = 4

function Jobs() {
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: '',
    experience: '',
    skill: '',
  })
  const { data: jobs = [], isError, isLoading } = useJobs(filters)

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * pageSize
    return jobs.slice(start, start + pageSize)
  }, [jobs, page])

  const pageCount = Math.max(1, Math.ceil(jobs.length / pageSize))

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography component="h1" variant="h3">
          Browse jobs
        </Typography>
        <Typography color="text.secondary">
          Search active roles by title, company, location, experience, and skill.
        </Typography>
      </Stack>

      <Paper sx={{ mb: 3, p: { xs: 2, md: 3 } }}>
        <JobFilters filters={filters} onChange={handleFiltersChange} />
      </Paper>

      {isLoading ? <Loader /> : null}
      {isError ? <ErrorMessage message="Unable to load jobs." /> : null}
      {!isLoading && !isError && jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try changing your search, location, experience, or skill filters."
        />
      ) : null}
      {!isLoading && !isError && jobs.length > 0 ? (
        <>
          <Stack spacing={2.5}>
            {paginatedJobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              color="primary"
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        </>
      ) : null}
    </Container>
  )
}

export default Jobs
