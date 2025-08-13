"use client"

import { useState } from "react"

const NotificationDropdown = () => {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Nguyễn Văn A',
      message: 'đã thích bài viết của bạn',
      timestamp: '2 giờ trước',
      avatar: '/abstract-geometric-shapes.png',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: 'Trần Thị B',
      message: 'đã bình luận về bài viết của bạn',
      timestamp: '3 giờ trước',
      avatar: '/abstract-geometric-shapes.png',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: 'Lê Văn C',
      message: 'đã bắt đầu theo dõi bạn',
      timestamp: '5 giờ trước',
      avatar: '/diverse-group-collaborating.png',
      read: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM10.97 4.97a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06-1.06l1.72-1.72H5a.75.75 0 010-1.5h7.69l-1.72-1.72a.75.75 0 010-1.06z"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Thông báo</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={notification.avatar}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{notification.user}</span> {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown

