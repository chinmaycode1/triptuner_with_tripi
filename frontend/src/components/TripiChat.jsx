import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatWithTripi, saveTrip } from '../lib/api';
import { 
  createConversation, 
  saveMessage, 
  getConversationMessages 
} from '../lib/chatHistory';
import { showToast } from './Toast';
import { generateItineraryPDF } from '../lib/enhancedPdf';
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

export default function TripiChat({ initialQuery = '', language = 'en', conversationId: propConversationId = null }) {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState(propConversationId);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🙏 Namaste! I'm **Tripi** — Your AI Travel Architect for India! ✈️\n\nI can help you plan any trip across India's 28 states and 8 union territories. Ask me about destinations, budgets, itineraries, train routes, local food, festivals, or anything India travel!\n\nWhat adventure shall we plan today? 🗺️"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load conversation history if conversationId is provided
  useEffect(() => {
    if (conversationId && user) {
      loadConversationHistory();
    }
  }, [conversationId, user]);

  const loadConversationHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data, error } = await getConversationMessages(conversationId);
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Replace messages with loaded history
        setMessages(data.map(msg => ({
          role: msg.role,
          content: msg.content
        })));
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      showToast('Failed to load conversation history', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

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
      const newMessages = [
        { role: 'user', content: userText },
        { role: 'assistant', content: response }
      ];
      
      setMessages(prev => [...prev, ...newMessages]);
      setInput('');
      
      // Save to database if user is logged in
      if (user) {
        await saveMessagesToDatabase(newMessages);
      }
      return;
    }

    const userMessage = { role: 'user', content: userText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Save user message to database if logged in
    if (user) {
      await saveMessagesToDatabase([userMessage]);
    }

    try {
      const last20 = newMessages.slice(-20);
      const { reply } = await chatWithTripi(last20, language);
      const assistantMessage = { role: 'assistant', content: reply };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message to database if logged in
      if (user) {
        await saveMessagesToDatabase([assistantMessage]);
      }
    } catch (err) {
      showToast('Failed to get response. Check your connection.', 'error');
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏"
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to database if logged in
      if (user) {
        await saveMessagesToDatabase([errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveMessagesToDatabase = async (messagesToSave) => {
    if (!user) return;

    try {
      // Create conversation if it doesn't exist
      let currentConversationId = conversationId;
      
      if (!currentConversationId) {
        const { data, error } = await createConversation(user.id);
        if (error) throw error;
        currentConversationId = data.id;
        setConversationId(currentConversationId);
      }

      // Save each message
      for (const message of messagesToSave) {
        const { error } = await saveMessage(
          currentConversationId,
          user.id,
          message.role,
          message.content
        );
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving messages to database:', error);
      // Don't show error toast to avoid interrupting user experience
      // Messages are still shown in UI even if save fails
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

  // Extract trip details from assistant message
  const extractTripDetails = (content) => {
    const details = {
      destination: '',
      duration_days: 5,
      budget_total: 25000,
      group_size: 2,
      trip_type: 'Adventure',
      interests: []
    };

    // Extract destination (look for common patterns)
    const destMatch = content.match(/(?:trip to|visit|explore|plan.*?(?:to|for))\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (destMatch) details.destination = destMatch[1];

    // Extract duration
    const daysMatch = content.match(/(\d+)[\s-]*(?:day|days)/i);
    if (daysMatch) details.duration_days = parseInt(daysMatch[1]);

    // Extract budget
    const budgetMatch = content.match(/₹\s*([0-9,]+)/);
    if (budgetMatch) details.budget_total = parseInt(budgetMatch[1].replace(/,/g, ''));

    // Extract group size
    const groupMatch = content.match(/(\d+)\s*(?:people|person|pax|travelers)/i);
    if (groupMatch) details.group_size = parseInt(groupMatch[1]);

    return details;
  };

  // Check if message contains an itinerary
  const isItinerary = (content) => {
    const itineraryKeywords = ['day 1', 'day 2', 'itinerary', 'schedule', 'morning:', 'afternoon:', 'evening:'];
    const lowerContent = content.toLowerCase();
    return itineraryKeywords.some(keyword => lowerContent.includes(keyword));
  };

  const handleSaveItinerary = async (messageIndex) => {
    if (!user) {
      showToast('Please log in to save trips', 'warning');
      return;
    }

    const message = messages[messageIndex];
    if (!message || message.role !== 'assistant') return;

    setSavingTrip(true);
    try {
      const { saveItineraryAsPDF, extractTripData } = await import('../lib/saveTripPDF');
      
      const tripData = extractTripData(message.content, 'chat');
      await saveItineraryAsPDF(tripData);
    } catch (err) {
      console.error('Save trip error:', err);
      showToast(`Failed to save trip: ${err.message}`, 'error');
    } finally {
      setSavingTrip(false);
    }
  };

  const handleDownloadPDF = async (messageIndex) => {
    const message = messages[messageIndex];
    if (!message || message.role !== 'assistant') return;

    setDownloadingPDF(true);
    try {
      const tripDetails = extractTripDetails(message.content);
      
      await generateItineraryPDF({
        destination: tripDetails.destination || 'India Trip',
        duration: tripDetails.duration_days,
        groupSize: tripDetails.group_size,
        budget: tripDetails.budget_total,
        budgetPerPerson: Math.round(tripDetails.budget_total / tripDetails.group_size),
        tripType: tripDetails.trip_type,
        style: 'Mid-range Comfort',
        transport: 'Public Transport',
        accommodation: 'Mid-range Hotel',
        season: 'Winter (Oct-Feb)',
        interests: tripDetails.interests,
        itinerary: message.content,
      });
      
      showToast('PDF downloaded! 📄', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF', 'error');
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="tripi-chat">
      {loadingHistory && (
        <div className="loading-history">
          <div className="loading-spinner"></div>
          <p>Loading conversation history...</p>
        </div>
      )}
      
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {!user && messages.length > 1 && (
          <div className="chat-notice">
            <p>💡 <strong>Tip:</strong> Sign in to save your chat history and access it from any device!</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="tripi-avatar" aria-hidden="true">🧭</div>
            )}
            <div className="message-content-wrapper">
              <div
                className="message-bubble"
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
              {msg.role === 'assistant' && isItinerary(msg.content) && (
                <div className="message-actions">
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => handleSaveItinerary(i)}
                    disabled={savingTrip || !user}
                    title={!user ? 'Please log in to save trips' : 'Save this itinerary'}
                  >
                    {savingTrip ? '⏳ Saving...' : '💾 Save Trip'}
                  </button>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => handleDownloadPDF(i)}
                    disabled={downloadingPDF}
                  >
                    {downloadingPDF ? '⏳ Generating...' : '📄 Download PDF'}
                  </button>
                </div>
              )}
            </div>
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
          disabled={loading || loadingHistory}
        />
        <button
          className="chat-send-btn"
          onClick={() => sendMessage()}
          disabled={loading || loadingHistory || !input.trim()}
          aria-label="Send message"
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </div>
    </div>
  );
}
