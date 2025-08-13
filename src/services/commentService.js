import { apiClient } from '../config/apiClient'

class CommentService {
  async getComments(postId, page = 1) {
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

  async updateComment(commentId, commentData) {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, commentData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async deleteComment(commentId) {
    try {
      const response = await apiClient.delete(`/comments/${commentId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async likeComment(commentId) {
    try {
      const response = await apiClient.post(`/comments/${commentId}/like`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const commentService = new CommentService()
