import React from 'react';
import Navbar from '../components/navbar';
import "./navbar_css/message-history.css";

function MessageHistoryPage() {
  // Hardcoded list of message history data
  const messageHistory = [
    { id: 1,  receiver: 'John', timestamp: '2024-04-05 10:30', content: 'Hello, how are you?, Can i make an appointment on next Monday?' },
    { id: 2, receiver: 'Alex', timestamp: '2024-01-05 10:35', content: 'I\'m good, thanks!, Can I reschedule my appoinyment?' }  
  ];

  return (
    <>
      <Navbar />
      <div className="message-history">
        <h3>Message History</h3>
        <div className="message-list">
          {messageHistory.map(message => (
            <div key={message.id} className="message-item">
             
              <p className='message-receiver-name'>{message.receiver}</p>
              <p>{message.timestamp}</p>
              <p className='message-content'> {message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MessageHistoryPage;
