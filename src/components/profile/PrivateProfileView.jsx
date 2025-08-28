import FollowButton from './FollowButton';

const PrivateProfileView = ({ profile, onFollowChange }) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={profile?.coverImage || "/abstract-geometric-cover.png"}
          alt="Cover"
          className="w-full h-48 md:h-64 object-cover rounded-lg"
          loading="lazy"
        />

        {/* Privacy Indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Tài khoản riêng tư</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-md -mt-16 relative z-10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 lg:mb-0 flex-shrink-0">
            <img
              src={profile?.avatar || "/abstract-user-representation.png"}
              alt={profile?.name || 'User'}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {profile?.name || profile?.username || 'Người dùng'}
                </h1>
                <p className="text-gray-600">@{profile?.username}</p>

                {/* Private Account Message */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        Tài khoản này là riêng tư
                      </h3>
                      <p className="text-sm text-gray-600">
                        {profile?.message ||
                          (profile?.followStatus === 'FOLLOWING'
                            ? "Bạn đang theo dõi tài khoản này và có thể xem các bài đăng của họ."
                            : profile?.followStatus === 'PENDING'
                              ? "Yêu cầu theo dõi đã được gửi. Chờ chủ tài khoản chấp nhận để xem nội dung."
                              : "Theo dõi để xem ảnh và video của họ.")
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4 lg:mt-0 flex-shrink-0">
                <FollowButton
                  userId={profile?.id}
                  followStatus={profile?.followStatus || 'NOT_FOLLOWING'}
                  onFollowChange={onFollowChange}
                />
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Nhắn tin
                </button>
              </div>
            </div>

            {/* Basic Stats (limited for private accounts) */}
            <div className="flex space-x-6 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">-</div>
                <div className="text-sm text-gray-500">Bài viết</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">-</div>
                <div className="text-sm text-gray-500">Người theo dõi</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">-</div>
                <div className="text-sm text-gray-500">Đang theo dõi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateProfileView;
