import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile, useCounters } from '../../hooks/useProfile';
import {
  ProfileHeader,
  ProfileTabs,
  TabContent,
  EditProfileModal,
  PrivateProfileView
} from '../../components/profile';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);

  // Determine the profile username to fetch
  const profileUsername = username || user?.username;
  const isOwnProfile = !username || username === user?.username;

  // Fetch profile data
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    refetch: refetchProfile
  } = useProfile(profileUsername);

  const {
    data: counters,
    loading: countersLoading,
    updateCounters,
    refetch: refetchCounters
  } = useCounters(profile?.id);

  // Handle profile updates
  const handleProfileUpdate = (updates) => {
    if (profile) {
      console.log('handleProfileUpdate: Before update:', {
        currentFollowStatus: profile?.followStatus,
        updates
      });
      updateProfile(updates);
      console.log('handleProfileUpdate: After update called');
    }
  };

  // Handle copy profile link
  const handleCopyLink = async () => {
    const profileUrl = `${window.location.origin}/u/${profile.username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      // You could show a toast notification here
      console.log('Profile link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Handle QR code sharing (placeholder)
  const handleShareQR = () => {
    console.log('Share QR code for profile');
  };

  // Handle follow state changes
  const handleFollowChange = (newFollowStatus) => {
    console.log('handleFollowChange called with status:', newFollowStatus);

    if (profile) {
      // Update profile follow status optimistically
      const updates = {
        followStatus: newFollowStatus,
        // Also update legacy fields for compatibility
        isFollowing: newFollowStatus === 'FOLLOWING' || newFollowStatus === 'PENDING'
      };

      console.log('Updating profile with optimistic updates:', updates);
      handleProfileUpdate(updates);

      // Update counters optimistically based on follow status
      let followerDelta = 0;
      if (newFollowStatus === 'FOLLOWING') {
        followerDelta = 1;
      } else if (newFollowStatus === 'NOT_FOLLOWING') {
        followerDelta = -1;
      }
      // For PENDING, no immediate change to follower count

      if (followerDelta !== 0) {
        updateCounters({
          followers: Math.max(0, (counters?.followers || 0) + followerDelta)
        });
      }

      // Delay refetch to ensure server has processed the change
      setTimeout(() => {
        console.log('Refetching profile and counters after follow action');
        refetchProfile();
        refetchCounters();
      }, 3000); // Increased delay to allow optimistic updates to be seen
    }
  };

  // Check if profile should be shown as private
  const shouldShowPrivateView = profile &&
    (profile.private || profile.visibility === 'PRIVATE' || profile.visibility === 'private') &&
    !isOwnProfile &&
    !(profile.isFollowing || profile.followStatus === 'FOLLOWING' || profile.followStatus === 'PENDING');

  // Debug private profile logic (only when status changes)
  if (profile?.followStatus) {
    console.log('Profile.jsx: Private profile view logic:', {
      username: profile?.username,
      followStatus: profile?.followStatus,
      shouldShowPrivateView
    });
  }

  // Show loading state
  if (profileLoading && !profile) {
    return (
      <div className="max-w-5xl mx-auto">
        <ProfileHeaderSkeleton />
      </div>
    );
  }

  // Show error state
  if (profileError && !profile) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-4">Không thể tải thông tin profile.</p>
          <button
            onClick={refetchProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Show private profile view if needed
  if (shouldShowPrivateView) {
    return (
      <div className="space-y-6">
        <PrivateProfileView
          profile={profile}
          onFollowChange={handleFollowChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        counters={counters}
        loading={profileLoading || countersLoading}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={handleProfileUpdate}
        onFollowChange={handleFollowChange}
        onEditProfile={() => setShowEditModal(true)}
        onCopyLink={handleCopyLink}
        onShareQR={handleShareQR}
      />

      {/* Profile Tabs */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counters={counters}
      />

      {/* Tab Content */}
      <TabContent
        activeTab={activeTab}
        username={profileUsername}
        profile={profile}
      />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

// Skeleton component for loading state
const ProfileHeaderSkeleton = () => (
  <div className="max-w-5xl mx-auto animate-pulse">
    {/* Cover skeleton */}
    <div className="bg-gray-300 w-full h-48 md:h-64 rounded-lg" />

    {/* Profile info skeleton */}
    <div className="bg-white rounded-lg shadow-md -mt-16 relative z-10 p-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6">
        {/* Avatar skeleton */}
        <div className="relative -mt-16 mb-4 lg:mb-0">
          <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white" />
        </div>

        {/* Info skeleton */}
        <div className="flex-1">
          <div className="space-y-3">
            <div className="h-8 bg-gray-300 rounded w-48" />
            <div className="h-5 bg-gray-300 rounded w-32" />
            <div className="h-4 bg-gray-300 rounded w-96" />
            <div className="h-4 bg-gray-300 rounded w-40" />
          </div>

          {/* Stats skeleton */}
          <div className="flex space-x-6 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <div className="h-6 bg-gray-300 rounded w-12 mb-1" />
                <div className="h-4 bg-gray-300 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
