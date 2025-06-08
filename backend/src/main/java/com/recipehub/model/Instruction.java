package com.recipehub.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "instructions")
public class Instruction {
    @Id
    private String id;
    private String description;
    private Integer timerMinutes;
} 