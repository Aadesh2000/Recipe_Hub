// DOM Elements
const recipeGrid = document.querySelector('.recipe-grid');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const createRecipeBtn = document.getElementById('createRecipeBtn');
const createRecipeModal = document.getElementById('createRecipeModal');
const closeModalBtn = document.querySelector('.close');
const createRecipeForm = document.getElementById('createRecipeForm');

// State
let recipes = [];
let filteredRecipes = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    filterSelect.addEventListener('change', handleFilter);
    createRecipeBtn.addEventListener('click', openCreateRecipeModal);
    closeModalBtn.addEventListener('click', closeCreateRecipeModal);
    createRecipeForm.addEventListener('submit', handleCreateRecipe);
}

// API Calls
async function loadRecipes() {
    try {
        const response = await fetch('/api/recipes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load recipes');
        }

        recipes = await response.json();
        filteredRecipes = [...recipes];
        renderRecipes();
    } catch (error) {
        console.error('Error loading recipes:', error);
        showError('Failed to load recipes. Please try again later.');
    }
}

async function createRecipe(recipeData) {
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
            throw new Error('Failed to create recipe');
        }

        const newRecipe = await response.json();
        recipes.push(newRecipe);
        filteredRecipes = [...recipes];
        renderRecipes();
        closeCreateRecipeModal();
        showSuccess('Recipe created successfully!');
    } catch (error) {
        console.error('Error creating recipe:', error);
        showError('Failed to create recipe. Please try again.');
    }
}

async function deleteRecipe(recipeId) {
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }

    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete recipe');
        }

        recipes = recipes.filter(recipe => recipe.id !== recipeId);
        filteredRecipes = [...recipes];
        renderRecipes();
        showSuccess('Recipe deleted successfully!');
    } catch (error) {
        console.error('Error deleting recipe:', error);
        showError('Failed to delete recipe. Please try again.');
    }
}

// Event Handlers
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm)
    );
    renderRecipes();
}

function handleFilter(event) {
    const filterValue = event.target.value;
    
    switch (filterValue) {
        case 'all':
            filteredRecipes = [...recipes];
            break;
        case 'public':
            filteredRecipes = recipes.filter(recipe => recipe.isPublic);
            break;
        case 'private':
            filteredRecipes = recipes.filter(recipe => !recipe.isPublic);
            break;
        default:
            filteredRecipes = [...recipes];
    }
    
    renderRecipes();
}

function handleCreateRecipe(event) {
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

    createRecipe(recipeData);
}

// UI Functions
function renderRecipes() {
    recipeGrid.innerHTML = '';
    
    if (filteredRecipes.length === 0) {
        recipeGrid.innerHTML = '<p class="no-recipes">No recipes found</p>';
        return;
    }

    filteredRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipeGrid.appendChild(recipeCard);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    card.innerHTML = `
        <div class="recipe-card-header">
            <h3 class="recipe-card-title">${recipe.title}</h3>
        </div>
        <div class="recipe-card-body">
            <p class="recipe-card-description">${recipe.description}</p>
            <div class="recipe-card-tags">
                ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="recipe-card-footer">
            <span>Prep: ${recipe.prepTime}min | Cook: ${recipe.cookTime}min</span>
            <div class="recipe-actions">
                <button onclick="viewRecipe('${recipe.id}')" class="btn-primary">View</button>
                <button onclick="deleteRecipe('${recipe.id}')" class="btn-danger">Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

function openCreateRecipeModal() {
    createRecipeModal.style.display = 'block';
}

function closeCreateRecipeModal() {
    createRecipeModal.style.display = 'none';
    createRecipeForm.reset();
}

function showSuccess(message) {
    // Implement toast or notification system
    alert(message);
}

function showError(message) {
    // Implement toast or notification system
    alert(message);
}

// Navigation
function viewRecipe(recipeId) {
    window.location.href = `/recipe.html?id=${recipeId}`;
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === createRecipeModal) {
        closeCreateRecipeModal();
    }
} 