// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        let jsonMessage;
        try {
            jsonMessage = JSON.parse(message); // Parse incoming JSON message
        } catch (error) {
            console.error('Invalid JSON received:', message);
            return;
        }

        const response = {
            type: 'response',
            originalMessage: jsonMessage,
            timestamp: new Date().toISOString(),
        };

        const responseString = JSON.stringify(response); // Convert object to JSON string

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(responseString);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');