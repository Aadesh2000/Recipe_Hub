package com.recipehub.service;

import com.recipehub.model.Recipe;
import com.recipehub.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    public Recipe createRecipe(Recipe recipe, String userId) {
        recipe.setOwnerId(userId);
        recipe.setCreatedAt(new Date());
        recipe.setUpdatedAt(new Date());
        return recipeRepository.save(recipe);
    }

    public Recipe updateRecipe(String id, Recipe recipeDetails, String userId) {
        Recipe recipe = getRecipe(id, userId);
        recipe.setTitle(recipeDetails.getTitle());
        recipe.setDescription(recipeDetails.getDescription());
        recipe.setIngredients(recipeDetails.getIngredients());
        recipe.setInstructions(recipeDetails.getInstructions());
        recipe.setTags(recipeDetails.getTags());
        recipe.setPublic(recipeDetails.isPublic());
        recipe.setUpdatedAt(new Date());
        return recipeRepository.save(recipe);
    }

    public Recipe getRecipe(String id, String userId) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        if (!recipe.isPublic() && !recipe.getOwnerId().equals(userId) && !recipe.getCollaborators().contains(userId)) {
            throw new RuntimeException("Not authorized to access this recipe");
        }
        
        return recipe;
    }

    public List<Recipe> getAllRecipes(String userId) {
        List<Recipe> ownedRecipes = recipeRepository.findByOwnerId(userId);
        List<Recipe> collaboratedRecipes = recipeRepository.findByCollaboratorsContaining(userId);
        ownedRecipes.addAll(collaboratedRecipes);
        return ownedRecipes;
    }

    public List<Recipe> getPublicRecipes() {
        return recipeRepository.findByIsPublicTrue();
    }

    public List<Recipe> getRecipesByTag(String tag) {
        return recipeRepository.findByTagsContaining(tag);
    }

    public void deleteRecipe(String id, String userId) {
        Recipe recipe = getRecipe(id, userId);
        if (!recipe.getOwnerId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this recipe");
        }
        recipeRepository.deleteById(id);
    }

    public Recipe addCollaborator(String id, String userId, String currentUserId) {
        Recipe recipe = getRecipe(id, currentUserId);
        if (!recipe.getOwnerId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to add collaborators");
        }
        if (!recipe.getCollaborators().contains(userId)) {
            recipe.getCollaborators().add(userId);
            recipe.setUpdatedAt(new Date());
            return recipeRepository.save(recipe);
        }
        return recipe;
    }

    public Recipe removeCollaborator(String id, String userId, String currentUserId) {
        Recipe recipe = getRecipe(id, currentUserId);
        if (!recipe.getOwnerId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to remove collaborators");
        }
        recipe.getCollaborators().remove(userId);
        recipe.setUpdatedAt(new Date());
        return recipeRepository.save(recipe);
    }

    public Recipe syncRecipe(String recipeId, String userId) {
        Recipe recipe = getRecipe(recipeId, userId);
        return recipe;
    }
} 