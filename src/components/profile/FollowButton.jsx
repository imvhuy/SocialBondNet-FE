import { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';

const FollowButton = ({
  userId,
  followStatus: initialStatus = 'NOT_FOLLOWING',
  onFollowChange,
  disabled = false,
  className = ''
}) => {
  const [followStatus, setFollowStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync internal state with props when they change
  useEffect(() => {
    if (initialStatus !== followStatus) {
      console.log('FollowButton: Props changed, syncing state:', {
        userId,
        oldStatus: followStatus,
        newStatus: initialStatus
      });
      setFollowStatus(initialStatus);
    }
  }, [initialStatus, userId]);

  const handleFollowAction = async (action) => {
    if (loading || disabled) return;

    setLoading(true);
    setError('');

    try {
      let result;
      let newStatus;


      switch (action) {
        case 'follow':
          result = await profileService.followUser(userId);
          newStatus = result.status || 'FOLLOWING';
          break;

        case 'unfollow':
          result = await profileService.unfollowUser(userId);
          // Backend returns { "message": "Unfollowed successfully" }
          newStatus = 'NOT_FOLLOWING';
          break;

        case 'cancel_request':
          result = await profileService.unfollowUser(userId);
          newStatus = 'NOT_FOLLOWING';
          break;

        default:
          throw new Error('Invalid action');
      }

      console.log('FollowButton: Action completed successfully:', {
        userId,
        action,
        oldStatus: followStatus,
        newStatus,
        apiResult: result
      });

      setFollowStatus(newStatus);

      if (onFollowChange) {
        onFollowChange(newStatus);
      }
    } catch (err) {
      console.error('Follow action failed:', err);
      setError(err.message || 'Đã xảy ra lỗi');

      // Reset error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getButtonProps = () => {
    switch (followStatus) {
      case 'FOLLOWING':
        return {
          text: 'Đang theo dõi',
          hoverText: 'Bỏ theo dõi',
          onClick: () => handleFollowAction('unfollow'),
          className: 'bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-700 hover:border-red-300 border border-gray-300'
        };

      case 'PENDING':
        return {
          text: 'Yêu cầu đã gửi',
          hoverText: 'Hủy yêu cầu',
          onClick: () => handleFollowAction('cancel_request'),
          className: 'bg-yellow-100 text-yellow-800 hover:bg-red-100 hover:text-red-700 hover:border-red-300 border border-yellow-300'
        };

      case 'NOT_FOLLOWING':
      default:
        return {
          text: 'Theo dõi',
          hoverText: null,
          onClick: () => handleFollowAction('follow'),
          className: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
        };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <div className="relative">
      <button
        onClick={buttonProps.onClick}
        disabled={loading || disabled}
        className={`
          relative px-6 py-2 rounded-lg font-semibold transition-all duration-200 min-w-[140px]
          ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
          ${buttonProps.className}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <span className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {buttonProps.text}
        </span>

        {/* Show hover text when applicable */}
        {buttonProps.hoverText && !loading && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            {buttonProps.hoverText}
          </span>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 text-red-700 text-xs rounded shadow-lg z-10 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default FollowButton;