import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SafeOverview from './pages/SafeOverview'
import Performance from './pages/Performance'
import Sports from './pages/Sports'
import QnA from './pages/QnA'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SafeOverview />} />
            <Route path="/performance" element={
              <ErrorBoundary>
                <Performance />
              </ErrorBoundary>
            } />
            <Route path="/sports" element={
              <ErrorBoundary>
                <Sports />
              </ErrorBoundary>
            } />
            <Route path="/qna" element={
              <ErrorBoundary>
                <QnA />
              </ErrorBoundary>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
