"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchResults, setSearchResults] = useState({
    users: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        username: "nguyenvana",
        avatar: "/placeholder-bc6mc.png",
        bio: "Full-stack Developer",
        isFollowing: false,
        mutualFriends: 5,
      },
      {
        id: 2,
        name: "Trần Thị B",
        username: "tranthib",
        avatar: "/placeholder-dlej4.png",
        bio: "ReactJS Developer",
        isFollowing: true,
        mutualFriends: 12,
      },
      {
        id: 3,
        name: "Lê Văn C",
        username: "levanc",
        avatar: "/placeholder-fl4va.png",
        bio: "UI/UX Designer",
        isFollowing: false,
        mutualFriends: 3,
      },
    ],
    posts: [
      {
        id: 1,
        user: {
          name: "Phạm Thị D",
          username: "phamthid",
          avatar: "/placeholder-8xdw4.png",
        },
        content: "Hướng dẫn học ReactJS từ cơ bản đến nâng cao. Ai quan tâm thì comment nhé!",
        timestamp: "2 giờ trước",
        likes: 34,
        comments: 12,
      },
      {
        id: 2,
        user: {
          name: "Hoàng Văn E",
          username: "hoangvane",
          avatar: "/placeholder-rdg8p.png",
        },
        content: "Spring Boot tips and tricks cho những ai đang học backend development",
        image: "/placeholder-a6ne1.png",
        timestamp: "4 giờ trước",
        likes: 56,
        comments: 23,
      },
    ],
  })

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search logic here
    console.log("Searching for:", searchQuery)
  }

  const handleFollow = (userId) => {
    setSearchResults((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)),
    }))
  }

  const tabs = [
    { id: "all", name: "Tất cả", count: searchResults.users.length + searchResults.posts.length },
    { id: "users", name: "Người dùng", count: searchResults.users.length },
    { id: "posts", name: "Bài viết", count: searchResults.posts.length },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tìm kiếm</h1>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm người dùng, bài viết..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            type="submit"
            className="absolute right-3 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tìm
          </button>
        </form>

        {/* Search Suggestions */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Tìm kiếm phổ biến:</h3>
          <div className="flex flex-wrap gap-2">
            {["ReactJS", "Spring Boot", "JavaScript", "Web Development", "Programming"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">{tab.count}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {(activeTab === "all" || activeTab === "users") && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Người dùng</h2>
              <div className="space-y-4">
                {searchResults.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Link to={`/profile/${user.username}`}>
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-12 h-12 rounded-full hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${user.username}`} className="hover:underline">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        </Link>
                        <p className="text-gray-600">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.bio}</p>
                        {user.mutualFriends > 0 && (
                          <p className="text-xs text-gray-500 mt-1">{user.mutualFriends} bạn chung</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleFollow(user.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          user.isFollowing
                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {user.isFollowing ? "Đang theo dõi" : "Theo dõi"}
                      </button>
                      <Link
                        to={`/messages`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Nhắn tin
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "posts") && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bài viết</h2>
              <div className="space-y-6">
                {searchResults.posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Link to={`/profile/${post.user.username}`}>
                        <img
                          src={post.user.avatar || "/placeholder.svg"}
                          alt={post.user.name}
                          className="w-10 h-10 rounded-full hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${post.user.username}`} className="hover:underline">
                          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-500">
                          @{post.user.username} • {post.timestamp}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-800 mb-4">{post.content}</p>

                    {post.image && (
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full rounded-lg mb-4"
                      />
                    )}

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>{post.likes} lượt thích</span>
                      <span>{post.comments} bình luận</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "all" && searchResults.users.length === 0 && searchResults.posts.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600">Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
