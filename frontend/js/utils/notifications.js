class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notification-container');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Create icon based on type
        const icon = document.createElement('i');
        icon.className = this.getIconClass(type);
        
        // Create message element
        const messageElement = document.createElement('span');
        messageElement.textContent = message;
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => this.removeNotification(notification);
        
        // Assemble notification
        notification.appendChild(icon);
        notification.appendChild(messageElement);
        notification.appendChild(closeButton);
        
        // Add to container
        this.container.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }
        
        return notification;
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Remove from DOM after animation
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }

    getIconClass(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Create singleton instance
const notifications = new NotificationSystem();
export default notifications; 