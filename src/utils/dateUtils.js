// Utility functions for date formatting
export const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Không rõ thời gian'
  
  try {
    const now = new Date()
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Thời gian không hợp lệ'
    }
    
    const diffInMs = now - date
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInSeconds < 60) {
      return 'Vừa xong'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Thời gian không hợp lệ'
  }
}

export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString)
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  }
  
  return date.toLocaleDateString('vi-VN', defaultOptions)
}

export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

