import { useEffect, useRef, useCallback } from 'react';
import { usePosts, useMedia } from '../../hooks/useProfile';
import PostCard from '../posts/PostCard';

const TabContent = ({ activeTab, username, profile }) => {
  const postsHook = usePosts(username);
  const photosHook = useMedia(username, 'photo');
  const videosHook = useMedia(username, 'video');

  const getCurrentHook = () => {
    switch (activeTab) {
      case 'posts':
        return postsHook;
      case 'photos':
        return photosHook;
      case 'videos':
        return videosHook;
      default:
        return null;
    }
  };

  const currentHook = getCurrentHook();

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        {activeTab === 'posts' && (
          <PostsTab hook={postsHook} profile={profile} />
        )}
        
        {activeTab === 'photos' && (
          <MediaTab hook={photosHook} type="photos" />
        )}
        
        {activeTab === 'videos' && (
          <MediaTab hook={videosHook} type="videos" />
        )}
        
        {activeTab === 'about' && (
          <AboutTab profile={profile} />
        )}
      </div>
    </div>
  );
};

// Posts Tab Component
const PostsTab = ({ hook, profile }) => {
  const { data: posts, loading, loadingMore, hasMore, loadMore, error } = hook;
  const observerRef = useRef();

  // Infinite scroll observer
  const lastPostElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, loadMore]);

  if (loading) {
    return <PostsSkeleton />;
  }

  if (error) {
    return <ErrorState message="Không thể tải bài viết" onRetry={hook.refetch} />;
  }

  if (!posts || posts.length === 0) {
    return <EmptyState type="posts" />;
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostElementRef : null}
        >
          <PostCard post={post} />
        </div>
      ))}
      
      {loadingMore && <PostsSkeleton count={2} />}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Đã hiển thị tất cả bài viết</p>
        </div>
      )}
    </div>
  );
};

// Media Tab Component
const MediaTab = ({ hook, type }) => {
  const { data: media, loading, loadingMore, hasMore, loadMore, error } = hook;
  const observerRef = useRef();

  const lastMediaElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, loadMore]);

  if (loading) {
    return <MediaSkeleton type={type} />;
  }

  if (error) {
    return <ErrorState message={`Không thể tải ${type === 'photos' ? 'ảnh' : 'video'}`} onRetry={hook.refetch} />;
  }

  if (!media || media.length === 0) {
    return <EmptyState type={type} />;
  }

  const gridClass = type === 'videos' ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div>
      <div className={`grid ${gridClass} gap-4`}>
        {media.map((item, index) => (
          <div
            key={item.id}
            ref={index === media.length - 1 ? lastMediaElementRef : null}
            className={`${type === 'videos' ? 'aspect-video' : 'aspect-square'} group cursor-pointer relative overflow-hidden rounded-lg`}
          >
            {type === 'photos' ? (
              <img
                src={item.url}
                alt={item.alt || 'Photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.duration && (
                    <span className="text-xs text-gray-600">{item.duration}</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
            
            {/* Play button for videos */}
            {type === 'videos' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {loadingMore && <MediaSkeleton type={type} count={6} />}
      
      {!hasMore && media.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Đã hiển thị tất cả {type === 'photos' ? 'ảnh' : 'video'}</p>
        </div>
      )}
    </div>
  );
};

// About Tab Component
const AboutTab = ({ profile }) => {
  if (!profile) {
    return <AboutSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Thông tin cơ bản
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.bio && (
            <div className="md:col-span-2">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Tiểu sử</p>
                  <p className="text-gray-900 whitespace-pre-line">{profile.bio}</p>
                </div>
              </div>
            </div>
          )}

          {profile.location && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Vị trí</p>
                <p className="text-gray-900">{profile.location}</p>
              </div>
            </div>
          )}

          {profile.website && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Website</p>
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            </div>
          )}

          {profile.birthday && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Ngày sinh</p>
                <p className="text-gray-900">{new Date(profile.birthday).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          )}

          {profile.joinDate && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Tham gia</p>
                <p className="text-gray-900">{new Date(profile.joinDate).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Links */}
      {(profile.github || profile.linkedin || profile.twitter) && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Liên kết
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
            )}
            
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            )}
            
            {profile.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Sở thích
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Skeleton Components
const PostsSkeleton = ({ count = 3 }) => (
  <div className="space-y-6 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32" />
            <div className="h-3 bg-gray-300 rounded w-24" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />
        </div>
        <div className="h-48 bg-gray-300 rounded-lg" />
      </div>
    ))}
  </div>
);

const MediaSkeleton = ({ type, count = 9 }) => {
  const gridClass = type === 'videos' ? 'grid-cols-2' : 'grid-cols-3';
  const aspectClass = type === 'videos' ? 'aspect-video' : 'aspect-square';
  
  return (
    <div className={`grid ${gridClass} gap-4 animate-pulse mt-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${aspectClass} bg-gray-300 rounded-lg`} />
      ))}
    </div>
  );
};

const AboutSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div>
      <div className="h-6 bg-gray-300 rounded w-48 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-gray-300 rounded mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300 rounded w-20" />
              <div className="h-4 bg-gray-300 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Empty State Components
const EmptyState = ({ type }) => {
  const config = {
    posts: {
      icon: (
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      title: 'Chưa có bài viết',
      description: 'Người dùng này chưa đăng bài viết nào.'
    },
    photos: {
      icon: (
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Chưa có ảnh',
      description: 'Người dùng này chưa chia sẻ ảnh nào.'
    },
    videos: {
      icon: (
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Chưa có video',
      description: 'Người dùng này chưa chia sẻ video nào.'
    }
  };

  const { icon, title, description } = config[type] || config.posts;

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

// Error State Component
const ErrorState = ({ message, onRetry }) => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-4">
      <svg className="w-16 h-16 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Đã xảy ra lỗi</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Thử lại
    </button>
  </div>
);

export default TabContent;
