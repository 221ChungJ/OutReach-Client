import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch initial question when the component mounts
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/pop?session_id=1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch initial question');
        }
        const data = await response.json();
        setMessages([{ 
          role: 'agent', 
          content: data.question || 'Hello! I\'m your interview agent. How can I help you today?',
          reasoning: data.reasoning || 'N/A', 
          id: data.id || -1
        }]);
      } catch (error) {
        console.error('Error fetching initial question:', error);
        setMessages([{ 
          role: 'agent', 
          content: 'Hello! I\'m your interview agent. How can I help you today?', 
          reasoning: 'N/A', 
          id: -1
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialQuestion();
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
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
            session_id: 1,
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
            session_id: 1,
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
      try {
        const nextQuestionResponse = await fetch('https://bm10enh2b1.execute-api.us-east-2.amazonaws.com/dev/pop?session_id=1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        
        if (!nextQuestionResponse.ok) {
          throw new Error('Failed to fetch next question');
        }
        
        const nextQuestionData = await nextQuestionResponse.json();
        
        // Add next question to chat
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            role: 'agent', 
            content: nextQuestionData.question || 'What would you like to discuss next?',
            reasoning: nextQuestionData.reasoning || 'N/A',
            id: nextQuestionData.id || -1
          }
        ]);
      } catch (error) {
        console.error('Error fetching next question:', error);
      }
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
          onChange={handleInputChange}
          placeholder="Type your response here..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App
