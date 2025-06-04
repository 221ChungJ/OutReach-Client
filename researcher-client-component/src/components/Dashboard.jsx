import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudies: 0,
    activeStudies: 0,
    totalParticipants: 0
  });
  const [allStudies, setAllStudies] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/get-studies-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();

        setStats({
          totalStudies: data.total_studies,
          activeStudies: data.active_studies,
          totalParticipants: data.total_participants,
        });

        // Transform the studies data to match our component's format
        const transformedStudies = data.studies.map((study, index) => ({
          id: index + 1, // You might want to add an ID in the API response
          title: study.title,
          dateCreated: new Date().toISOString().split('T')[0], // You might want to add this to the API response
          participantCount: study.num_participants,
          status: study.is_active ? 'Active' : 'Closed'
        }));

        const sortedStudies = transformedStudies.sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );

        setAllStudies(sortedStudies);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // You might want to add error handling UI here
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="app-container">

      <main className="main-content">
        <div className="dashboard">
          <h2>Dashboard</h2>

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
              <button onClick={() => navigate('/create-interview')}>
                Create New Interview
              </button>
              {/* <button onClick={() => navigate('/manage-participants')}>
                Add Participants
              </button> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;