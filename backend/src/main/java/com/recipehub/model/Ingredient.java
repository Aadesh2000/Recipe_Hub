package com.recipehub.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "ingredients")
public class Ingredient {
    @Id
    private String id;
    private String name;
    private double quantity;
    private String unit;
    private double quantityPerServing;
} 