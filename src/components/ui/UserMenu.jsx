"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const UserMenu = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img 
          src={user?.avatar || "/abstract-user-representation.png"} 
          alt="User" 
          className="w-8 h-8 rounded-full" 
        />
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Người dùng'}</p>
            <p className="text-xs text-gray-500">@{user?.username || 'username'}</p>
          </div>
          
          <Link
            to="/profile"
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
            onClick={() => setShowUserMenu(false)}
          >
            Trang cá nhân
          </Link>
          <Link
            to="/settings"
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
            onClick={() => setShowUserMenu(false)}
          >
            Cài đặt
          </Link>
          <hr className="my-2" />
          <button
            onClick={() => {
              onLogout()
              setShowUserMenu(false)
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu

