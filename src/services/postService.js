import { apiClient } from '../config/apiClient'

class PostService {
  async getPosts(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`/posts?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getPostById(postId) {
    try {
      const response = await apiClient.get(`/posts/${postId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async createPost(postData) {
    try {
      const response = await apiClient.post('/posts', postData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async updatePost(postId, postData) {
    try {
      const response = await apiClient.put(`/posts/${postId}`, postData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async deletePost(postId) {
    try {
      const response = await apiClient.delete(`/posts/${postId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async likePost(postId) {
    try {
      const response = await apiClient.post(`/posts/${postId}/like`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async unlikePost(postId) {
    try {
      const response = await apiClient.delete(`/posts/${postId}/like`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getPostComments(postId, page = 1) {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments?page=${page}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async addComment(postId, commentData) {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, commentData)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const postService = new PostService()
