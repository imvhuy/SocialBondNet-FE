import { Outlet } from "react-router-dom"
import AppHeader from "./AppHeader"
import AppSidebar from "./AppSidebar"

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
