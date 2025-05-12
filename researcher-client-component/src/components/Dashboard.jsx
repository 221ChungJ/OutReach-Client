import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSurveys: 0,
    activeSurveys: 0,
    totalParticipants: 0,
    completedInterviews: 0
  });
  const [recentSurveys, setRecentSurveys] = useState([]);
  const [recentParticipants, setRecentParticipants] = useState([]);

  // TODO: Replace with actual API calls
  useEffect(() => {
    // Mock data for now
    setStats({
      totalSurveys: 5,
      activeSurveys: 3,
      totalParticipants: 25,
      completedInterviews: 15
    });

    setRecentSurveys([
      {
        id: 1,
        title: 'User Experience Study',
        dateCreated: '2024-03-15',
        participantCount: 10,
        status: 'Active'
      },
      {
        id: 2,
        title: 'Product Feedback Survey',
        dateCreated: '2024-03-10',
        participantCount: 8,
        status: 'Active'
      }
    ]);

    setRecentParticipants([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        surveyTitle: 'User Experience Study',
        status: 'Completed'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        surveyTitle: 'Product Feedback Survey',
        status: 'In Progress'
      }
    ]);
  }, []);

  return (
    <div className="dashboard">
      <h2>Researcher Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Surveys</h3>
          <p className="stat-number">{stats.totalSurveys}</p>
        </div>
        <div className="stat-card">
          <h3>Active Surveys</h3>
          <p className="stat-number">{stats.activeSurveys}</p>
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

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Surveys</h3>
            <button onClick={() => navigate('/surveys')}>View All</button>
          </div>
          <div className="recent-list">
            {recentSurveys.map(survey => (
              <div key={survey.id} className="recent-item" onClick={() => navigate(`/preview-survey/${survey.id}`)}>
                <h4>{survey.title}</h4>
                <p>Created: {new Date(survey.dateCreated).toLocaleDateString()}</p>
                <p>Participants: {survey.participantCount}</p>
                <span className={`status-badge ${survey.status.toLowerCase()}`}>
                  {survey.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Participants</h3>
            <button onClick={() => navigate('/manage-participants')}>View All</button>
          </div>
          <div className="recent-list">
            {recentParticipants.map(participant => (
              <div key={participant.id} className="recent-item">
                <h4>{participant.name}</h4>
                <p>{participant.email}</p>
                <p>Survey: {participant.surveyTitle}</p>
                <span className={`status-badge ${participant.status.toLowerCase()}`}>
                  {participant.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => navigate('/create-survey')}>
            Create New Survey
          </button>
          <button onClick={() => navigate('/manage-participants')}>
            Add Participants
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 