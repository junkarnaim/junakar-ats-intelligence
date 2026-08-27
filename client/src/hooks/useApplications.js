import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applicationService } from '../services/applicationService'

export function useMyApplications() {
  return useQuery({
    queryKey: ['applications', 'mine'],
    queryFn: applicationService.getMyApplications,
  })
}

export function useApplication(id) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationService.getApplicationById(id),
    enabled: Boolean(id),
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: applicationService.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'mine'] })
    },
  })
}
