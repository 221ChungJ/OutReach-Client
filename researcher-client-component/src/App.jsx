import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Components
import Dashboard from './components/Dashboard'
import SurveyCreation from './components/SurveyCreation'
import ParticipantManagement from './components/ParticipantManagement'
import SurveyPreview from './components/SurveyPreview'
import SurveyList from './components/SurveyList'

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo">
            <h2>Researcher Portal</h2>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/create-survey">Create Survey</Link></li>
            <li><Link to="/manage-participants">Manage Participants</Link></li>
            <li><Link to="/surveys">My Surveys</Link></li>
          </ul>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-survey" element={<SurveyCreation />} />
            <Route path="/manage-participants" element={<ParticipantManagement />} />
            <Route path="/surveys" element={<SurveyList />} />
            <Route path="/preview-survey/:id" element={<SurveyPreview />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
