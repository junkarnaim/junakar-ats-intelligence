import api from './api'

export const candidateService = {
  async getCandidates(params = {}) {
    const { data } = await api.get('/candidates', { params })
    return data
  },
}
