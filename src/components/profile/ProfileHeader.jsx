import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFollow } from '../../hooks/useProfile';
import FollowButton from './FollowButton';
import StatsBadge from './StatsBadge';
import AvatarUploader from './AvatarUploader';
import CoverUploader from './CoverUploader';

const ProfileHeader = ({
  profile,
  counters,
  loading,
  isOwnProfile,
  onProfileUpdate,
  onFollowChange,
  onEditProfile,
  onCopyLink,
  onShareQR
}) => {
  const { user } = useAuth();
  const [showCoverUploader, setShowCoverUploader] = useState(false);
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);

  if (!profile && loading) {
    return <ProfileHeaderSkeleton />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return `Tham gia từ tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  };

  const formatBirthDate = (dateString) => {
    try {
      // Handle both LocalDateTime ("2004-05-14T00:00:00") and LocalDate ("2004-05-14") formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Ngày sinh không hợp lệ';
      }
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.warn('Error formatting birth date:', error);
      return 'Ngày sinh không hợp lệ';
    }
  };

  const formatGender = (gender) => {
    const genderMap = {
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác'
    };
    return genderMap[gender] || gender;
  };

  const linkify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">$1</a>');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={profile.coverImage || profile.cover_image || "/abstract-geometric-cover.png"}
          alt="Cover"
          className="w-full h-48 md:h-64 object-cover rounded-lg"
          loading="lazy"
        />

        {/* Privacy Indicator */}
        {(profile.visibility || profile.private) && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {(profile.visibility === 'PRIVATE' || profile.visibility === 'private' || profile.private) && (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Riêng tư</span>
              </>
            )}

            {profile.visibility === 'PUBLIC' && (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Công khai</span>
              </>
            )}
          </div>
        )}

        {/* Cover Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {!isOwnProfile && (
            <>
              <button
                onClick={onCopyLink}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-lg transition-all group"
                title="Sao chép liên kết"
              >
                <svg className="w-4 h-4 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={onShareQR}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-lg transition-all group"
                title="Chia sẻ QR"
              >
                <svg className="w-4 h-4 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </button>
            </>
          )}

          {isOwnProfile && (
            <button
              onClick={() => setShowCoverUploader(true)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Chỉnh sửa ảnh bìa
            </button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-md -mt-16 relative z-10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 lg:mb-0 flex-shrink-0">
            <img
              src={profile.avatar || "/abstract-user-representation.png"}
              alt={profile.fullName || profile.full_name || profile.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            {isOwnProfile && (
              <button
                onClick={() => setShowAvatarUploader(true)}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{profile.fullName || profile.full_name || profile.name}</h1>
                <p className="text-gray-600">@{profile.username}</p>

                {profile.bio && (
                  <div
                    className="text-gray-700 mt-2 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: linkify(profile.bio) }}
                  />
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  {profile.location && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-32"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                  {(profile.joinDate || profile.createdAt) && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                      </svg>
                      <span>{formatJoinDate(profile.joinDate || profile.createdAt)}</span>
                    </div>
                  )}

                  {(profile.birthDate || profile.birth_date) && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatBirthDate(profile.birthDate || profile.birth_date)}</span>
                    </div>
                  )}

                  {profile.gender && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{formatGender(profile.gender)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4 lg:mt-0 flex-shrink-0">
                {!isOwnProfile && (
                  <>
                    <FollowButton
                      userId={profile.id}
                      followStatus={profile.followStatus || 'NOT_FOLLOWING'}
                      onFollowChange={onFollowChange}
                    />
                    <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                      Nhắn tin
                    </button>
                  </>
                )}

                {isOwnProfile && (
                  <button
                    onClick={onEditProfile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Chỉnh sửa profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <StatsBadge counters={counters} className="mt-4" />
          </div>
        </div>
      </div>

      {/* Uploaders */}
      {showAvatarUploader && (
        <AvatarUploader
          currentAvatar={profile.avatar}
          onClose={() => setShowAvatarUploader(false)}
          onUpload={(newAvatar) => {
            onProfileUpdate({ avatar: newAvatar });
            setShowAvatarUploader(false);
          }}
        />
      )}

      {showCoverUploader && (
        <CoverUploader
          currentCover={profile.coverImage || profile.cover_image}
          onClose={() => setShowCoverUploader(false)}
          onUpload={(newCover) => {
            onProfileUpdate({ coverImage: newCover, cover_image: newCover });
            setShowCoverUploader(false);
          }}
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

// Not found component
const ProfileNotFound = () => (
  <div className="max-w-5xl mx-auto">
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h2>
      <p className="text-gray-600">Tài khoản này không tồn tại hoặc đã bị xóa.</p>
    </div>
  </div>
);

export default ProfileHeader;