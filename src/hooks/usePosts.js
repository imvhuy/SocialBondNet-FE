import { useState, useEffect } from 'react'
import { postService } from '../services/postService'

export const usePosts = (initialPage = 1, initialLimit = 10) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(initialPage)

  const fetchPosts = async (pageNum = page, reset = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await postService.getPosts(pageNum, initialLimit)
      const newPosts = response.data || response.posts || []
      
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
    fetchPosts(1, true)
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

