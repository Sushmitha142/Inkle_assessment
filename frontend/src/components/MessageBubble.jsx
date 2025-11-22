import React from 'react';
import { MapPin, Thermometer, Calendar, ExternalLink, Bot, User, Star, Sparkles } from 'lucide-react';
import MapPreview from './MapPreview';

const MessageBubble = ({ message, isUser }) => {
    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="chat-bubble user group">
                    <div className="flex items-start gap-3">
                        <p className="text-white font-medium leading-relaxed flex-1">{message.text}</p>
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start">
            <div className="space-y-4 max-w-[85%]">
                <div className="chat-bubble assistant group">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-100 leading-relaxed whitespace-pre-line flex-1 font-medium">{message.text}</p>
                    </div>
                </div>

                {message.data && (
                    <div className="space-y-4 ml-11">
                        {/* Location Info */}
                        {message.data.location_info && (
                            <div className="glass rounded-2xl p-5 border-l-4 border-accent-cyan animate-slide-in">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-accent-cyan" />
                                    </div>
                                    <span className="font-bold text-accent-cyan text-lg">📍 Location Details</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-semibold text-lg">
                                        {message.data.location_info.name}, {message.data.location_info.country}
                                    </p>
                                    <p className="text-dark-400 font-mono text-sm">
                                        🌐 {message.data.location_info.lat.toFixed(4)}°N, {message.data.location_info.lon.toFixed(4)}°E
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Weather Info */}
                        {message.data.weather_data && (
                            <div className="glass rounded-2xl p-5 border-l-4 border-accent-amber animate-slide-in" style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-accent-amber/20 rounded-lg flex items-center justify-center">
                                        <Thermometer className="w-4 h-4 text-accent-amber" />
                                    </div>
                                    <span className="font-bold text-accent-amber text-lg">🌡️ Weather Now</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-semibold text-xl">
                                        🌡️ {message.data.weather_data.temperature}°C
                                    </p>
                                    {message.data.weather_data.precipitation_probability > 0 && (
                                        <p className="text-dark-300 font-medium">
                                            🌧️ Rain probability: {message.data.weather_data.precipitation_probability}%
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Places Info */}
                        {message.data.places_data && message.data.places_data.length > 0 && (
                            <div className="glass rounded-2xl p-5 border-l-4 border-accent-emerald animate-slide-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-accent-emerald/20 rounded-lg flex items-center justify-center">
                                        <Star className="w-4 h-4 text-accent-emerald" />
                                    </div>
                                    <span className="font-bold text-accent-emerald text-lg">✨ Amazing Places</span>
                                </div>
                                <div className="space-y-3">
                                    {message.data.places_data.map((place, index) => (
                                        <div key={index} className="glass rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 border border-white/10">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Sparkles className="w-4 h-4 text-accent-pink" />
                                                        <h4 className="text-white font-bold">{place.name}</h4>
                                                    </div>
                                                    {place.category && (
                                                        <span className="inline-block bg-accent-purple/20 text-accent-purple px-3 py-1 rounded-full text-sm font-medium">
                                                            {place.category}
                                                        </span>
                                                    )}
                                                </div>
                                                {place.lat && place.lon && (
                                                    <a
                                                        href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}&zoom=15`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary px-3 py-2 text-sm ml-3 flex items-center gap-2"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        View
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Map Preview */}
                {message.data && message.data.location_info && (
                    <div className="ml-11 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                        <MapPreview
                            lat={message.data.location_info.lat}
                            lon={message.data.location_info.lon}
                            locationName={message.data.location_info.name}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;