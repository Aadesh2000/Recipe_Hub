package com.recipehub.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Document(collection = "timers")
public class Timer {
    @Id
    private String id;
    private String userId;
    private String recipeId;
    private String name;
    private int durationInSeconds;
    private Instant startTime;
    private Instant endTime;
    private Duration remainingTime;
    private String status; // RUNNING, PAUSED, COMPLETED
    private boolean isActive;
} 