import { useState, useEffect } from 'react'
import { commentService } from '../services/commentService'

export const useComments = (postId) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchComments = async (pageNum = page, reset = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await commentService.getComments(postId, pageNum)
      const newComments = response.data || response.comments || []
      
      if (reset || pageNum === 1) {
        setComments(newComments)
      } else {
        setComments(prev => [...prev, ...newComments])
      }
      
      setHasMore(newComments.length > 0)
      setPage(pageNum)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addComment = async (commentData) => {
    try {
      const newComment = await commentService.addComment(postId, commentData)
      setComments(prev => [newComment, ...prev])
      return newComment
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateComment = async (commentId, commentData) => {
    try {
      const updatedComment = await commentService.updateComment(commentId, commentData)
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ))
      return updatedComment
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId)
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const likeComment = async (commentId) => {
    try {
      const result = await commentService.likeComment(commentId)
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isLiked: !comment.isLiked, likes: result.likes }
          : comment
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  const loadMoreComments = () => {
    if (!loading && hasMore) {
      fetchComments(page + 1)
    }
  }

  const refreshComments = () => {
    setPage(1)
    fetchComments(1, true)
  }

  useEffect(() => {
    if (postId) {
      fetchComments(1, true)
    }
  }, [postId])

  return {
    comments,
    loading,
    error,
    hasMore,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    loadMoreComments,
    refreshComments
  }
}

