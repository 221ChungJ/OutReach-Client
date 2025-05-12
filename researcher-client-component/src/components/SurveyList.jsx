import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SurveyList() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Replace with actual API call
  const loadSurveys = async () => {
    // Mock data for now
    setSurveys([
      {
        id: 1,
        title: 'User Experience Study',
        dateCreated: '2024-03-15',
        participantCount: 10,
        status: 'Active'
      },
      // Add more mock surveys as needed
    ]);
  };

  const handleDeleteSurvey = async (id) => {
    // TODO: Add API call to delete survey
    setSurveys(prev => prev.filter(survey => survey.id !== id));
  };

  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="survey-list">
      <div className="header">
        <h2>My Surveys</h2>
        <button onClick={() => navigate('/create-survey')}>Create New Survey</button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search surveys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="surveys-grid">
        {filteredSurveys.map(survey => (
          <div key={survey.id} className="survey-card">
            <h3>{survey.title}</h3>
            <div className="survey-details">
              <p>Created: {new Date(survey.dateCreated).toLocaleDateString()}</p>
              <p>Participants: {survey.participantCount}</p>
              <p>Status: {survey.status}</p>
            </div>
            <div className="survey-actions">
              <button onClick={() => navigate(`/preview-survey/${survey.id}`)}>
                Preview
              </button>
              <button onClick={() => navigate(`/manage-participants?surveyId=${survey.id}`)}>
                Manage Participants
              </button>
              <button onClick={() => handleDeleteSurvey(survey.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="no-surveys">
          <p>No surveys found. Create your first survey to get started!</p>
        </div>
      )}
    </div>
  );
}

export default SurveyList; 