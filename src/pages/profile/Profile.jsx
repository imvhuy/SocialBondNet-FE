"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const Profile = () => {
  const { username } = useParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)

  // Determine if this is the current user's profile or someone else's
  const isOwnProfile = !username || username === user?.username

  const userProfile = {
    name: isOwnProfile ? user?.name || "Bạn" : "Nguyễn Văn A",
    username: isOwnProfile ? user?.username || "you" : username,
    bio: "Full-stack Developer | ReactJS & Spring Boot enthusiast | Coffee lover ☕",
    avatar: isOwnProfile ? user?.avatar || "/abstract-user-representation.png" : "/profile-user.png",
    coverImage: "/abstract-geometric-cover.png",
    followers: 1234,
    following: 567,
    posts: 89,
    joinDate: "Tham gia từ tháng 3 năm 2023",
  }

  const userPosts = [
    {
      id: 1,
      content: "Vừa hoàn thành dự án ReactJS mới! Cảm ơn team đã hỗ trợ 🚀",
      image: "/project-screenshot.png",
      timestamp: "2 ngày trước",
      likes: 45,
      comments: 12,
    },
    {
      id: 2,
      content:
        "Tips học Spring Boot hiệu quả:\n1. Hiểu rõ về Dependency Injection\n2. Thực hành với các project nhỏ\n3. Đọc documentation thường xuyên",
      timestamp: "1 tuần trước",
      likes: 78,
      comments: 23,
    },
    {
      id: 3,
      content: "Buổi sáng tuyệt vời với một tách cà phê ☕",
      image: "/cozy-coffee-morning.png",
      timestamp: "2 tuần trước",
      likes: 34,
      comments: 8,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={userProfile.coverImage || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-48 object-cover rounded-lg"
        />
        {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Chỉnh sửa ảnh bìa
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-md -mt-16 relative z-10 p-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 md:mb-0">
            <img
              src={userProfile.avatar || "/placeholder.svg"}
              alt={userProfile.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600">@{userProfile.username}</p>
                <p className="text-gray-700 mt-2">{userProfile.bio}</p>
                <p className="text-gray-500 text-sm mt-1">{userProfile.joinDate}</p>
              </div>

              {!isOwnProfile && (
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      isFollowing
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                  </button>
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Nhắn tin
                  </button>
                </div>
              )}

              {isOwnProfile && (
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Chỉnh sửa profile
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex space-x-6 mt-4">
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900">{userProfile.posts}</div>
                <div className="text-gray-600 text-sm">Bài viết</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900">{userProfile.followers.toLocaleString()}</div>
                <div className="text-gray-600 text-sm">Người theo dõi</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900">{userProfile.following}</div>
                <div className="text-gray-600 text-sm">Đang theo dõi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "posts", name: "Bài viết", count: userProfile.posts },
              { id: "photos", name: "Ảnh", count: 24 },
              { id: "videos", name: "Video", count: 5 },
              { id: "about", name: "Giới thiệu" },
            ].map((tab) => (
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
                {tab.count && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">{tab.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "posts" && (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={userProfile.avatar || "/placeholder.svg"}
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{userProfile.name}</h3>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>

                  <p className="text-gray-800 whitespace-pre-line mb-4">{post.content}</p>

                  {post.image && (
                    <img src={post.image || "/placeholder.svg"} alt="Post content" className="w-full rounded-lg mb-4" />
                  )}

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>{post.likes} lượt thích</span>
                    <span>{post.comments} bình luận</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((photo) => (
                <div key={photo} className="aspect-square">
                  <img
                    src={`/abstract-colorful-photo.png?height=200&width=200&query=photo${photo}`}
                    alt={`Photo ${photo}`}
                    className="w-full h-full object-cover rounded-lg hover:opacity-90 cursor-pointer transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "videos" && (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((video) => (
                <div
                  key={video}
                  className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cá nhân</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                      />
                    </svg>
                    <span className="text-gray-700">Full-stack Developer tại TechCorp</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-gray-700">Hà Nội, Việt Nam</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                      />
                    </svg>
                    <span className="text-gray-700">Tham gia từ tháng 3 năm 2023</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sở thích</h3>
                <div className="flex flex-wrap gap-2">
                  {["ReactJS", "Spring Boot", "JavaScript", "Java", "Coffee", "Photography", "Travel"].map(
                    (interest) => (
                      <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {interest}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
