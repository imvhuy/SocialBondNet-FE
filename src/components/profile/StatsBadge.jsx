import { useState } from 'react';

const StatsBadge = ({ counters, className = '' }) => {
  const [hoveredStat, setHoveredStat] = useState(null);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const getTooltipText = (type, count) => {
    switch (type) {
      case 'posts':
        return `${count.toLocaleString()} bài viết`;
      case 'followers':
        return `${count.toLocaleString()} người theo dõi`;
      case 'following':
        return `Đang theo dõi ${count.toLocaleString()} người`;
      default:
        return '';
    }
  };

  const stats = [
    { key: 'posts', label: 'Bài viết', value: counters?.posts || 0 },
    { key: 'followers', label: 'Người theo dõi', value: counters?.followers || 0 },
    { key: 'following', label: 'Đang theo dõi', value: counters?.following || 0 },
  ];

  if (!counters) {
    return <StatsBadgeSkeleton className={className} />;
  }

  return (
    <div className={`flex space-x-6 ${className}`}>
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="relative text-center cursor-pointer group"
          onMouseEnter={() => setHoveredStat(stat.key)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
            {formatNumber(stat.value)}
          </div>
          <div className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
            {stat.label}
          </div>
          
          {/* Tooltip */}
          {hoveredStat === stat.key && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                {getTooltipText(stat.key, stat.value)}
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Skeleton component for loading state
const StatsBadgeSkeleton = ({ className = '' }) => (
  <div className={`flex space-x-6 animate-pulse ${className}`}>
    {[1, 2, 3].map((i) => (
      <div key={i} className="text-center">
        <div className="h-6 bg-gray-300 rounded w-12 mb-1" />
        <div className="h-4 bg-gray-300 rounded w-16" />
      </div>
    ))}
  </div>
);

export default StatsBadge;

