import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Overview from './pages/Overview'
import Performance from './pages/Performance'
import Sports from './pages/Sports'
import QnA from './pages/QnA'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/qna" element={<QnA />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
