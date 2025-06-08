package com.recipehub.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "recipes")
public class Recipe {
    @Id
    private String id;
    private String title;
    private String description;
    private List<Ingredient> ingredients = new ArrayList<>();
    private List<Instruction> instructions = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private String ownerId;
    private List<String> collaborators = new ArrayList<>();
    private boolean isPublic;
    private Date createdAt;
    private Date updatedAt;
    private Integer cookingTime;
    private Integer servings;
} 