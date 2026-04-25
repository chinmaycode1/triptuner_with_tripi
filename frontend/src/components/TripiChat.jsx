import { useState, useRef, useEffect } from 'react';
import { chatWithTripi } from '../lib/api';
import { showToast } from './Toast';
import './TripiChat.css';

const QUICK_PROMPTS = [
  { label: '🏖️ Goa 5 days', query: 'Plan a 5-day trip to Goa for a couple with beaches and nightlife' },
  { label: '🏔️ Ladakh 7 days', query: 'Plan a 7-day Ladakh trip from Delhi with budget breakdown' },
  { label: '🛶 Kerala 6 days', query: 'Plan a 6-day Kerala backwaters and hill station trip' },
  { label: '🏰 Rajasthan 9 days', query: 'Plan a 9-day Rajasthan royal circuit Jaipur Jodhpur Jaisalmer Udaipur' },
  { label: '🧘 Rishikesh 3 days', query: 'Plan a 3-day spiritual and adventure trip to Rishikesh' },
  { label: '🌿 Coorg weekend', query: 'Plan a 2-day weekend trip to Coorg from Bangalore' },
];

const NAMASTE_RESPONSES = {
  en: "🙏 Namaste! I'm Tripi, your AI Travel Architect for India! I'm so happy you greeted me in the traditional Indian way. How can I help you plan your perfect India adventure today?",
  hi: "🙏 नमस्ते! मैं Tripi हूँ, आपका AI Travel Architect! आपने मुझे पारंपरिक भारतीय तरीके से अभिवादन किया, यह बहुत अच्छा लगा! आज मैं आपकी भारत यात्रा की योजना बनाने में कैसे मदद कर सकता हूँ?",
  ta: "🙏 வணக்கம்! நான் Tripi, உங்கள் AI பயண வடிவமைப்பாளர்! இந்திய பாரம்பரிய வழியில் வாழ்த்தியதற்கு நன்றி! இன்று உங்கள் இந்தியப் பயணத்தை திட்டமிட நான் எப்படி உதவலாம்?",
  te: "🙏 నమస్కారం! నేను Tripi, మీ AI ట్రావెల్ ఆర్కిటెక్ట్! సంప్రదాయ భారతీయ పద్ధతిలో నన్ను పలకరించినందుకు ధన్యవాదాలు! ఈరోజు మీ భారత్ యాత్రను ప్లాన్ చేయడంలో నేను ఎలా సహాయపడగలను?",
  bn: "🙏 নমস্কার! আমি Tripi, আপনার AI ট্রাভেল আর্কিটেক্ট! ঐতিহ্যবাহী ভারতীয় পদ্ধতিতে অভিবাদন জানানোর জন্য ধন্যবাদ! আজ আপনার ভারত ভ্রমণ পরিকল্পনায় আমি কীভাবে সাহায্য করতে পারি?",
  mr: "🙏 नमस्कार! मी Tripi आहे, तुमचा AI Travel Architect! पारंपारिक भारतीय पद्धतीने अभिवादन केल्याबद्दल धन्यवाद! आज मी तुमच्या भारत प्रवासाची योजना करण्यात कशी मदत करू शकतो?",
};

export default function TripiChat({ initialQuery = '', language = 'en' }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🙏 Namaste! I'm **Tripi** — Your AI Travel Architect for India! ✈️\n\nI can help you plan any trip across India's 28 states and 8 union territories. Ask me about destinations, budgets, itineraries, train routes, local food, festivals, or anything India travel!\n\nWhat adventure shall we plan today? 🗺️"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      setTimeout(() => sendMessage(initialQuery), 300);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    // Easter egg: namaste
    if (userText.toLowerCase() === 'namaste') {
      const response = NAMASTE_RESPONSES[language] || NAMASTE_RESPONSES.en;
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userText },
        { role: 'assistant', content: response }
      ]);
      setInput('');
      return;
    }

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const last20 = newMessages.slice(-20);
      const { reply } = await chatWithTripi(last20, language);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      showToast('Failed to get response. Check your connection.', 'error');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="tripi-chat">
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="tripi-avatar" aria-hidden="true">🧭</div>
            )}
            <div
              className="message-bubble"
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="tripi-avatar" aria-hidden="true">🧭</div>
            <div className="message-bubble typing-indicator" aria-label="Tripi is typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Ask Tripi anything about India travel... (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          aria-label="Message input"
          disabled={loading}
        />
        <button
          className="chat-send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </div>
    </div>
  );
}
