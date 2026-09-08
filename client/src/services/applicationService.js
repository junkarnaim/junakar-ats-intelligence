import api from './api'

export const applicationService = {
  /**
   * Candidate: submit a new application with resume PDF.
   * Returns the saved application + aiAvailable flag.
   */
  async createApplication(payload) {
    const formData = new FormData()
    formData.append('jobId', payload.jobId)
    formData.append('resume', payload.resume)

    if (payload.coverLetter) {
      formData.append('coverLetter', payload.coverLetter)
    }

    const { data } = await api.post('/applications', formData)
    return data
  },

  /** Candidate: get own applications. */
  async getMyApplications() {
    const { data } = await api.get('/applications/mine')
    return data.applications
  },

  /** Shared: get single application by ID. */
  async getApplicationById(id) {
    const { data } = await api.get(`/applications/${id}`)
    return data.application
  },

  /** Recruiter: get all applications, optionally filtered by jobId. */
  async getAllApplications(params = {}) {
    const { data } = await api.get('/applications', { params })
    return data.applications
  },

  /** Recruiter: update an application's status. */
  async updateApplicationStatus(id, status) {
    const { data } = await api.patch(`/applications/${id}/status`, { status })
    return data.application
  },
}
