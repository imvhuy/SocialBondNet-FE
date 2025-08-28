import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';

export const useProfile = (username) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchProfile = useCallback(async (force = false) => {
    // Skip if data is fresh (less than 30 seconds old) and not forced
    if (!force && data && lastFetch && Date.now() - lastFetch < 30000) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiData = await profileService.getProfile(username);

      if (apiData.private === true || apiData.message === "This profile is private" || apiData.visibility === "PRIVATE") {
        const privateProfileData = {
          id: apiData.userId,
          userId: apiData.userId,
          username: apiData.username || username,
          name: apiData.fullName || apiData.username || username,
          fullName: apiData.fullName,
          avatar: apiData.avatarUrl,
          visibility: apiData.visibility || 'PRIVATE',
          coverImage: null,
          bio: null,
          website: null,
          location: null,
          isFollowing: data?.isFollowing || false, // Preserve existing isFollowing
          isFollowingYou: data?.isFollowingYou || false,
          followStatus: data?.followStatus || 'NOT_FOLLOWING', // Preserve existing followStatus
          canFollow: true,
          isOwnProfile: false,
          message: apiData.message || "This profile is private",
        };

        setData(privateProfileData);
        setLastFetch(Date.now());
        return;
      }

      // Transform regular API data to match component expectations
      const transformedData = {
        // Basic info from API
        id: apiData.account?.id,
        email: apiData.account?.email,
        isActive: apiData.account?.isActive,
        createdAt: apiData.account?.createdAt,

        // Profile info
        name: apiData.profile?.fullName || 'Người dùng',
        username: username, // Use the username from URL
        bio: apiData.profile?.bio,
        website: apiData.profile?.website,
        location: apiData.profile?.location,
        avatar: apiData.profile?.avatarUrl,
        coverImage: apiData.profile?.coverUrl,
        birthDate: apiData.profile?.birthDate,
        visibility: apiData.profile?.visibility?.toLowerCase() || 'public',
        gender: apiData.profile?.gender,
        joinDate: apiData.account?.createdAt,

        // Follow data - will be fetched separately
        isFollowing: false,
        isFollowingYou: false,
        mutualFollowers: 0,
        followStatus: 'NOT_FOLLOWING', // Default status

        // Derived properties
        isOwnProfile: false, // Will be set in component
      };

      setData(transformedData);
      setLastFetch(Date.now());
    } catch (err) {
      console.error('Failed to fetch profile:', err);

      // If 404 and it's not own profile, create minimal profile data
      if (err.status === 404 || err.response?.status === 404) {
        const minimalProfileData = {
          username: username,
          name: username,
          isFollowing: false,
          avatar: null,
          coverImage: null,
          bio: 'Không có thông tin bio',
          website: null,
          location: null,
          visibility: 'public',
          isOwnProfile: false,
          joinDate: new Date().toISOString(),
        };

        setData(minimalProfileData);
        setError(null); // Clear error since we handled it
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [username, data, lastFetch]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username, fetchProfile]);

  // Local optimistic update (synchronous)
  const updateProfile = useCallback((updates) => {


    setData(prevData => {
      const newData = { ...prevData, ...updates };
      return newData;
    });
  }, []);

  // Server profile update (asynchronous)
  const updateProfileServer = useCallback(async (profileData) => {
    try {
      const response = await profileService.updateProfile(profileData);

      // Transform response if it has the account/profile structure
      let updatedData;
      if (response.account && response.profile) {
        updatedData = {
          id: response.account.id,
          email: response.account.email,
          isActive: response.account.isActive,
          createdAt: response.account.createdAt,
          name: response.profile.fullName,
          bio: response.profile.bio,
          website: response.profile.website,
          location: response.profile.location,
          avatar: response.profile.avatarUrl,
          coverImage: response.profile.coverUrl,
          birthDate: response.profile.birthDate,
          visibility: response.profile.visibility?.toLowerCase(),
          gender: response.profile.gender,
        };
      } else {
        updatedData = response;
      }

      setData(prevData => ({ ...prevData, ...updatedData }));
      return updatedData;
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  }, []);

  // Fetch follow status separately for non-own profiles  
  const fetchFollowStatus = useCallback(async (profileData) => {
    if (!profileData || !profileData.id) {
      return; // Silently return if no userId available
    }

    try {
      const relationship = await profileService.getRelationship(profileData.id);

      // Map API response to profile data
      // API Response: { isFollowing: boolean, isFollowed: boolean, canFollow: boolean }
      const followUpdates = {
        isFollowing: relationship.isFollowing || false,
        isFollowingYou: relationship.isFollowed || false,
        canFollow: relationship.canFollow !== false, // Default to true
        followStatus: relationship.isFollowing ? 'FOLLOWING' : 'NOT_FOLLOWING'
      };

      setData(prevData => {
        // Don't override if optimistic update already shows FOLLOWING
        if (prevData.followStatus === 'FOLLOWING' && followUpdates.followStatus === 'NOT_FOLLOWING') {
          return prevData;
        }



        return {
          ...prevData,
          ...followUpdates
        };
      });

    } catch (error) {
      console.warn('Could not fetch follow status for user:', profileData.username, error);
      // Keep default values for private profiles or errors
    }
  }, []);

  // Auto-fetch follow status after profile is loaded
  useEffect(() => {
    if (data && data.id && !loading && !error) {
      // Only fetch for other users' profiles, not own profile
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.username && data.username !== currentUser.username) {
        // Add small delay to avoid overriding optimistic updates
        const timer = setTimeout(() => {
          fetchFollowStatus(data);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [data?.id, data?.username, fetchFollowStatus, loading, error]);

  const refetch = useCallback(() => fetchProfile(true), [fetchProfile]);

  return {
    data,
    loading,
    error,
    refetch,
    updateProfile,
    updateProfileServer,
    isStale: lastFetch && Date.now() - lastFetch > 60000 // 1 minute
  };
};

export const useCounters = (userId) => {
  const [data, setData] = useState({
    posts: 0,
    followers: 0,
    following: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounters = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Only use follow stats API with userId
      const stats = await profileService.getFollowStats(userId);

      setData({
        posts: stats.posts || 0,
        followers: stats.followers || 0,
        following: stats.following || 0
      });
    } catch (err) {
      // If API fails, use default values instead of showing error
      console.warn('Failed to fetch counters, using defaults:', err);
      const defaultCounters = {
        posts: 0,
        followers: 0,
        following: 0
      };
      setData(defaultCounters);
      setError(null); // Don't show error to user for counters
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  const updateCounters = useCallback((updates) => {
    setData(prevData => ({ ...prevData, ...updates }));
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchCounters,
    updateCounters
  };
};

export const usePosts = (username) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);

  const fetchPosts = useCallback(async (reset = false) => {
    if (!username) return;

    try {
      if (reset) {
        setLoading(true);
        setData([]);
        setCursor(null);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const response = await profileService.getPosts(
        username,
        reset ? null : cursor,
        10
      );

      const newPosts = response.posts || response.data || [];

      if (reset) {
        setData(newPosts);
      } else {
        setData(prevData => [...prevData, ...newPosts]);
      }

      setCursor(response.nextCursor || response.cursor);
      setHasMore(!!(response.nextCursor || response.cursor));

    } catch (err) {
      // Don't show error to user, just log and show empty state
      console.warn('Failed to fetch posts:', err);
      if (reset) {
        setData([]);
      }
      setError(null);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [username, cursor]);

  useEffect(() => {
    fetchPosts(true);
  }, [username]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPosts(false);
    }
  }, [fetchPosts, loadingMore, hasMore]);

  const refetch = useCallback(() => fetchPosts(true), [fetchPosts]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch
  };
};

export const useMedia = (username, type = 'all') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false); // Default to false to avoid initial API call
  const [cursor, setCursor] = useState(null);

  const fetchMedia = useCallback(async (reset = false) => {
    if (!username) return;

    // Temporarily disable media API calls until backend is ready
    console.log(`Media API not implemented yet for ${type} in ${username}`);

    setLoading(false);
    setLoadingMore(false);
    setData([]);
    setHasMore(false);
    setError(null);

    return;

    /* Original implementation - will be restored when backend is ready
    try {
      if (reset) {
        setLoading(true);
        setData([]);
        setCursor(null);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      const response = await profileService.getMedia(
        username, 
        type,
        reset ? null : cursor, 
        20
      );
      
      const newMedia = response.media || response.data || [];
      
      if (reset) {
        setData(newMedia);
      } else {
        setData(prevData => [...prevData, ...newMedia]);
      }
      
      setCursor(response.nextCursor || response.cursor);
      setHasMore(!!(response.nextCursor || response.cursor));
      
    } catch (err) {
      // Don't show error to user, just log and show empty state
      console.warn('Failed to fetch media:', err);
      if (reset) {
        setData([]);
      }
      setError(null);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
    */
  }, [username, type, cursor]);

  useEffect(() => {
    fetchMedia(true);
  }, [username, type]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchMedia(false);
    }
  }, [fetchMedia, loadingMore, hasMore]);

  const refetch = useCallback(() => fetchMedia(true), [fetchMedia]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch
  };
};

export const useFollow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const followUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await profileService.followUser(userId);
      return result;
    } catch (err) {
      console.error('Follow user failed:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await profileService.unfollowUser(userId);
      return result;
    } catch (err) {
      console.error('Unfollow user failed:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptFollowRequest = useCallback(async (requesterId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await profileService.acceptFollowRequest(requesterId);
      return result;
    } catch (err) {
      console.error('Accept follow request failed:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectFollowRequest = useCallback(async (requesterId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await profileService.rejectFollowRequest(requesterId);
      return result;
    } catch (err) {
      console.error('Reject follow request failed:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    followUser,
    unfollowUser,
    acceptFollowRequest,
    rejectFollowRequest,
    loading,
    error
  };
};

export const useFollowStatus = (userId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowStatus = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await profileService.getFollowStatus(userId);
      setIsFollowing(result.isFollowing || false);
    } catch (err) {
      console.error('Failed to fetch follow status:', err);
      setError(err);
      setIsFollowing(false); // Default fallback
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFollowStatus();
  }, [fetchFollowStatus]);

  const updateIsFollowing = useCallback((following) => {
    setIsFollowing(following);
  }, []);

  return {
    isFollowing,
    loading,
    error,
    refetch: fetchFollowStatus,
    updateIsFollowing
  };
};

export const useFollowStats = (userId) => {
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    pendingRequests: 0,
    posts: 0 // Not from API, managed separately
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowStats = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await profileService.getFollowStats(userId);
      setStats(prevStats => ({
        ...prevStats,
        followers: result.followers || 0,
        following: result.following || 0,
        pendingRequests: result.pendingRequests || 0
        // Keep existing posts count
      }));
    } catch (err) {
      console.error('Failed to fetch follow stats:', err);
      setError(err);
      // Keep existing values on error
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFollowStats();
  }, [fetchFollowStats]);

  const updateStats = useCallback((updates) => {
    setStats(prevStats => ({ ...prevStats, ...updates }));
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchFollowStats,
    updateStats
  };
};

// New hook for relationship info
export const useRelationship = (targetUserId) => {
  const [relationship, setRelationship] = useState({
    isFollowing: false,
    isFollowed: false,
    canFollow: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRelationship = useCallback(async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await profileService.getRelationship(targetUserId);
      setRelationship({
        isFollowing: result.isFollowing || false,
        isFollowed: result.isFollowed || false,
        canFollow: result.canFollow !== false // Default to true
      });
    } catch (err) {
      console.error('Failed to fetch relationship:', err);
      setError(err);
      // Keep default values on error
      setRelationship({
        isFollowing: false,
        isFollowed: false,
        canFollow: true
      });
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchRelationship();
  }, [fetchRelationship]);

  const updateRelationship = useCallback((updates) => {
    setRelationship(prevRel => ({ ...prevRel, ...updates }));
  }, []);

  return {
    relationship,
    loading,
    error,
    refetch: fetchRelationship,
    updateRelationship
  };
};

