import api from './api'

export const jobService = {
  async getJobs(filters = {}) {
    const { data } = await api.get('/jobs', { params: filters })
    return data.jobs
  },

  async getJobById(id) {
    const { data } = await api.get(`/jobs/${id}`)
    return data.job
  },
}
