import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import AppRoutes from "./routes/AppRoutes"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
