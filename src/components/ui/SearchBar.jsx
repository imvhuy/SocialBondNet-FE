import { useNavigate } from "react-router-dom"

const SearchBar = () => {
  const navigate = useNavigate()

  const handleSearchClick = () => {
    navigate("/search")
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Tìm kiếm bạn bè, bài viết..."
        className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
        onClick={handleSearchClick}
        readOnly
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
    </div>
  )
}

export default SearchBar

