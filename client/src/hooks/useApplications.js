import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applicationService } from '../services/applicationService'

/** Candidate: fetch own applications. */
export function useMyApplications() {
  return useQuery({
    queryKey: ['applications', 'mine'],
    queryFn: applicationService.getMyApplications,
  })
}

/** Shared: fetch a single application by ID. */
export function useApplication(id) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationService.getApplicationById(id),
    enabled: Boolean(id),
  })
}

/** Candidate: submit a new application. Returns { application, aiAvailable }. */
export function useCreateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: applicationService.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'mine'] })
    },
  })
}

/** Recruiter: fetch all applications, optionally filtered by jobId. */
export function useAllApplications(params = {}) {
  return useQuery({
    queryKey: ['applications', 'all', params],
    queryFn: () => applicationService.getAllApplications(params),
  })
}

/** Recruiter: update an application's status. */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => applicationService.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
