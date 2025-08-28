import React from 'react';
import { useFollowStats } from '../../hooks/useProfile';

const FollowStatsDisplay = ({ userId, className = '' }) => {
    const { stats, loading, error, refetch } = useFollowStats(userId);

    if (loading) {
        return (
            <div className={`flex space-x-6 ${className}`}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="text-center animate-pulse">
                        <div className="h-6 bg-gray-300 rounded w-12 mb-1" />
                        <div className="h-4 bg-gray-300 rounded w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <span className="text-sm text-red-600">Không thể tải thống kê</span>
                <button
                    onClick={refetch}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className={`flex space-x-6 ${className}`}>
            <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                    {stats.posts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Bài viết</div>
            </div>

            <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                    {stats.followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Người theo dõi</div>
            </div>

            <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                    {stats.following.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Đang theo dõi</div>
            </div>
        </div>
    );
};

export default FollowStatsDisplay;
