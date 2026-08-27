import api from './api'

export const applicationService = {
  async createApplication(payload) {
    const formData = new FormData()
    formData.append('jobId', payload.jobId)
    formData.append('resume', payload.resume)

    if (payload.coverLetter) {
      formData.append('coverLetter', payload.coverLetter)
    }

    const { data } = await api.post('/applications', formData)
    return data.application
  },

  async getMyApplications() {
    const { data } = await api.get('/applications/mine')
    return data.applications
  },

  async getApplicationById(id) {
    const { data } = await api.get(`/applications/${id}`)
    return data.application
  },
}
