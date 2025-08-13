import { usePosts } from '../../hooks/usePosts'
import PostCard from './PostCard'
import CreatePost from './CreatePost'

const NewsFeed = () => {
  const {
    posts,
    loading,
    error,
    hasMore,
    loadMorePosts,
    addPost,
    updatePost
  } = usePosts()

  const handleNewPost = async (postData) => {
    // In real app, this would make API call
    const newPost = {
      id: Date.now(),
      user: {
        name: "Bạn",
        username: "you",
        avatar: "/abstract-user-representation.png",
      },
      content: postData.content,
      image: postData.image,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
    }
    
    addPost(newPost)
  }

  const handleLike = (postId) => {
    const post = posts.find(p => p.id === postId)
    if (post) {
      updatePost(postId, {
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1
      })
    }
  }

  const handleComment = (postId, comment) => {
    // In real app, this would make API call
    console.log('Adding comment:', { postId, comment })
  }

  const handleShare = (postId) => {
    // In real app, this would make API call
    console.log('Sharing post:', postId)
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Có lỗi xảy ra khi tải bài viết: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <CreatePost onPost={handleNewPost} />

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Đang tải...</span>
          </div>
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center py-8">
          <button 
            onClick={loadMorePosts}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Xem thêm bài viết
          </button>
        </div>
      )}

      {!loading && !hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Bạn đã xem hết tất cả bài viết</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
          <p className="text-gray-500">Hãy tạo bài viết đầu tiên của bạn!</p>
        </div>
      )}
    </div>
  )
}

export default NewsFeed

