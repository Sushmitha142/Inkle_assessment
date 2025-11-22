import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Plane, Sparkles, Bot, Zap, Star, Compass, RefreshCw } from 'lucide-react';
import MessageBubble from './components/MessageBubble';
import LoadingIndicator from './components/LoadingIndicator';
import QuickActions from './components/QuickActions';
import SettingsPanel from './components/SettingsPanel';
import { apiService } from './services/api';

function App() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "✨ Welcome to your premium AI travel companion! I'm here to make your journey extraordinary. Ask me about weather, hidden gems, local attractions, or let me help you craft the perfect itinerary for any destination! ✈️🌍",
            isUser: false,
            data: null
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const [settings, setSettings] = useState({ language: 'en' });
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        // Check API health on mount
        const checkHealth = async () => {
            const healthy = await apiService.healthCheck();
            setIsOnline(healthy);
        };

        checkHealth();

        // Set up periodic health checks
        const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async (message) => {
        if (!message.trim() || isLoading) return;

        setError(null);
        setIsLoading(true);

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: message,
            isUser: true,
            data: null
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            const response = await apiService.sendQuery(message, settings);

            // Add AI response
            const aiMessage = {
                id: Date.now() + 1,
                text: response.reply,
                isUser: false,
                data: {
                    location_info: response.location_info,
                    weather_data: response.weather_data,
                    places_data: response.places_data
                }
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsOnline(true);

        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message);
            setIsOnline(false);

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting to my services. Please check your internet connection and try again.",
                isUser: false,
                data: null
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputMessage);
    };

    const handleQuickAction = (actionId, customText) => {
        if (actionId === 'custom' && customText) {
            setInputMessage(customText);
            sendMessage(customText);
            return;
        }

        const actionTemplates = {
            weather: "What's the weather in ",
            places: "What are the tourist attractions in ",
            plan: "I'm planning a trip to "
        };

        const template = actionTemplates[actionId];
        if (template) {
            setInputMessage(template);
            inputRef.current?.focus();
        }
    };

    const handleSettingsChange = (newSettings) => {
        setSettings(newSettings);

        // Show a brief message about the language change
        const settingsMessage = {
            id: Date.now(),
            text: `Language preference updated to: ${newSettings.language === 'en' ? 'English' :
                    newSettings.language === 'local' ? 'Local Names' :
                        'Both (English preferred)'
                }`,
            isUser: false,
            data: null
        };

        setMessages(prev => [...prev, settingsMessage]);
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                text: "✨ Welcome to your premium AI travel companion! I'm here to make your journey extraordinary. Ask me about weather, hidden gems, local attractions, or let me help you craft the perfect itinerary for any destination! ✈️🌍",
                isUser: false,
                data: null
            }
        ]);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Header */}
            <header className="header relative z-10">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 animate-slide-in">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
                                    <Bot className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-accent-emerald to-accent-cyan rounded-full animate-pulse-slow"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                    Tourism AI Assistant
                                    <div className="flex gap-1">
                                        <Sparkles className="w-6 h-6 text-accent-amber animate-pulse" />
                                        <Zap className="w-5 h-5 text-accent-cyan animate-bounce-slow" />
                                    </div>
                                </h1>
                                <p className="text-dark-400 font-medium">
                                    Your premium AI-powered travel companion 🌟
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                            {/* Online Status */}
                            <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
                                <div className={`${isOnline ? 'status-online' : 'status-offline'}`} />
                                <span className="text-sm font-semibold text-gray-200">
                                    {isOnline ? '🟢 Connected' : '🔴 Offline'}
                                </span>
                            </div>

                            {/* Clear Chat Button */}
                            <button
                                onClick={clearChat}
                                className="btn btn-secondary text-sm"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                New Chat
                            </button>

                            {/* Settings Panel */}
                            <SettingsPanel
                                currentSettings={settings}
                                onSettingsChange={handleSettingsChange}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="max-w-5xl mx-auto px-6 py-8 relative z-10">
                <div className="card min-h-[700px] flex flex-col animate-slide-up">

                    {/* Messages Area */}
                    <div className="flex-1 p-8 space-y-6 overflow-y-auto max-h-[550px] custom-scrollbar">
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <MessageBubble
                                    message={message}
                                    isUser={message.isUser}
                                />
                            </div>
                        ))}

                        {isLoading && (
                            <div className="animate-slide-up">
                                <LoadingIndicator />
                            </div>
                        )}

                        {error && (
                            <div className="chat-bubble assistant bg-red-500/10 border-red-500/20 animate-slide-up">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <span className="text-red-300 font-medium">⚠️ {error}</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-8 py-4 border-t border-white/10">
                        <QuickActions onAction={handleQuickAction} disabled={isLoading} />
                    </div>

                    {/* Input Area */}
                    <div className="p-8 border-t border-white/10">
                        <form onSubmit={handleSubmit} className="flex gap-4">
                            <div className="relative flex-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="✨ Ask me about any destination... (e.g., 'What's magical about Tokyo?')"
                                    className="input-field pr-12 text-lg"
                                    disabled={isLoading}
                                    maxLength={500}
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <Compass className="w-5 h-5 text-dark-500 animate-spin" style={{ animationDuration: '8s' }} />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !inputMessage.trim() || !isOnline}
                                className="btn btn-primary px-8 py-4 text-lg disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Thinking...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        <span>Send</span>
                                    </div>
                                )}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <div className="inline-flex items-center gap-2 text-dark-500 text-sm">
                                <Star className="w-4 h-4 text-accent-amber" />
                                <span>Powered by OpenStreetMap, Open-Meteo & Advanced AI</span>
                                <Star className="w-4 h-4 text-accent-amber" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-5xl mx-auto px-6 py-8 text-center relative z-10">
                <div className="glass rounded-2xl p-6">
                    <p className="text-dark-300 font-medium">
                        🚀 Built with passion for <span className="text-gradient-primary font-bold">Inkle AI</span> •
                        <a
                            href="https://github.com/your-username/tourism-ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-accent-cyan hover:text-accent-purple underline transition-colors duration-300 font-semibold"
                        >
                            ⭐ View Source Code
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;