import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';
import { getSessionId, sendMessageToBot } from './api';

// Define a type for our message object for type safety
interface Message {
  text: string;
  sender: 'bot' | 'user';
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = async () => {
            const newSessionId = await getSessionId();
            if (newSessionId) {
                setSessionId(newSessionId);
                setMessages([{ text: "Hello! How can I help you today?", sender: "bot" }]);
            }
        };
        initializeChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !sessionId || isLoading) return;

        const userMessage: Message = { text: inputValue, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        const currentInputValue = inputValue;
        setInputValue('');
        setIsLoading(true);

        const botResponse = await sendMessageToBot(currentInputValue, sessionId);
        
        const botMessage: Message = { text: botResponse, sender: "bot" };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };

    return (
        <>
            <button className="chat-open-button" onClick={() => setIsOpen(true)}>💬</button>
            <div className={`chat-widget-container ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <span>Chat with Support</span>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>_</button>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}-message`}>{msg.text}</div>
                    ))}
                    {isLoading && <div className="message bot-message">Typing...</div>}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-container">
                    <input type="text" className="chat-input" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading}/>
                    <button className="send-button" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>➤</button>
                </div>
            </div>
        </>
    );
};

export default ChatWidget;