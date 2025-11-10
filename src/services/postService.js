import { apiClient } from '../config/apiClient'

class PostService {
  async getPosts(page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/timeline?page=${page}&size=${size}`)
      console.log(response.data)
      return response.data
    } catch (error) {
      throw error
    }
  }
  
}

export const postService = new PostService()
