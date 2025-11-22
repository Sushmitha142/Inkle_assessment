const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
    constructor() {
        this.keepAliveInterval = null;
        this.startKeepAlive();
    }

    startKeepAlive() {
        // Ping backend every 10 minutes to keep it awake
        this.keepAliveInterval = setInterval(async () => {
            try {
                await this.healthCheck();
                console.log('Keep-alive ping sent');
            } catch (error) {
                console.log('Keep-alive ping failed:', error);
            }
        }, 10 * 60 * 1000); // 10 minutes
    }

    stopKeepAlive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
    }
    async sendQuery(message, settings = {}) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for queries
            
            const response = await fetch(`${API_BASE_URL}/api/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    preferences: settings
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - backend may be sleeping, please try again');
            }
            console.error('API request failed:', error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Health check successful:', data);
                return true;
            }
            return false;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Health check timeout - backend may be sleeping');
            } else {
                console.error('Health check failed:', error);
            }
            return false;
        }
    }
}

export const apiService = new ApiService();