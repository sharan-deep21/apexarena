import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { getCurrentVenue } from '../data/venues';

export function useChat() {
  const venue = getCurrentVenue();
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `Welcome to ${venue.name}! 🏟️ I'm your AI assistant for FIFA World Cup 2026. How can I help you today?`, 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendUserMessage = useCallback(async (text, telemetry = {}) => {
    if (!text.trim() || isLoading) return;
    const userMsg = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const response = await sendChatMessage(text, telemetry);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response.text, sender: 'bot', timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm sorry, I encountered an error. Please try again.", sender: 'bot', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    setMessages([{ id: 1, text: "Chat cleared. How can I help you?", sender: 'bot', timestamp: new Date() }]);
  }, []);

  return { messages, isLoading, sendMessage: sendUserMessage, clearChat };
}
