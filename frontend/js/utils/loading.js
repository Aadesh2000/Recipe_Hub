class LoadingSpinner {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create spinner container if it doesn't exist
        if (!document.getElementById('loading-container')) {
            this.container = document.createElement('div');
            this.container.id = 'loading-container';
            this.container.className = 'loading-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('loading-container');
        }
    }

    show(message = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner"></div>
            <div class="spinner-message">${message}</div>
        `;
        
        this.container.appendChild(spinner);
        this.container.classList.add('active');
        
        return spinner;
    }

    hide() {
        this.container.classList.remove('active');
        this.container.innerHTML = '';
    }

    // Show loading state for a specific element
    showForElement(element, message = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'element-loading-spinner';
        spinner.innerHTML = `
            <div class="spinner"></div>
            <div class="spinner-message">${message}</div>
        `;
        
        element.style.position = 'relative';
        element.appendChild(spinner);
        element.classList.add('loading');
        
        return spinner;
    }

    hideFromElement(element) {
        const spinner = element.querySelector('.element-loading-spinner');
        if (spinner) {
            spinner.remove();
        }
        element.classList.remove('loading');
    }

    // Show loading state for a button
    showForButton(button, message = 'Loading...') {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `
            <div class="button-spinner"></div>
            <span>${message}</span>
        `;
        button.classList.add('loading');
        
        return {
            hide: () => {
                button.disabled = false;
                button.innerHTML = originalText;
                button.classList.remove('loading');
            }
        };
    }
}

// Create singleton instance
const loading = new LoadingSpinner();
export default loading; 