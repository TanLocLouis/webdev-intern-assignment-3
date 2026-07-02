import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import StatisticsPage from './pages/StatisticsPage'
import TopGroupAPage from './pages/TopGroupAPage'

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Main content — offset by sidebar width on desktop */}
      <main className="flex-1 lg:ml-64">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/top-group-a" element={<TopGroupAPage />} />
        </Routes>
      </main>
    </div>
  )
}
