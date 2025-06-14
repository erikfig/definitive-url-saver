import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import { IndexedDbProvider } from './contexts/IndexedDbContext'

function App() {
  return (
    <Router>
      <IndexedDbProvider>
        <div className="w-[550px] h-[600px] bg-gray-200 overflow-auto">
          <div className="p-4">
            <Routes>
              <Route path="/list" element={<ListPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </div>
      </IndexedDbProvider>
    </Router>
  )
}

export default App
