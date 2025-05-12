import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SurveyCreation() {
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState({
    title: '',
    abstract: '',
    methodology: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurveyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addQuestion = () => {
    if (currentQuestion.trim()) {
      setSurveyData(prev => ({
        ...prev,
        questions: [...prev.questions, currentQuestion.trim()]
      }));
      setCurrentQuestion('');
    }
  };

  const removeQuestion = (index) => {
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call to save survey
    console.log('Survey Data:', surveyData);
    navigate('/surveys');
  };

  return (
    <div className="survey-creation">
      <h2>Create New Survey</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Survey Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={surveyData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="abstract">Research Abstract</label>
          <textarea
            id="abstract"
            name="abstract"
            value={surveyData.abstract}
            onChange={handleInputChange}
            rows="6"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="methodology">Research Methodology</label>
          <textarea
            id="methodology"
            name="methodology"
            value={surveyData.methodology}
            onChange={handleInputChange}
            rows="6"
            required
          />
        </div>

        <div className="form-group">
          <label>Interview Questions</label>
          <div className="question-input">
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Enter a question"
            />
            <button type="button" onClick={addQuestion}>Add Question</button>
          </div>
          
          <div className="questions-list">
            {surveyData.questions.map((question, index) => (
              <div key={index} className="question-item">
                <span>{question}</span>
                <button type="button" onClick={() => removeQuestion(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/preview-survey/new')}>
            Preview Survey
          </button>
          <button type="submit">Save Survey</button>
        </div>
      </form>
    </div>
  );
}

export default SurveyCreation; 