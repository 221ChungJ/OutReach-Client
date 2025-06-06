import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Components
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import InterviewCreation from './components/InterviewCreation'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content-wrapper">
          <nav className="sidebar">
            <div className="logo">
              <h2>Researcher Portal</h2>
            </div>
            <ul className="nav-links">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/create-interview">Create Interview</Link></li>
            </ul>
          </nav>
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-interview" element={<InterviewCreation />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
