import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SurveyPreview() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  // TODO: Replace with actual API call
  useEffect(() => {
    // Mock survey data
    setSurvey({
      id: id,
      title: 'Sample Survey',
      abstract: 'This is a sample survey abstract',
      methodology: 'This is the methodology description',
      questions: [
        'What is your experience with the product?',
        'How often do you use similar products?',
        'What features do you find most valuable?',
        'What improvements would you suggest?'
      ]
    });
  }, [id]);

  const handleAnswer = (answer) => {
    setAnswers(prev => [...prev, answer]);
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const resetPreview = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsComplete(false);
  };

  if (!survey) {
    return <div>Loading...</div>;
  }

  return (
    <div className="survey-preview">
      <h2>Survey Preview: {survey.title}</h2>
      
      <div className="preview-container">
        <div className="chat-interface">
          {!isComplete ? (
            <>
              <div className="chat-messages">
                {answers.map((answer, index) => (
                  <div key={index} className="message-pair">
                    <div className="bot-message">
                      {survey.questions[index]}
                    </div>
                    <div className="user-message">
                      {answer}
                    </div>
                  </div>
                ))}
                <div className="bot-message">
                  {survey.questions[currentQuestionIndex]}
                </div>
              </div>
              
              <div className="answer-input">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleAnswer(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button onClick={() => {
                  const input = document.querySelector('.answer-input input');
                  if (input.value.trim()) {
                    handleAnswer(input.value);
                    input.value = '';
                  }
                }}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="preview-complete">
              <h3>Preview Complete</h3>
              <p>This is how the interview will flow for your participants.</p>
              <button onClick={resetPreview}>Start New Preview</button>
            </div>
          )}
        </div>

        <div className="preview-info">
          <h3>Survey Information</h3>
          <div className="info-section">
            <h4>Abstract</h4>
            <p>{survey.abstract}</p>
          </div>
          <div className="info-section">
            <h4>Methodology</h4>
            <p>{survey.methodology}</p>
          </div>
          <div className="info-section">
            <h4>Questions Flow</h4>
            <ol>
              {survey.questions.map((question, index) => (
                <li key={index} className={index === currentQuestionIndex ? 'current' : ''}>
                  {question}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyPreview; 