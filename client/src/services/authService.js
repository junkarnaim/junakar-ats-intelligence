import api from './api'

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async updateProfile(payload) {
    const { data } = await api.put('/auth/profile', payload)
    return data
  },

  async logout() {
    const { data } = await api.post('/auth/logout')
    return data
  },
}
