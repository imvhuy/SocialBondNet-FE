"use client"

import NewsFeed from "../../components/posts/NewsFeed"

const Home = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Trang chủ</h1>
        <p className="text-gray-600">Chào mừng bạn đến với SocialNet! Xem những bài viết mới nhất từ bạn bè.</p>
      </div>

      <NewsFeed />
    </div>
  )
}

export default Home
