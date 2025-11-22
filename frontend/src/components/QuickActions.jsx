import React from 'react';
import { Cloud, MapPin, Plane, Coffee, Mountain, Building2, Utensils } from 'lucide-react';

const QuickActions = ({ onAction, disabled = false }) => {
    const actions = [
        { id: 'weather', label: 'Weather Check', icon: Cloud, emoji: '🌤️', gradient: 'from-accent-cyan to-primary-500' },
        { id: 'places', label: 'Find Places', icon: MapPin, emoji: '🗺️', gradient: 'from-accent-emerald to-accent-cyan' },
        { id: 'plan', label: 'Plan Adventure', icon: Plane, emoji: '✈️', gradient: 'from-accent-purple to-accent-pink' },
    ];

    const quickTemplates = [
        { text: "Best cafes in Paris", icon: Coffee, emoji: '☕' },
        { text: "Tokyo weather forecast", icon: Cloud, emoji: '🌸' },
        { text: "Things to do in Rome", icon: Building2, emoji: '🏛️' },
        { text: "Restaurants in Bangkok", icon: Utensils, emoji: '🍜' },
    ];

    return (
        <div className="space-y-4">
            {/* Main Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
                {actions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                        <button
                            key={action.id}
                            onClick={() => onAction(action.id)}
                            disabled={disabled}
                            className="quick-action group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                            <div className="relative flex items-center gap-2">
                                <span className="text-lg">{action.emoji}</span>
                                <IconComponent className="w-4 h-4 text-dark-400 group-hover:text-white transition-colors" />
                                <span className="font-medium text-sm">{action.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Quick Templates */}
            {/* <div className="border-t border-white/10 pt-4">
                <div className="text-center mb-3">
                    <span className="text-dark-400 text-sm font-medium">✨ Try these popular queries</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                    {quickTemplates.map((template, index) => {
                        const IconComponent = template.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => onAction('custom', template.text)}
                                disabled={disabled}
                                className="glass rounded-lg px-3 py-2 text-xs text-dark-300 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 animate-fade-in"
                                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                            >
                                <span>{template.emoji}</span>
                                <IconComponent className="w-3 h-3" />
                                <span>{template.text}</span>
                            </button>
                        );
                    })}
                </div>
            </div> */}
        </div>
    );
};

export default QuickActions;