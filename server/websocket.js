const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const sessions = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.pathname.split('/').pop();
  
  console.log(`Client connected to session: ${sessionId}`);
  
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new Set());
  }
  
  sessions.get(sessionId).add(ws);
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`Received message for session ${sessionId}:`, message.type);
      
      // Broadcast to all clients in the same session
      const sessionClients = sessions.get(sessionId);
      if (sessionClients) {
        sessionClients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log(`Client disconnected from session: ${sessionId}`);
    const sessionClients = sessions.get(sessionId);
    if (sessionClients) {
      sessionClients.delete(ws);
      if (sessionClients.size === 0) {
        sessions.delete(sessionId);
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.WS_PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Access from network: ws://[YOUR_IP]:${PORT}`);
});

module.exports = { wss, server };