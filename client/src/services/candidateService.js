import api from './api'

export const candidateService = {
  async getCandidates(params = {}) {
    if (import.meta.env.VITE_USE_API === 'true') {
      const { data } = await api.get('/candidates', { params })
      return data
    }

    return []
  },
}
