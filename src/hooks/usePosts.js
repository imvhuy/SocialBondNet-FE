import { useState, useEffect, useRef } from 'react'
import { postService } from '../services/postService'

export const usePosts = (initialPage = 0, initialLimit = 20) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(initialPage)
  const didInitRef = useRef(false)

  const fetchPosts = async (pageNum = page, reset = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await postService.getPosts(pageNum, initialLimit)

      // Normalize API response to UI post model
      const rawItems = Array.isArray(response)
        ? response
        : (response?.data || response?.posts || [])

      const mapApiPost = (item) => ({
        id: item.postId || item.id,
        content: item.postTitle || item.content || '',
        image: item.postImageUrl || item.image || null,
        timestamp: item.postCreatedAt || item.createdAt || new Date().toISOString(),
        visibility: item.postVisibility || item.visibility || 'PUBLIC',
        user: {
          id: item.postAuthorId || item.authorId || item.userId,
          name: item.authorDisplayName || item.authorName || 'Người dùng',
          username: (item.authorDisplayName?.split?.(' ')?.[0] || 'user').toLowerCase(),
          avatar: item.authorAvatarUrl || item.avatar || '/abstract-user-representation.png',
        },
        likes: item.likes ?? 0,
        comments: item.comments ?? 0,
        shares: item.shares ?? 0,
        isLiked: item.isLiked ?? false,
      })

      const newPosts = rawItems.map(mapApiPost)
      
      if (reset || pageNum === 1) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      setHasMore(newPosts.length === initialLimit)
      setPage(pageNum)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshPosts = () => {
    setPage(1)
    fetchPosts(1, true)
  }

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1)
    }
  }

  const addPost = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  const updatePost = (postId, updatedData) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updatedData } : post
    ))
  }

  const removePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
  }

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true
    fetchPosts(0, true)
  }, [])

  return {
    posts,
    loading,
    error,
    hasMore,
    refreshPosts,
    loadMorePosts,
    addPost,
    updatePost,
    removePost
  }
}

