package com.recipehub.service;

import com.recipehub.model.CollaborationMessage;
import java.util.Set;

public interface CollaborationService {
    
    /**
     * Handle a user joining a recipe collaboration session
     * @param recipeId The ID of the recipe being collaborated on
     * @param userId The ID of the user joining
     * @param message The join message containing user information
     */
    void handleUserJoin(String recipeId, String userId, CollaborationMessage message);

    /**
     * Handle a user leaving a recipe collaboration session
     * @param recipeId The ID of the recipe being collaborated on
     * @param userId The ID of the user leaving
     */
    void handleUserLeave(String recipeId, String userId);

    /**
     * Handle a recipe change from a collaborator
     * @param recipeId The ID of the recipe being collaborated on
     * @param userId The ID of the user making the change
     * @param message The change message containing the modifications
     * @return The processed message after conflict resolution
     */
    CollaborationMessage handleRecipeChange(String recipeId, String userId, CollaborationMessage message);

    /**
     * Get the current state of a recipe for synchronization
     * @param recipeId The ID of the recipe to get the state for
     * @return A message containing the current recipe state
     */
    CollaborationMessage getRecipeState(String recipeId);

    /**
     * Get the set of active collaborators for a recipe
     * @param recipeId The ID of the recipe
     * @return Set of user IDs who are currently collaborating
     */
    Set<String> getActiveCollaborators(String recipeId);

    /**
     * Check if a user has permission to collaborate on a recipe
     * @param recipeId The ID of the recipe
     * @param userId The ID of the user to check
     * @return true if the user has permission, false otherwise
     */
    boolean hasCollaborationPermission(String recipeId, String userId);
} 