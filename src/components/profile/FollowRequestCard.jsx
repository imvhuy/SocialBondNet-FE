import { useState } from 'react';
import { profileService } from '../../services/profileService';

const FollowRequestCard = ({
    requester,
    onRequestHandled,
    className = ''
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRequest = async (action) => {
        if (loading) return;

        setLoading(true);
        setError('');

        try {
            console.log(`FollowRequestCard: ${action} request from userId:`, requester.id);

            if (action === 'accept') {
                // Use userId - now available for all profiles including private ones
                // Backend API: POST /follows/requests/{requesterId}/accept
                await profileService.acceptFollowRequest(requester.id);
            } else if (action === 'reject') {
                // Use userId - consistent with accept action
                // Backend API: DELETE /follows/requests/{requesterId}/reject
                await profileService.rejectFollowRequest(requester.id);
            }

            // Notify parent component
            if (onRequestHandled) {
                onRequestHandled(requester.id, action);
            }
        } catch (err) {
            console.error('Failed to handle follow request:', err);
            setError(err.message || 'Đã xảy ra lỗi');

            // Clear error after 3 seconds
            setTimeout(() => setError(''), 3000);
            setLoading(false);
        }
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
            <div className="flex items-center justify-between">
                {/* Requester Info */}
                <div className="flex items-center space-x-3">
                    <img
                        src={requester.avatar || '/abstract-user-representation.png'}
                        alt={requester.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {requester.fullName || requester.name || requester.username}
                        </h3>
                        <p className="text-sm text-gray-600">@{requester.username}</p>
                        {requester.mutualFollowers && requester.mutualFollowers > 0 && (
                            <p className="text-xs text-gray-500">
                                {requester.mutualFollowers} người bạn chung
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                    {!loading ? (
                        <>
                            <button
                                onClick={() => handleRequest('reject')}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium min-w-[80px]"
                            >
                                Từ chối
                            </button>
                            <button
                                onClick={() => handleRequest('accept')}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium min-w-[80px]"
                            >
                                Chấp nhận
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-600">Đang xử lý...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-3 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Request Time */}
            {requester.requestedAt && (
                <div className="mt-2 text-xs text-gray-500">
                    Yêu cầu gửi {formatTimeAgo(requester.requestedAt)}
                </div>
            )}
        </div>
    );
};

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return date.toLocaleDateString('vi-VN');
};

export default FollowRequestCard;
