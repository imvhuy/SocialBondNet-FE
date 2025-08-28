"use client"

import { useState } from 'react'
import { formatTimeAgo } from '../../utils/dateUtils'

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  // Handle both post.user and post.author structures
  const author = post.user || post.author || {}

  const handleLike = () => {
    if (onLike) onLike(post.id)
  }

  const handleComment = () => {
    if (newComment.trim() && onComment) {
      onComment(post.id, newComment.trim())
      setNewComment('')
    }
  }

  const handleShare = () => {
    if (onShare) onShare(post.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <img
            src={author.avatar || '/abstract-user-representation.png'}
            alt={author.name || 'User'}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{author.name || 'Unknown User'}</h3>
            <p className="text-sm text-gray-500">
              @{author.username || 'user'} • {formatTimeAgo(post.timestamp)}
            </p>
          </div>
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
        {post.image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                post.isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg 
                className="w-5 h-5" 
                fill={post.isLiked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <span className="text-sm font-medium">{post.likes || 0}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
              <span className="text-sm font-medium">{post.comments || 0}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
                />
              </svg>
              <span className="text-sm font-medium">{post.shares || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-4 border-t border-gray-200">
          {/* Add Comment */}
          <div className="flex space-x-3 mb-4">
            <img
              src="/abstract-user-representation.png"
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Bình luận
                </button>
              </div>
            </div>
          </div>

          {/* Existing Comments */}
          <div className="space-y-3">
            {/* Mock comments - replace with actual data */}
            {[1, 2].map((comment) => (
              <div key={comment} className="flex space-x-3">
                <img
                  src="/abstract-geometric-shapes.png"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900">Người dùng {comment}</p>
                    <p className="text-sm text-gray-800">Bình luận mẫu số {comment}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">2 giờ trước</span>
                    <button className="text-xs text-gray-500 hover:text-blue-600">Thích</button>
                    <button className="text-xs text-gray-500 hover:text-blue-600">Trả lời</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard

