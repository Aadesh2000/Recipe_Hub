class WebSocketManager {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.messageHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // Start with 1 second delay
    }

    connect(token) {
        const socket = new SockJS('/ws');
        this.stompClient = Stomp.over(socket);

        // Add authorization header
        this.stompClient.connectHeaders = {
            'Authorization': `Bearer ${token}`
        };

        this.stompClient.connect(
            this.connectHeaders,
            this.onConnect.bind(this),
            this.onError.bind(this)
        );
    }

    onConnect() {
        console.log('WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;

        // Resubscribe to all topics
        this.subscriptions.forEach((subscription, topic) => {
            this.subscribe(topic);
        });
    }

    onError(error) {
        console.error('WebSocket error:', error);
        this.connected = false;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.reconnectDelay *= 2; // Exponential backoff
            setTimeout(() => this.connect(), this.reconnectDelay);
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
            this.connected = false;
            this.subscriptions.clear();
        }
    }

    subscribe(topic, handler) {
        if (!this.connected) {
            console.warn('WebSocket not connected. Subscription will be attempted when connected.');
            this.subscriptions.set(topic, handler);
            return;
        }

        const subscription = this.stompClient.subscribe(topic, (message) => {
            const data = JSON.parse(message.body);
            if (handler) {
                handler(data);
            }
        });

        this.subscriptions.set(topic, subscription);
    }

    unsubscribe(topic) {
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    send(destination, message) {
        if (!this.connected) {
            console.error('WebSocket not connected');
            return;
        }

        this.stompClient.send(destination, {}, JSON.stringify(message));
    }

    // Recipe collaboration specific methods
    joinRecipe(recipeId, userId, userName) {
        const message = {
            type: 'JOIN',
            userId: userId,
            userName: userName,
            recipeId: recipeId,
            timestamp: new Date().toISOString()
        };

        this.send(`/app/recipe/${recipeId}/join`, message);
    }

    leaveRecipe(recipeId, userId, userName) {
        const message = {
            type: 'LEAVE',
            userId: userId,
            userName: userName,
            recipeId: recipeId,
            timestamp: new Date().toISOString()
        };

        this.send(`/app/recipe/${recipeId}/leave`, message);
    }

    sendRecipeChange(recipeId, userId, change) {
        const message = {
            type: 'CHANGE',
            userId: userId,
            recipeId: recipeId,
            content: change,
            timestamp: new Date().toISOString()
        };

        this.send(`/app/recipe/${recipeId}/change`, message);
    }

    requestRecipeSync(recipeId) {
        const message = {
            type: 'SYNC',
            recipeId: recipeId,
            timestamp: new Date().toISOString()
        };

        this.send(`/app/recipe/${recipeId}/sync`, message);
    }

    // Event handlers
    onRecipeChange(recipeId, handler) {
        this.subscribe(`/topic/recipe/${recipeId}`, handler);
    }

    onUserSync(recipeId, handler) {
        this.subscribe(`/user/queue/recipe/${recipeId}/sync`, handler);
    }
}

// Create a singleton instance
const websocketManager = new WebSocketManager();
export default websocketManager; 