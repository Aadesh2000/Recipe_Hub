class CollaborationSystem {
    constructor() {
        this.socket = null;
        this.recipeId = null;
        this.userId = null;
        this.collaborators = new Map();
        this.changeQueue = [];
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }

    connect(recipeId, userId) {
        this.recipeId = recipeId;
        this.userId = userId;
        
        // Create WebSocket connection
        this.socket = new WebSocket(`ws://${window.location.host}/ws/recipes/${recipeId}`);
        
        this.socket.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.sendAuth();
            this.processChangeQueue();
            notifications.success('Connected to collaboration server');
        };
        
        this.socket.onclose = () => {
            this.isConnected = false;
            this.handleDisconnect();
        };
        
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            notifications.error('Connection error. Attempting to reconnect...');
        };
        
        this.socket.onmessage = (event) => {
            this.handleMessage(JSON.parse(event.data));
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
        }
    }

    sendAuth() {
        this.send({
            type: 'auth',
            userId: this.userId,
            token: localStorage.getItem('token')
        });
    }

    sendChange(change) {
        if (!this.isConnected) {
            this.changeQueue.push(change);
            return;
        }

        this.send({
            type: 'change',
            userId: this.userId,
            recipeId: this.recipeId,
            change: change,
            timestamp: Date.now()
        });
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    handleMessage(message) {
        switch (message.type) {
            case 'auth_success':
                this.handleAuthSuccess(message);
                break;
            case 'auth_error':
                this.handleAuthError(message);
                break;
            case 'collaborator_joined':
                this.handleCollaboratorJoined(message);
                break;
            case 'collaborator_left':
                this.handleCollaboratorLeft(message);
                break;
            case 'change':
                this.handleChange(message);
                break;
            case 'sync':
                this.handleSync(message);
                break;
            default:
                console.warn('Unknown message type:', message.type);
        }
    }

    handleAuthSuccess(message) {
        this.collaborators = new Map(message.collaborators);
        this.updateCollaboratorList();
        notifications.success('Successfully connected to collaboration');
    }

    handleAuthError(message) {
        notifications.error(message.error);
        this.disconnect();
    }

    handleCollaboratorJoined(message) {
        this.collaborators.set(message.userId, message.user);
        this.updateCollaboratorList();
        notifications.info(`${message.user.name} joined the recipe`);
    }

    handleCollaboratorLeft(message) {
        this.collaborators.delete(message.userId);
        this.updateCollaboratorList();
        notifications.info(`${message.user.name} left the recipe`);
    }

    handleChange(message) {
        if (message.userId === this.userId) return;

        // Apply the change to the recipe
        this.applyChange(message.change);
        
        // Show who made the change
        const user = this.collaborators.get(message.userId);
        if (user) {
            notifications.info(`${user.name} made changes to the recipe`);
        }
    }

    handleSync(message) {
        // Apply all changes from the sync message
        message.changes.forEach(change => {
            this.applyChange(change);
        });
        
        notifications.info('Recipe synchronized with server');
    }

    handleDisconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            notifications.warning(`Connection lost. Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect(this.recipeId, this.userId);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            notifications.error('Failed to reconnect. Please refresh the page.');
        }
    }

    processChangeQueue() {
        while (this.changeQueue.length > 0) {
            const change = this.changeQueue.shift();
            this.sendChange(change);
        }
    }

    updateCollaboratorList() {
        const container = document.getElementById('collaborators-list');
        if (!container) return;

        container.innerHTML = '';
        this.collaborators.forEach((user, userId) => {
            const element = document.createElement('div');
            element.className = 'collaborator-item';
            element.innerHTML = `
                <img src="${user.avatar || 'default-avatar.png'}" alt="${user.name}" class="collaborator-avatar">
                <span class="collaborator-name">${user.name}</span>
                ${userId === this.userId ? '<span class="collaborator-you">(You)</span>' : ''}
            `;
            container.appendChild(element);
        });
    }

    applyChange(change) {
        // This method should be implemented by the recipe page
        // to handle different types of changes
        if (typeof window.handleRecipeChange === 'function') {
            window.handleRecipeChange(change);
        }
    }

    // Change tracking methods
    trackTitleChange(newTitle) {
        this.sendChange({
            type: 'title',
            value: newTitle
        });
    }

    trackDescriptionChange(newDescription) {
        this.sendChange({
            type: 'description',
            value: newDescription
        });
    }

    trackIngredientChange(index, newValue) {
        this.sendChange({
            type: 'ingredient',
            index: index,
            value: newValue
        });
    }

    trackInstructionChange(index, newValue) {
        this.sendChange({
            type: 'instruction',
            index: index,
            value: newValue
        });
    }

    trackTimeChange(type, newValue) {
        this.sendChange({
            type: 'time',
            timeType: type,
            value: newValue
        });
    }

    trackServingsChange(newValue) {
        this.sendChange({
            type: 'servings',
            value: newValue
        });
    }

    trackTagChange(newTags) {
        this.sendChange({
            type: 'tags',
            value: newTags
        });
    }
}

// Create singleton instance
const collaboration = new CollaborationSystem();
export default collaboration; 