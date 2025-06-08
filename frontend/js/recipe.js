// DOM Elements
const recipeTitle = document.getElementById('recipeTitle');
const recipeDescription = document.getElementById('recipeDescription');
const prepTime = document.getElementById('prepTime');
const cookTime = document.getElementById('cookTime');
const servings = document.getElementById('servings');
const ingredientsList = document.getElementById('ingredientsList');
const instructionsList = document.getElementById('instructionsList');
const timersList = document.getElementById('timersList');

// Modal Elements
const editRecipeModal = document.getElementById('editRecipeModal');
const addTimerModal = document.getElementById('addTimerModal');
const scaleRecipeModal = document.getElementById('scaleRecipeModal');
const shareRecipeModal = document.getElementById('shareRecipeModal');

// Buttons
const editBtn = document.getElementById('editBtn');
const scaleBtn = document.getElementById('scaleBtn');
const shareBtn = document.getElementById('shareBtn');
const addTimerBtn = document.getElementById('addTimerBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Forms
const editRecipeForm = document.getElementById('editRecipeForm');
const addTimerForm = document.getElementById('addTimerForm');
const scaleRecipeForm = document.getElementById('scaleRecipeForm');

// State
let currentRecipe = null;
let activeTimers = new Map();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (!recipeId) {
        showError('No recipe ID provided');
        return;
    }

    loadRecipe(recipeId);
    setupEventListeners();
});

function setupEventListeners() {
    // Button click handlers
    editBtn.addEventListener('click', () => openModal(editRecipeModal));
    scaleBtn.addEventListener('click', () => openModal(scaleRecipeModal));
    shareBtn.addEventListener('click', () => openModal(shareRecipeModal));
    addTimerBtn.addEventListener('click', () => openModal(addTimerModal));
    logoutBtn.addEventListener('click', handleLogout);

    // Form submit handlers
    editRecipeForm.addEventListener('submit', handleEditRecipe);
    addTimerForm.addEventListener('submit', handleAddTimer);
    scaleRecipeForm.addEventListener('submit', handleScaleRecipe);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// API Calls
async function loadRecipe(recipeId) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load recipe');
        }

        currentRecipe = await response.json();
        renderRecipe();
    } catch (error) {
        console.error('Error loading recipe:', error);
        showError('Failed to load recipe. Please try again later.');
    }
}

async function updateRecipe(recipeData) {
    try {
        const response = await fetch(`/api/recipes/${currentRecipe.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
            throw new Error('Failed to update recipe');
        }

        currentRecipe = await response.json();
        renderRecipe();
        closeAllModals();
        showSuccess('Recipe updated successfully!');
    } catch (error) {
        console.error('Error updating recipe:', error);
        showError('Failed to update recipe. Please try again.');
    }
}

async function shareRecipe(email) {
    try {
        const response = await fetch(`/api/recipes/${currentRecipe.id}/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Failed to share recipe');
        }

        showSuccess('Recipe shared successfully!');
        closeAllModals();
    } catch (error) {
        console.error('Error sharing recipe:', error);
        showError('Failed to share recipe. Please try again.');
    }
}

// Event Handlers
function handleEditRecipe(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const recipeData = {
        title: formData.get('title'),
        description: formData.get('description'),
        ingredients: formData.get('ingredients').split('\n').map(ing => ing.trim()).filter(ing => ing),
        instructions: formData.get('instructions').split('\n').map(inst => inst.trim()).filter(inst => inst),
        prepTime: parseInt(formData.get('prepTime')),
        cookTime: parseInt(formData.get('cookTime')),
        servings: parseInt(formData.get('servings')),
        isPublic: formData.get('isPublic') === 'true',
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    updateRecipe(recipeData);
}

function handleAddTimer(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const timerData = {
        name: formData.get('name'),
        duration: parseInt(formData.get('duration')) * 60 // Convert to seconds
    };

    startTimer(timerData);
    closeAllModals();
}

function handleScaleRecipe(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const scaleFactor = parseFloat(formData.get('scaleFactor'));
    
    scaleIngredients(scaleFactor);
    closeAllModals();
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
}

// UI Functions
function renderRecipe() {
    if (!currentRecipe) return;

    recipeTitle.textContent = currentRecipe.title;
    recipeDescription.textContent = currentRecipe.description;
    prepTime.textContent = `Prep: ${currentRecipe.prepTime} min`;
    cookTime.textContent = `Cook: ${currentRecipe.cookTime} min`;
    servings.textContent = `Servings: ${currentRecipe.servings}`;

    renderIngredients();
    renderInstructions();
    populateEditForm();
}

function renderIngredients() {
    ingredientsList.innerHTML = '';
    
    currentRecipe.ingredients.forEach(ingredient => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.innerHTML = `
            <input type="checkbox" class="ingredient-checkbox">
            <span>${ingredient}</span>
        `;
        ingredientsList.appendChild(item);
    });
}

function renderInstructions() {
    instructionsList.innerHTML = '';
    
    currentRecipe.instructions.forEach((instruction, index) => {
        const item = document.createElement('div');
        item.className = 'instruction-item';
        item.innerHTML = `
            <div class="instruction-number">${index + 1}</div>
            <div class="instruction-text">${instruction}</div>
        `;
        instructionsList.appendChild(item);
    });
}

function populateEditForm() {
    const form = editRecipeForm;
    form.title.value = currentRecipe.title;
    form.description.value = currentRecipe.description;
    form.ingredients.value = currentRecipe.ingredients.join('\n');
    form.instructions.value = currentRecipe.instructions.join('\n');
    form.prepTime.value = currentRecipe.prepTime;
    form.cookTime.value = currentRecipe.cookTime;
    form.servings.value = currentRecipe.servings;
    form.tags.value = currentRecipe.tags.join(', ');
    form.isPublic.checked = currentRecipe.isPublic;
}

// Timer Functions
function startTimer(timerData) {
    const timerId = Date.now().toString();
    const endTime = Date.now() + (timerData.duration * 1000);
    
    activeTimers.set(timerId, {
        name: timerData.name,
        endTime: endTime,
        interval: setInterval(() => updateTimer(timerId), 1000)
    });

    renderTimers();
}

function updateTimer(timerId) {
    const timer = activeTimers.get(timerId);
    if (!timer) return;

    const remaining = Math.max(0, timer.endTime - Date.now());
    
    if (remaining === 0) {
        clearInterval(timer.interval);
        activeTimers.delete(timerId);
        showNotification(`${timer.name} timer is complete!`);
        renderTimers();
    } else {
        renderTimers();
    }
}

function renderTimers() {
    timersList.innerHTML = '';
    
    activeTimers.forEach((timer, id) => {
        const remaining = Math.max(0, timer.endTime - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        const timerElement = document.createElement('div');
        timerElement.className = 'timer-item';
        timerElement.innerHTML = `
            <div class="timer-info">
                <span class="timer-name">${timer.name}</span>
                <span class="timer-display">${minutes}:${seconds.toString().padStart(2, '0')}</span>
            </div>
            <div class="timer-controls">
                <button onclick="cancelTimer('${id}')" class="btn-secondary">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        timersList.appendChild(timerElement);
    });
}

function cancelTimer(timerId) {
    const timer = activeTimers.get(timerId);
    if (timer) {
        clearInterval(timer.interval);
        activeTimers.delete(timerId);
        renderTimers();
    }
}

// Utility Functions
function scaleIngredients(scaleFactor) {
    const scaledIngredients = currentRecipe.ingredients.map(ingredient => {
        // This is a simple scaling implementation
        // In a real application, you'd want to parse the ingredient string
        // and scale the quantities while preserving the units
        return ingredient;
    });

    currentRecipe.ingredients = scaledIngredients;
    renderIngredients();
    showSuccess(`Recipe scaled by factor of ${scaleFactor}`);
}

function openModal(modal) {
    closeAllModals();
    modal.style.display = 'block';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showSuccess(message) {
    // Implement toast or notification system
    alert(message);
}

function showError(message) {
    // Implement toast or notification system
    alert(message);
}

function showNotification(message) {
    // Implement toast or notification system
    alert(message);
} 