package com.recipehub.service.impl;

import com.recipehub.model.Ingredient;
import com.recipehub.model.Recipe;
import com.recipehub.service.RecipeScalingService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RecipeScalingServiceImpl implements RecipeScalingService {

    private static final Map<String, Double> UNIT_CONVERSIONS = new HashMap<>();
    static {
        // Volume conversions (ml to other units)
        UNIT_CONVERSIONS.put("ml_to_tsp", 0.202884);
        UNIT_CONVERSIONS.put("ml_to_tbsp", 0.067628);
        UNIT_CONVERSIONS.put("ml_to_cup", 0.00422675);
        UNIT_CONVERSIONS.put("ml_to_oz", 0.033814);
        
        // Weight conversions (g to other units)
        UNIT_CONVERSIONS.put("g_to_oz", 0.035274);
        UNIT_CONVERSIONS.put("g_to_lb", 0.00220462);
    }

    @Override
    public Recipe scaleRecipe(Recipe recipe, int targetServings) {
        if (targetServings <= 0) {
            throw new IllegalArgumentException("Target servings must be greater than 0");
        }

        double scaleFactor = (double) targetServings / recipe.getServings();
        Recipe scaledRecipe = new Recipe();
        scaledRecipe.setId(recipe.getId());
        scaledRecipe.setTitle(recipe.getTitle());
        scaledRecipe.setDescription(recipe.getDescription());
        scaledRecipe.setServings(targetServings);
        scaledRecipe.setInstructions(recipe.getInstructions());
        scaledRecipe.setTags(recipe.getTags());
        scaledRecipe.setPublic(recipe.isPublic());
        scaledRecipe.setOwnerId(recipe.getOwnerId());
        scaledRecipe.setCollaborators(recipe.getCollaborators());

        // Scale ingredients
        recipe.getIngredients().forEach(ingredient -> {
            Ingredient scaledIngredient = new Ingredient();
            scaledIngredient.setName(ingredient.getName());
            
            double scaledQuantity = ingredient.getQuantity() * scaleFactor;
            Map<String, Double> converted = convertUnit(ingredient.getUnit(), scaledQuantity);
            
            scaledIngredient.setQuantity(roundQuantity(converted.get("quantity")));
            scaledIngredient.setUnit(converted.get("unit").toString());
            scaledRecipe.getIngredients().add(scaledIngredient);
        });

        return scaledRecipe;
    }

    @Override
    public Map<String, Double> convertUnit(String unit, double quantity) {
        Map<String, Double> result = new HashMap<>();
        String lowerUnit = unit.toLowerCase();

        // Handle volume conversions
        if (lowerUnit.equals("ml")) {
            if (quantity < 5) {
                result.put("quantity", quantity * UNIT_CONVERSIONS.get("ml_to_tsp"));
                result.put("unit", 1.0); // tsp
            } else if (quantity < 15) {
                result.put("quantity", quantity * UNIT_CONVERSIONS.get("ml_to_tbsp"));
                result.put("unit", 2.0); // tbsp
            } else if (quantity < 240) {
                result.put("quantity", quantity * UNIT_CONVERSIONS.get("ml_to_cup"));
                result.put("unit", 3.0); // cup
            } else {
                result.put("quantity", quantity * UNIT_CONVERSIONS.get("ml_to_oz"));
                result.put("unit", 4.0); // oz
            }
        }
        // Handle weight conversions
        else if (lowerUnit.equals("g")) {
            if (quantity < 28.35) {
                result.put("quantity", quantity * UNIT_CONVERSIONS.get("g_to_oz"));
                result.put("unit", 5.0); // oz
            } else {
                result.put("quantity", quantity * UNIT_CONVERSIONS.get("g_to_lb"));
                result.put("unit", 6.0); // lb
            }
        }
        // No conversion needed
        else {
            result.put("quantity", quantity);
            result.put("unit", 0.0); // original unit
        }

        return result;
    }

    @Override
    public double roundQuantity(double quantity) {
        if (quantity < 0.25) {
            return Math.round(quantity * 4) / 4.0; // Round to nearest 1/4
        } else if (quantity < 1) {
            return Math.round(quantity * 2) / 2.0; // Round to nearest 1/2
        } else {
            return Math.round(quantity); // Round to nearest whole number
        }
    }
} 