package com.recipehub.service.impl;

import com.recipehub.model.CollaborationMessage;
import com.recipehub.model.Ingredient;
import com.recipehub.model.Instruction;
import com.recipehub.model.Recipe;
import com.recipehub.repository.RecipeRepository;
import com.recipehub.service.CollaborationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class CollaborationServiceImpl implements CollaborationService {

    @Autowired
    private RecipeRepository recipeRepository;

    // In-memory storage for active collaboration sessions
    private final Map<String, Set<String>> activeCollaborators = new ConcurrentHashMap<>();
    private final Map<String, Map<String, CollaborationMessage>> recipeChanges = new ConcurrentHashMap<>();

    @Override
    public void handleUserJoin(String recipeId, String userId, CollaborationMessage message) {
        activeCollaborators.computeIfAbsent(recipeId, k -> new HashSet<>()).add(userId);
        recipeChanges.computeIfAbsent(recipeId, k -> new ConcurrentHashMap<>());
    }

    @Override
    public void handleUserLeave(String recipeId, String userId) {
        Set<String> collaborators = activeCollaborators.get(recipeId);
        if (collaborators != null) {
            collaborators.remove(userId);
            if (collaborators.isEmpty()) {
                activeCollaborators.remove(recipeId);
                recipeChanges.remove(recipeId);
            }
        }
    }

    @Override
    public CollaborationMessage handleRecipeChange(String recipeId, String userId, CollaborationMessage message) {
        // Validate user has permission
        if (!hasCollaborationPermission(recipeId, userId)) {
            throw new SecurityException("User does not have permission to collaborate on this recipe");
        }

        // Generate a unique change ID
        String changeId = UUID.randomUUID().toString();
        message.setChangeId(changeId);

        // Store the change
        Map<String, CollaborationMessage> changes = recipeChanges.get(recipeId);
        if (changes != null) {
            changes.put(changeId, message);
        }

        // Update the recipe in the database
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new NoSuchElementException("Recipe not found"));

        // Apply the changes from the message content
        applyChangesToRecipe(recipe, message.getContent());
        recipeRepository.save(recipe);

        return message;
    }

    @Override
    public CollaborationMessage getRecipeState(String recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new NoSuchElementException("Recipe not found"));

        Map<String, Object> content = new HashMap<>();
        content.put("recipe", recipe);
        content.put("activeCollaborators", getActiveCollaborators(recipeId));

        return CollaborationMessage.builder()
                .type(CollaborationMessage.MessageType.SYNC)
                .recipeId(recipeId)
                .content(content)
                .build();
    }

    @Override
    public Set<String> getActiveCollaborators(String recipeId) {
        return activeCollaborators.getOrDefault(recipeId, Collections.emptySet());
    }

    @Override
    public boolean hasCollaborationPermission(String recipeId, String userId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new NoSuchElementException("Recipe not found"));

        return recipe.getOwnerId().equals(userId) || 
               recipe.getCollaborators().contains(userId);
    }

    private void applyChangesToRecipe(Recipe recipe, Map<String, Object> changes) {
        changes.forEach((key, value) -> {
            try {
                switch (key) {
                    case "title":
                        if (value != null) {
                            recipe.setTitle(value.toString());
                        }
                        break;
                    case "description":
                        if (value != null) {
                            recipe.setDescription(value.toString());
                        }
                        break;
                    case "ingredients":
                        if (value instanceof List<?>) {
                            List<?> rawList = (List<?>) value;
                            List<Ingredient> ingredients = rawList.stream()
                                .filter(item -> item != null)
                                .map(item -> {
                                    Ingredient ingredient = new Ingredient();
                                    ingredient.setName(item.toString());
                                    return ingredient;
                                })
                                .collect(Collectors.toList());
                            recipe.setIngredients(ingredients);
                        }
                        break;
                    case "instructions":
                        if (value instanceof List<?>) {
                            List<?> rawList = (List<?>) value;
                            List<Instruction> instructions = rawList.stream()
                                .filter(item -> item != null)
                                .map(item -> {
                                    Instruction instruction = new Instruction();
                                    instruction.setDescription(item.toString());
                                    return instruction;
                                })
                                .collect(Collectors.toList());
                            recipe.setInstructions(instructions);
                        }
                        break;
                    case "cookingTime":
                        if (value instanceof Number) {
                            recipe.setCookingTime(((Number) value).intValue());
                        }
                        break;
                    case "servings":
                        if (value instanceof Number) {
                            recipe.setServings(((Number) value).intValue());
                        }
                        break;
                    case "tags":
                        if (value instanceof List<?>) {
                            List<?> rawList = (List<?>) value;
                            List<String> tags = rawList.stream()
                                .filter(item -> item != null)
                                .map(Object::toString)
                                .collect(Collectors.toList());
                            recipe.setTags(tags);
                        }
                        break;
                    case "isPublic":
                        if (value instanceof Boolean) {
                            recipe.setPublic((Boolean) value);
                        }
                        break;
                    case "collaborators":
                        if (value instanceof List<?>) {
                            List<?> rawList = (List<?>) value;
                            List<String> collaborators = rawList.stream()
                                .filter(item -> item != null)
                                .map(Object::toString)
                                .collect(Collectors.toList());
                            recipe.setCollaborators(collaborators);
                        }
                        break;
                    default:
                        // Log unknown fields
                        break;
                }
            } catch (Exception e) {
                // Log the error but continue processing other fields
                System.err.println("Error processing field " + key + ": " + e.getMessage());
            }
        });
    }
} 