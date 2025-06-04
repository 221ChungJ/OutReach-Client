import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch initial question when the session becomes active
  useEffect(() => {
    if (isSessionActive) {
      const fetchInitialQuestion = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/pop?session_id=${sessionId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch initial question');
          }
          const data = await response.json();

          if (!data || !data.question) {
            setIsInterviewComplete(true);
            setMessages(prevMessages => [
              ...prevMessages,
              { 
                role: 'agent', 
                content: 'Thank you for completing the interview! Your responses have been recorded. Have a great day!',
                reasoning: 'Interview complete',
                id: -1
              }
            ]);
            return;
          }

          setMessages([{ 
            role: 'agent', 
            content: data.question || 'An error occurred. Please contact your researcher.',
            reasoning: data.reasoning || 'N/A', 
            id: data.id || -1
          }]);
        } catch (error) {
          console.error('Error fetching initial question:', error);
          setIsInterviewComplete(true);
          setMessages([{ 
            role: 'agent', 
            content: 'Error fetching interview questions. Please contact your researcher.', 
            reasoning: 'N/A', 
            id: -1
          }]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialQuestion();
    }
  }, [isSessionActive, sessionId]);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchNextQuestion = async () => {
    try {
      const nextQuestionResponse = await fetch(`https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/pop?session_id=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!nextQuestionResponse.ok) {
        throw new Error('Failed to fetch next question');
      }
      
      const nextQuestionData = await nextQuestionResponse.json();
      
      // Check if there's no more data
      if (!nextQuestionData || !nextQuestionData.question) {
        setIsInterviewComplete(true);
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            role: 'agent', 
            content: 'Thank you for completing the interview! Your responses have been recorded. Have a great day!',
            reasoning: 'Interview complete',
            id: -1
          }
        ]);
        return;
      }
      
      // Add next question to chat
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'agent', 
          content: nextQuestionData.question,
          reasoning: nextQuestionData.reasoning || 'N/A',
          id: nextQuestionData.id || -1
        }
      ]);
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isInterviewComplete) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Send user response to API and make concurrent request
      const [response, concurrentResponse] = await Promise.all([
        fetch('https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/query-openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            session_id: sessionId,
            question: messages[messages.length - 1].content, 
            reasoning: messages[messages.length - 1].reasoning, 
            user_response: userMessage.content
          }),
        }),
        fetch('https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/set-processed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            id: messages[messages.length - 1].id,
          }),
        })
      ]);
      
      if (!response.ok) {
        throw new Error('Failed to get agent response');
      }
      
      await response.json();
      await concurrentResponse.json();

      // Fetch next question
      await fetchNextQuestion();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'agent', content: 'Sorry, there was an error processing your message.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId.trim()) return;

    setIsLoading(true);
    setSessionError('');

    try {
      // Validate session ID
      const response = await fetch(`https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/validate-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate session');
      }

      const data = await response.json();
      
      if (data.valid) {
        setIsSessionActive(true);
      } else {
        setSessionError('Invalid session ID. Please try again.');
      }
    } catch (error) {
      console.error('Error validating session:', error);
      setSessionError('Failed to validate session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSessionActive) {
    return (
      <div className="session-container">
        <form className="session-form" onSubmit={handleSessionSubmit}>
          <h2>Enter Session ID</h2>
          {sessionError && <div className="session-error">{sessionError}</div>}
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter your session ID"
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !sessionId.trim()}>
            {isLoading ? 'Validating...' : 'Start Chat'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-inner">
              <div className="message-content">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message agent">
            <div className="message-inner">
              <div className="message-content loading">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your response here..."
          disabled={isLoading || isInterviewComplete}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim() || isInterviewComplete}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App
