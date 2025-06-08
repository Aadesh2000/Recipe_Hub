// Main application functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Check if we're on the dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
    // Check if we're on the recipe edit page
    else if (window.location.pathname.includes('recipe-edit.html')) {
        initializeRecipeEditor();
    }
    // Check if we're on the recipe view page
    else if (window.location.pathname.includes('recipe-view.html')) {
        initializeRecipeViewer();
    }
}

// Initialize dashboard functionality
function initializeDashboard() {
    // TODO: Implement dashboard initialization
    console.log('Initializing dashboard');
}

// Initialize recipe editor
function initializeRecipeEditor() {
    // TODO: Implement recipe editor initialization
    console.log('Initializing recipe editor');
}

// Initialize recipe viewer
function initializeRecipeViewer() {
    // TODO: Implement recipe viewer initialization
    console.log('Initializing recipe viewer');
}

// Timer functionality
class Timer {
    constructor(duration, onComplete) {
        this.duration = duration;
        this.remainingTime = duration;
        this.onComplete = onComplete;
        this.timerId = null;
    }

    start() {
        if (this.timerId) return;
        
        this.timerId = setInterval(() => {
            this.remainingTime--;
            
            if (this.remainingTime <= 0) {
                this.stop();
                if (this.onComplete) this.onComplete();
            }
        }, 1000);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    pause() {
        this.stop();
    }

    reset() {
        this.stop();
        this.remainingTime = this.duration;
    }

    getFormattedTime() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Recipe scaling functionality
class RecipeScaler {
    constructor(baseServings) {
        this.baseServings = baseServings;
    }

    scaleIngredient(quantity, unit, newServings) {
        const scaleFactor = newServings / this.baseServings;
        const newQuantity = quantity * scaleFactor;
        
        // Round to 2 decimal places
        return {
            quantity: Math.round(newQuantity * 100) / 100,
            unit: unit
        };
    }

    scaleAllIngredients(ingredients, newServings) {
        return ingredients.map(ingredient => ({
            ...ingredient,
            ...this.scaleIngredient(ingredient.quantity, ingredient.unit, newServings)
        }));
    }
}

// Utility functions
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functionality for use in other modules
window.RecipeHub = {
    Timer,
    RecipeScaler,
    formatTime,
    debounce
}; 