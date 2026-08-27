import { useQuery } from '@tanstack/react-query'
import { jobService } from '../services/jobService'

export function useJobs(filters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.getJobs(filters),
  })
}

export function useJob(id) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobService.getJobById(id),
    enabled: Boolean(id),
  })
}
