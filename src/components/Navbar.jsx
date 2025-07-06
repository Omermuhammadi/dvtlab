import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Overview', icon: '📊' },
    { path: '/performance', label: 'Performance', icon: '🏆' },
    { path: '/sports', label: 'Sports & Athletes', icon: '🏃‍♂️' },
    { path: '/qna', label: 'Q&A Insights', icon: '❓' }
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🏅</span>
          <span className="brand-text">Olympics Analytics</span>
        </Link>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
