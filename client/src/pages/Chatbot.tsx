import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiSend, FiFileText, FiUser, FiCopy, FiCheck, FiTrash2, FiPlus, FiClock, FiChevronLeft, FiGlobe } from 'react-icons/fi';
import { geminiService, type ReportContext, type ChatMessage } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [reportData, setReportData] = useState<ReportContext | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState<{id: string, title: string, messages: ChatMessage[], timestamp: Date, reportData?: ReportContext}[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check API key configuration
    setApiKeyConfigured(geminiService.isConfigured());
    
    // Load chat histories from localStorage
    try {
      const savedHistories = localStorage.getItem('chatHistories');
      if (savedHistories) {
        const parsed = JSON.parse(savedHistories).map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp),
          messages: h.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setChatHistories(parsed);
      }
    } catch (error) {
      console.error('Error loading chat histories:', error);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reportId')) {
      const reportId = urlParams.get('reportId');
      const vessel = urlParams.get('vessel');
      const species = urlParams.get('species');
      const coverage = urlParams.get('coverage');
      const criticality = urlParams.get('criticality');
      const fuelPenalty = urlParams.get('fuelPenalty');
      const method = urlParams.get('method');
      const urgency = urlParams.get('urgency');
      const note = urlParams.get('note');
      
      if (reportId && vessel && species && coverage && criticality && fuelPenalty && method && urgency && note) {
        const data = { reportId, vessel, species, coverage, criticality, fuelPenalty, method, urgency, note };
        setReportData(data);
        setMessages([{
          text: `Hello! I have loaded the complete report data for ${data.reportId} (${data.vessel}). Here's the summary:\n\nReport ID: ${data.reportId}\nVessel: ${data.vessel}\nSpecies: ${data.species}\nCoverage: ${data.coverage}%\nCriticality: ${data.criticality}\nFuel Penalty: ${data.fuelPenalty}%\nRecommendation: ${data.method}\nUrgency: ${data.urgency}\nNote: ${data.note}\n\nHow can I help you understand this fouling analysis report?`,
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } else {
      setMessages([{
        text: 'Hello! I\'m your marine biofouling assistant. I can help you understand hull analysis reports, fouling species, cleaning recommendations, and answer any questions about marine fouling. How can I assist you today?',
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!apiKeyConfigured) {
      return;
    }
    
    const userMessage = inputMessage.trim();
    const newMessages = [...messages, { text: userMessage, isUser: true, timestamp: new Date() }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    try {
      const aiResponse = await geminiService.generateResponse(
        userMessage,
        messages,
        reportData || undefined,
        webSearchEnabled && !!reportData
      );
      
      setMessages([...newMessages, { text: aiResponse, isUser: false, timestamp: new Date() }]);
    } catch (error: any) {
      console.error('Error generating response:', error);
      setMessages([...newMessages, { 
        text: `Error: ${error.message}`, 
        isUser: false, 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const saveCurrentChat = () => {
    if (messages.length === 0) return;
    
    try {
      const chatId = currentChatId || Date.now().toString();
      const title = messages.find(m => m.isUser)?.text.slice(0, 50) + '...' || 'New Chat';
      
      const chatHistory = {
        id: chatId,
        title,
        messages,
        timestamp: new Date(),
        reportData: reportData || undefined
      };
      
      const updatedHistories = chatHistories.filter(h => h.id !== chatId);
      updatedHistories.unshift(chatHistory);
      
      setChatHistories(updatedHistories);
      localStorage.setItem('chatHistories', JSON.stringify(updatedHistories));
      setCurrentChatId(chatId);
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const clearChat = () => {
    if (messages.length > 0) {
      saveCurrentChat();
    }
    setMessages([]);
    setInputMessage('');
    setIsTyping(false);
    setCurrentChatId(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const startNewChat = () => {
    clearChat();
    window.location.href = '/chatbot';
  };

  const loadChatHistory = (history: any) => {
    setMessages(history.messages);
    setReportData(history.reportData || null);
    setCurrentChatId(history.id);
    setShowHistory(false);
  };

  const deleteChatHistory = (id: string) => {
    try {
      const updatedHistories = chatHistories.filter(h => h.id !== id);
      setChatHistories(updatedHistories);
      localStorage.setItem('chatHistories', JSON.stringify(updatedHistories));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };



  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex">
      {/* Chat History Sidebar */}
      <div className={`${showHistory ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Chat History</h2>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 text-gray-500 hover:text-gray-700 rounded"
            >
              <FiChevronLeft className="text-sm" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chatHistories.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">No chat history yet</p>
          ) : (
            chatHistories.map((history) => (
              <div
                key={history.id}
                className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-50 group ${
                  currentChatId === history.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => loadChatHistory(history)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {history.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {history.timestamp.toLocaleDateString()}
                    </p>
                    {history.reportData && (
                      <div className="flex items-center gap-1 mt-1">
                        <FiFileText className="text-xs text-blue-500" />
                        <span className="text-xs text-blue-600">{history.reportData.reportId}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatHistory(history.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiMessageCircle className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {reportData ? `Report Assistant` : 'FoulingGuard AI'}
                </h1>
                <p className="text-sm text-gray-600">
                  {reportData ? `Analyzing ${reportData.reportId} - ${reportData.vessel}` : 'Marine Biofouling Intelligence'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {reportData && (
                <button
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    webSearchEnabled 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={webSearchEnabled ? 'Web Search Enabled' : 'Enable Web Search'}
                >
                  <FiGlobe className="text-sm" />
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              )}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Chat history"
              >
                <FiClock className="text-sm" />
              </button>
              <button
                onClick={startNewChat}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="New chat"
              >
                <FiPlus className="text-sm" />
              </button>
              {reportData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <FiFileText className="text-blue-600 text-sm" />
                  <span className="text-xs text-blue-700">Report Loaded</span>
                  {webSearchEnabled && (
                    <div className="flex items-center gap-1 ml-2 pl-2 border-l border-blue-300">
                      <FiGlobe className="text-blue-600 text-xs" />
                      <span className="text-xs text-blue-700">Web Search</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Summary Card */}
        {reportData && (
          <div className="border-b border-gray-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-gray-500 text-xs">Vessel</span>
                <p className="font-medium text-gray-900">{reportData.vessel}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-gray-500 text-xs">Coverage</span>
                <p className="font-medium text-gray-900">{reportData.coverage}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-gray-500 text-xs">Criticality</span>
                <p className={`font-medium ${
                  reportData.criticality === 'High' ? 'text-red-600' : 
                  reportData.criticality === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>{reportData.criticality}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-gray-500 text-xs">Fuel Penalty</span>
                <p className="font-medium text-gray-900">{reportData.fuelPenalty}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {message.isUser ? <FiUser className="text-white text-sm" /> : <FiMessageCircle className="text-white text-sm" />}
              </div>
              <div className={`max-w-[70%] ${message.isUser ? 'text-right' : 'text-left'}`}>
                <div className={`group relative inline-block p-4 rounded-2xl ${
                  message.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line prose prose-sm max-w-none">
                    {message.isUser ? (
                      message.text
                    ) : (
                      <div dangerouslySetInnerHTML={{
                        __html: message.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^### (.*$)/gm, '<h3 class="font-semibold text-gray-900 mt-3 mb-2">$1</h3>')
                          .replace(/^## (.*$)/gm, '<h2 class="font-bold text-gray-900 mt-4 mb-2">$1</h2>')
                          .replace(/^# (.*$)/gm, '<h1 class="font-bold text-lg text-gray-900 mt-4 mb-3">$1</h1>')
                          .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
                          .replace(/\n\n/g, '</p><p class="mt-2">')
                          .replace(/^(.)/gm, '<p>$1')
                          .replace(/(.*)$/gm, '$1</p>')
                      }} />
                    )}
                  </div>
                  {!message.isUser && (
                    <button
                      onClick={() => copyToClipboard(message.text, index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200"
                      title="Copy message"
                    >
                      {copiedIndex === index ? (
                        <FiCheck className="text-xs text-green-600" />
                      ) : (
                        <FiCopy className="text-xs text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <FiMessageCircle className="text-white text-sm" />
              </div>
              <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex gap-3 items-start">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={reportData ? "Ask about this report..." : "Message FoulingGuard AI..."}
                className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[48px] max-h-[120px]"
                disabled={isTyping}
                rows={1}
              />
              {inputMessage && (
                <div className="absolute bottom-2 right-12 text-xs text-gray-400">
                  {inputMessage.length}
                </div>
              )}
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white w-12 h-12 rounded-xl transition-colors flex items-center justify-center flex-shrink-0 mt-0"
            >
              <FiSend className="text-sm" />
            </button>
          </div>
          <div className="mt-3 text-center">
            {!apiKeyConfigured && (
              <p className="text-xs text-red-600 mb-2 font-medium">
                ⚠️ Gemini API key required. Set VITE_GEMINI_API_KEY in .env file.
              </p>
            )}
            <p className="text-xs text-gray-500">
              <span className="inline-block mr-4">
                {reportData 
                  ? `Ask about species, coverage, recommendations, or any aspect of this report${webSearchEnabled ? ' (with web search)' : ''}`
                  : "Ask about fouling detection, species identification, cleaning methods, or prevention strategies"
                }
              </span>
              <span className="text-gray-400">• Press Enter to send, Shift+Enter for new line</span>
            </p>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              ⚠️ AI responses may contain errors. Please verify critical information independently.
            </p>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default Chatbot;
