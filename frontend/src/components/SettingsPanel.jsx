import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Settings, Globe, Check, Sparkles, X } from 'lucide-react';

const SettingsPanel = ({ onSettingsChange, currentSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const buttonRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English Names', flag: '🇺🇸', desc: 'International standard' },
        { code: 'local', name: 'Local Names', flag: '🌍', desc: 'Authentic local names' },
        { code: 'both', name: 'Smart Mix', flag: '✨', desc: 'Best of both worlds' }
    ];

    // Handle clicks outside the panel
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen &&
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when panel is open and force stacking context
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'relative';
            document.body.style.zIndex = '1';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.zIndex = 'unset';
        };
    }, [isOpen]);

    const handleLanguageChange = (langCode) => {
        onSettingsChange({ ...currentSettings, language: langCode });
        setIsOpen(false);
    };

    const SettingsModal = () => (
        <div className="fixed inset-0 z-[99999]" style={{ zIndex: 999999 }}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-lg"
                onClick={() => setIsOpen(false)}
            />

            {/* Settings Panel - Centered */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div
                    ref={panelRef}
                    className="relative w-full max-w-md animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        transform: 'translateZ(0)'
                    }}
                >
                    <div className="settings-panel">
                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Preferences</h3>
                                    <p className="text-dark-400 text-sm">Customize your experience</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                                className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:rotate-90 hover:scale-110"
                            >
                                <X className="w-5 h-5 text-dark-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="w-5 h-5 text-accent-cyan" />
                                <span className="font-semibold text-white">Language Preference</span>
                            </div>

                            <div className="space-y-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLanguageChange(lang.code);
                                        }}
                                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${currentSettings.language === lang.code
                                                ? 'bg-gradient-primary text-white shadow-lg'
                                                : 'glass hover:bg-white/10 text-gray-200 border border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{lang.flag}</span>
                                                <div>
                                                    <div className="font-semibold">{lang.name}</div>
                                                    <div className={`text-xs ${currentSettings.language === lang.code
                                                            ? 'text-white/70'
                                                            : 'text-dark-400'
                                                        }`}>
                                                        {lang.desc}
                                                    </div>
                                                </div>
                                            </div>
                                            {currentSettings.language === lang.code && (
                                                <Check className="w-5 h-5 text-white animate-pulse" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 border-t border-white/10 bg-white/5 rounded-b-2xl">
                            <div className="text-xs text-dark-400 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></span>
                                    <span><strong>English:</strong> International attraction names</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                    <span><strong>Local:</strong> Authentic regional names</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                    <span><strong>Smart Mix:</strong> English preferred + local context</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className="btn btn-secondary flex items-center gap-2 group"
                >
                    <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="font-medium">Settings</span>
                </button>
            </div>

            {/* Render modal using portal to document.body */}
            {isOpen && createPortal(<SettingsModal />, document.body)}
        </>
    );
};

export default SettingsPanel;