import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';
import { getGeminiResponse } from '../utils/geminiApi';
import logo from "../assets/logo_new.png";
const conversationStarters = [
    "How can I improve my productivity?",
    "Give me some motivation for today",
    "Help me plan my week",
    "What's a good way to manage stress?"
];

const AIChatModal = ({ open, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hi there! I'm your personal AI assistant 'Soli'. How can I assist you today?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        const aiText = await getGeminiResponse(userMessage.text);

        const aiResponse = {
            id: (Date.now() + 1).toString(),
            text: aiText,
            sender: 'ai',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleStarterClick = (starter) => {
        setInputMessage(starter);
    };

    // Handler to close modal when clicking outside
    const modalRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose && onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div ref={modalRef} className="relative w-full max-w-2xl mx-auto bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark rounded-xl shadow-2xl border-4 border-brand-orange mt-3" style={{ borderColor: '#ff6600' }}>
                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-1 right-3 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-orange-500 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>
                {/* Header */}
                <div className="bg-white dark:bg-dark-card rounded-t-xl p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-black dark:text-white">
                                Soli - AI
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Your Personal AI Assistant.
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                            <span>Private & Secure</span>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="flex flex-col h-[70vh] bg-white dark:bg-dark-card rounded-b-xl">
                    {/* Conversation Starters */}
                    {messages.length <= 1 && (
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                Quick conversation starters:
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {conversationStarters.map((starter, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleStarterClick(starter)}
                                        className="text-left p-3 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                    >
                                        {starter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.sender === 'ai' && (
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${message.sender === 'user'
                                        ? 'bg-brand-orange text-white rounded-br-md'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                    <p className={`text-xs mt-2 ${message.sender === 'user'
                                        ? 'text-orange-100'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                {message.sender === 'user' && (
                                    <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message here... (Press Enter to send)"
                                    rows={1}
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none text-sm"
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                                className="px-4 py-3 bg-brand-orange text-white rounded-xl hover:bg-brand-orange-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            Your conversations are private and secure. AI responses are for assistance only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatModal;