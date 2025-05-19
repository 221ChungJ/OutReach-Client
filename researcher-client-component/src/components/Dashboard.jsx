import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudies: 0,
    activeStudies: 0,
    totalParticipants: 0,
    completedInterviews: 0
  });
  const [allStudies, setAllStudies] = useState([]);

  useEffect(() => {
    const studies = [
      {
        id: 1,
        title: 'User Experience Study',
        dateCreated: '2024-03-15',
        participantCount: 10,
        status: 'Active'
      },
      {
        id: 2,
        title: 'Product Feedback Study',
        dateCreated: '2024-03-10',
        participantCount: 8,
        status: 'Active'
      },
      {
        id: 3,
        title: 'Accessibility Research Study',
        dateCreated: '2024-02-20',
        participantCount: 12,
        status: 'Closed'
      }
    ];

    setStats({
      totalStudies: studies.length,
      activeStudies: studies.filter(s => s.status === 'Active').length,
      totalParticipants: studies.reduce((sum, s) => sum + s.participantCount, 0),
      completedInterviews: 15
    });

    const sortedStudies = studies.sort(
      (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
    );

    setAllStudies(sortedStudies);
  }, []);

  return (
    <div className="app-container">

      <main className="main-content">
        <div className="dashboard">
          <h2>Researcher Dashboard</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Studies</h3>
              <p className="stat-number">{stats.totalStudies}</p>
            </div>
            <div className="stat-card">
              <h3>Active Studies</h3>
              <p className="stat-number">{stats.activeStudies}</p>
            </div>
            <div className="stat-card">
              <h3>Total Participants</h3>
              <p className="stat-number">{stats.totalParticipants}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Interviews</h3>
              <p className="stat-number">{stats.completedInterviews}</p>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h3>Studies</h3>
              <button onClick={() => navigate('/studies')}>View All</button>
            </div>
            <div className="study-list">
              {allStudies.map(study => (
                <div
                  key={study.id}
                  className="study-card"
                  onClick={() => navigate(`/preview-study/${study.id}`)}
                >
                  <div
                    className={`status-indicator ${study.status.toLowerCase()}`}
                  ></div>
                  <div className="study-card-content">
                    <div className="study-header">
                      <h4 className="study-title">{study.title}</h4>
                      <span className="study-date">
                        {new Date(study.dateCreated).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="study-participants">Participants: {study.participantCount}</p>
                    <span className={`status-badge ${study.status.toLowerCase()}`}>
                      {study.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button onClick={() => navigate('/create-study')}>
                Create New Study
              </button>
              <button onClick={() => navigate('/manage-participants')}>
                Add Participants
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
