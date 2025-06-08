package com.recipehub.controller;

import com.recipehub.model.CollaborationMessage;
import com.recipehub.service.CollaborationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CollaborationController {

    @Autowired
    private CollaborationService collaborationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/recipe/{recipeId}/join")
    public void handleJoin(@DestinationVariable String recipeId,
                          @Payload CollaborationMessage message,
                          SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getUser().getName();
        collaborationService.handleUserJoin(recipeId, userId, message);
        
        // Notify all users in the recipe room
        messagingTemplate.convertAndSend("/topic/recipe/" + recipeId, message);
    }

    @MessageMapping("/recipe/{recipeId}/leave")
    public void handleLeave(@DestinationVariable String recipeId,
                           @Payload CollaborationMessage message,
                           SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getUser().getName();
        collaborationService.handleUserLeave(recipeId, userId);
        
        // Notify all users in the recipe room
        messagingTemplate.convertAndSend("/topic/recipe/" + recipeId, message);
    }

    @MessageMapping("/recipe/{recipeId}/change")
    public void handleChange(@DestinationVariable String recipeId,
                            @Payload CollaborationMessage message,
                            SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getUser().getName();
        
        // Process the change and handle conflicts if any
        CollaborationMessage processedMessage = collaborationService.handleRecipeChange(recipeId, userId, message);
        
        // Broadcast the processed change to all users
        messagingTemplate.convertAndSend("/topic/recipe/" + recipeId, processedMessage);
    }

    @MessageMapping("/recipe/{recipeId}/sync")
    public void handleSync(@DestinationVariable String recipeId,
                          @Payload CollaborationMessage message,
                          SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getUser().getName();
        
        // Get the latest state of the recipe
        CollaborationMessage syncMessage = collaborationService.getRecipeState(recipeId);
        
        // Send the sync message to the requesting user
        messagingTemplate.convertAndSendToUser(
            userId,
            "/queue/recipe/" + recipeId + "/sync",
            syncMessage
        );
    }
} 