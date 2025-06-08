package com.recipehub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "collaboration_messages")
public class CollaborationMessage {
    @Id
    private String id;
    
    public enum MessageType {
        SYNC, UPDATE, JOIN, LEAVE
    }
    
    private MessageType type;
    private String recipeId;
    private String userId;
    private Map<String, Object> content;
    private String changeId;
    private Date timestamp;
} 