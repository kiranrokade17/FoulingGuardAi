class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectInterval = 2000;

  connect(sessionId: string, onMessage: (data: any) => void) {
    // Always use production WebSocket URL
    const wsBaseUrl = import.meta.env.VITE_WEBSOCKET_URL || 'wss://foulingguard-ai.onrender.com';
    const wsUrl = `${wsBaseUrl}/${sessionId}`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected to session:', sessionId);
        this.reconnectAttempts = 0;
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect(sessionId, onMessage);
      };
      
      this.ws.onerror = (error) => {
        // Suppress browser extension errors
        if (error.toString().includes('message channel closed')) {
          return;
        }
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.fallbackToPolling(sessionId, onMessage);
    }
  }

  private attemptReconnect(sessionId: string, onMessage: (data: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... attempt ${this.reconnectAttempts}`);
        // Ensure previous connection is closed before reconnecting
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
        this.connect(sessionId, onMessage);
      }, this.reconnectInterval);
    } else {
      console.log('Max reconnect attempts reached, using localStorage fallback');
      this.fallbackToPolling(sessionId, onMessage);
    }
  }

  private fallbackToPolling(_sessionId: string, _onMessage: (data: any) => void) {
    console.log('WebSocket connection failed. Remote capture requires WebSocket server.');
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const messageStr = JSON.stringify(message);
        // Check message size (limit to 10MB)
        if (messageStr.length > 10 * 1024 * 1024) {
          console.error('Message too large for WebSocket');
          return;
        }
        this.ws.send(messageStr);
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket not connected - remote capture unavailable');
    }
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts; // Stop reconnection attempts
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();