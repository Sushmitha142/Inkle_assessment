import React from 'react';
import { Bot, Sparkles, Zap } from 'lucide-react';

const LoadingIndicator = () => {
    return (
        <div className="flex justify-start">
            <div className="chat-bubble assistant animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center animate-glow">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-accent-amber animate-spin" />
                            <span className="text-gray-200 font-medium">AI is crafting magic...</span>
                            <Zap className="w-4 h-4 text-accent-cyan animate-pulse" />
                        </div>
                        <div className="loading-dots ml-2">
                            <div className="loading-dot bg-accent-purple"></div>
                            <div className="loading-dot bg-accent-pink"></div>
                            <div className="loading-dot bg-accent-cyan"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingIndicator;