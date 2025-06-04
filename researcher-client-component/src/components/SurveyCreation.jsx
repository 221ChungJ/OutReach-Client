import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionEditor from './QuestionEditor';

function SurveyCreation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [surveyData, setSurveyData] = useState({
    title: '',
    abstract: '',
    methodology: '',
  });
  const [participantsFile, setParticipantsFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const [touched, setTouched] = useState({
    title: false,
    abstract: false,
    methodology: false,
    participantsFile: false
  });

  const [questions_and_intents, setQuestions_and_Intents] = useState([]);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);

  const isFormValid = () => {
    return surveyData.title.trim() !== '' && 
           surveyData.abstract.trim() !== '' &&
           surveyData.methodology.trim() !== '' &&
           participantsFile !== null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurveyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const questions_and_reasons = await fetch('https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/generate-initial-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: surveyData.title,
          abstract: surveyData.abstract,
          methodology: surveyData.methodology,
        })
      });
      
      if (!questions_and_reasons.ok) {
        throw new Error('Failed to fetch initial questions and reasons');
      }
      
      const question_and_reasons_data = await questions_and_reasons.json();

      console.log(question_and_reasons_data);
      
      // Combine questions with their reasons
      const questionsWithRationales = question_and_reasons_data.questions.map((q, index) => ({
        question: q,
        rationale: question_and_reasons_data.reasons[index] || ''
      }));
      
      setQuestions_and_Intents(questionsWithRationales);
      setShowQuestionEditor(true);
    } catch (error) {
      console.error('Error fetching next question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterviewCreation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let participantData = [];
      
      if (participantsFile) {
        const text = await participantsFile.text();
        // Skip header row and parse CSV
        const rows = text.split('\n').slice(1);
        participantData = rows
          .map(row => {
            const [email, name] = row.split(',').map(field => field.trim());
            return { email, name };
          })
          .filter(participant => participant.email); // Only include rows with email
      }

      const create_interview_response = await fetch('https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/create-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          study_id: 1,
          title: surveyData.title,
          abstract: surveyData.abstract,
          methodology: surveyData.methodology,
          participants: participantData,
        })
      });

      if (!create_interview_response.ok) {
        throw new Error('Failed to create interview');
      }
      
      const create_interview_response_data = await create_interview_response.json();
      const session_ids = create_interview_response_data.new_IDs;
      console.log(session_ids);
      
      const upload_response = await fetch('https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: session_ids,
          questions_and_intents: questions_and_intents.map(q => ({
            question: q.question,
            intent: q.rationale
          }))        
        })
      });

      if (!upload_response.ok) {
        throw new Error('Failed to upload interview');
      }

      const upload_response_data = await upload_response.json();
      console.log(upload_response_data);
      
    } catch (error) {
      console.error('Error creating interview:', error);
    } finally {
      setIsLoading(false);
      navigate('/');
    }
  }

  const handleQuestionsChange = (updatedQuestions) => {
    // Extract just the questions for the parent component
    setQuestions_and_Intents(updatedQuestions.map(q => typeof q === 'string' ? { question: q, rationale: '' } : q));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setFileError('Please upload a CSV file');
        setParticipantsFile(null);
        return;
      }
      
      setParticipantsFile(file);
    }
  };

  return (
    <div className="survey-creation">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <h2>Create New Interview</h2>
      <form onSubmit={handleSubmit}>
        {!showQuestionEditor && (
          <>
            <div className="form-group">
              <label htmlFor="title">Interview Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={surveyData.title}
                onChange={handleInputChange}
                onBlur={() => handleBlur('title')}
                required
              />
              {touched.title && !surveyData.title.trim() && (
                <div className="error-message">Please enter a survey title</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="abstract">Research Abstract</label>
              <textarea
                id="abstract"
                name="abstract"
                value={surveyData.abstract}
                onChange={handleInputChange}
                onBlur={() => handleBlur('abstract')}
                rows="6"
                required
              />
              {touched.abstract && !surveyData.abstract.trim() && (
                <div className="error-message">Please enter a research abstract</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="methodology">Research Methodology</label>
              <textarea
                id="methodology"
                name="methodology"
                value={surveyData.methodology}
                onChange={handleInputChange}
                onBlur={() => handleBlur('methodology')}
                rows="6"
                required
              />
              {touched.methodology && !surveyData.methodology.trim() && (
                <div className="error-message">Please enter research methodology</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="participants">Upload Participants (CSV)</label>
              <input
                type="file"
                id="participants"
                name="participants"
                accept=".csv"
                onChange={handleFileChange}
                onBlur={() => handleBlur('participantsFile')}
              />
              {fileError && (
                <div className="error-message">{fileError}</div>
              )}
              <small className="help-text">Upload a CSV file containing participant information</small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                onClick={handleSubmit} 
                disabled={!isFormValid()}
              >
                Generate Initial Questions
              </button>
            </div>
          </>
        )}
      </form>

      {showQuestionEditor && (
        <div className="question-editor-section">
          <QuestionEditor 
            initialQuestions={questions_and_intents}
            onQuestionsChange={handleQuestionsChange}
          />
          <div className="form-actions">
            <button 
              onClick={handleInterviewCreation}
              className="continue-button"
              disabled={questions_and_intents.length === 0}
            >
              Create Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyCreation; 