import { apiClient } from '../config/apiClient';

export const profileService = {
  // Get user profile by username
  async getProfile(username) {
    try {
      const response = await apiClient.get(`/profile/${username}`);
      return response.data;
    } catch (error) {
      console.error('Profile API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        username: username
      });

      throw error.response?.data || error;
    }
  },



  // Get user posts with pagination
  async getPosts(username, cursor = null, limit = 10) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;

      const response = await apiClient.get(`/profile/${username}/posts`, { params });
      return response.data;
    } catch (error) {
      console.error('Posts API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Get user media (photos/videos) with pagination
  async getMedia(username, type = 'all', cursor = null, limit = 20) {
    try {
      const params = { type, limit };
      if (cursor) params.cursor = cursor;

      const response = await apiClient.get(`/profile/${username}/media`, { params });
      return response.data;
    } catch (error) {
      console.error('Media API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Follow user by userId
  // Updated: Private profiles now include userId in response
  // Private profile response: { userId, username, fullName, avatarUrl, visibility: "PRIVATE" }
  async followUser(userId) {
    try {
      const response = await apiClient.post(`/follows/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Follow API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Unfollow user by userId
  async unfollowUser(userId) {
    try {
      const response = await apiClient.delete(`/follows/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Unfollow API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Get follow status by userId
  async getFollowStatus(userId) {
    try {
      const response = await apiClient.get(`/follows/status/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Follow Status API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Get relationship info by userId  
  // Works with all profiles (both public and private now have userId)
  // Response: { isFollowing: boolean, isFollowed: boolean, canFollow: boolean }
  async getRelationship(userId) {
    try {
      const response = await apiClient.get(`/follows/relationship/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Relationship API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Get follow statistics - Updated for new backend response
  async getFollowStats(userId) {
    try {
      const response = await apiClient.get(`/follows/stats/${userId}`);

      // New backend response format: { followers, following, pendingRequests }
      const data = response.data;
      return {
        followers: data.followers || 0,
        following: data.following || 0,
        pendingRequests: data.pendingRequests || 0,
        posts: 0 // Posts count not provided by follow stats API
      };
    } catch (error) {
      console.error('Follow Stats API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Accept follow request by requester userId
  async acceptFollowRequest(requesterId) {
    try {
      const response = await apiClient.post(`/follows/requests/${requesterId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Accept Follow Request API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Reject follow request by requester userId
  async rejectFollowRequest(requesterId) {
    try {
      const response = await apiClient.delete(`/follows/requests/${requesterId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Reject Follow Request API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error.response?.data || error;
    }
  },

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('file', file); // Backend expects 'file' parameter

      const response = await apiClient.put('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error.response?.data || error;
    }
  },

  // Upload cover image
  async uploadCover(file) {
    try {
      const formData = new FormData();
      formData.append('file', file); // Backend expects 'file' parameter

      const response = await apiClient.put('/profile/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload cover error:', error);
      throw error.response?.data || error;
    }
  },

  // Update privacy settings
  async updatePrivacy(settings) {
    try {
      const response = await apiClient.put('/profile/privacy', settings);
      return response.data;
    } catch (error) {
      console.error('Privacy API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Check if user exists
  async checkUserExists(username) {
    try {
      const response = await apiClient.get(`/profile/${username}/exists`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { exists: false };
      }
      console.error('User exists API Error:', error);
      throw error.response?.data || error;
    }
  },

  // Get profile visibility settings
  async getVisibilitySettings(username) {
    try {
      const response = await apiClient.get(`/profile/${username}/visibility`);
      return response.data;
    } catch (error) {
      console.error('Visibility API Error:', error);
      throw error.response?.data || error;
    }
  }
};
