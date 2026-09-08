import api from './api'

export const jobService = {
  /** Public: list all jobs with optional filters. */
  async getJobs(filters = {}) {
    const { data } = await api.get('/jobs', { params: filters })
    return data.jobs
  },

  /** Public: get a single job by ID. */
  async getJobById(id) {
    const { data } = await api.get(`/jobs/${id}`)
    return data.job
  },

  /** Recruiter: create a new job posting. */
  async createJob(payload) {
    const { data } = await api.post('/jobs', payload)
    return data.job
  },

  /** Recruiter: update or archive an existing job. */
  async updateJob(id, payload) {
    const { data } = await api.patch(`/jobs/${id}`, payload)
    return data.job
  },
}
