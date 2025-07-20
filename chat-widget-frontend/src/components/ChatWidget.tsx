import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiCpu, FiUser } from 'react-icons/fi';
import './ChatWidget.css';
import { getSessionId, sendMessageToBot } from './api';

// --- Type Definition ---
interface Message {
  text: string;
  sender: 'bot' | 'user';
}

// --- Helper Components ---
const TypingIndicator: React.FC = () => (
  <div className="message-row bot">
    <div className="avatar"><FiCpu size={20}/></div>
    <div className="message-bubble">
      <div className="typing-indicator">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
);


// --- Main Widget Component ---
const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (isOpen) {
        const initializeChat = async () => {
            if (sessionId) { // Don't re-init if we already have a session
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const newSessionId = await getSessionId();
            if (newSessionId) {
                setSessionId(newSessionId);
                setMessages([{ text: "Hi there! How can I assist you today?", sender: "bot" }]);
            }
            setIsLoading(false);
        };
        initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- Handlers ---
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMessage: Message = { text: inputValue, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    const currentInputValue = inputValue;
    setInputValue('');
    setIsLoading(true);

    const botResponse = await sendMessageToBot(currentInputValue, sessionId);
    
    const botMessage: Message = { text: botResponse, sender: "bot" };
    // Simulate bot thinking time for better UX
    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };
    
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  // --- Animation Variants ---
  const widgetVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="chat-open-button"
            onClick={() => setIsOpen(true)}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-label="Open Chat"
          >
            <FiMessageSquare size={32}  />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-widget-container"
            variants={widgetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <header className="chat-header">
              <div className="header-content">
                <h3>AI Assistant</h3>
                <p>Online</p>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat"><FiX/></button>
            </header>

            <main className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message-row ${msg.sender}`}>
                  {msg.sender === 'bot' ? <div className="avatar"><FiCpu size={20}/></div> : null}
                  <div className="message-bubble">{msg.text}</div>
                  {msg.sender === 'user' ? <div className="avatar"><FiUser size={20}/></div> : null}
                </div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </main>

            <footer className="chat-input-container">
              <input type="text" className="chat-input" placeholder="Type a message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading}/>
              <button className="send-button" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} aria-label="Send Message"><FiSend/></button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;