import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jobService } from '../services/jobService'

/** Public: fetch all jobs with optional filters. */
export function useJobs(filters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.getJobs(filters),
  })
}

/** Public: fetch a single job by ID. */
export function useJob(id) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobService.getJobById(id),
    enabled: Boolean(id),
  })
}

/** Recruiter: create a new job. */
export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jobService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

/** Recruiter: update an existing job. */
export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }) => jobService.updateJob(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
