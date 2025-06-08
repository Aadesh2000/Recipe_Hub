package com.recipehub.service;

import com.recipehub.model.Recipe;
import java.util.Map;

public interface RecipeScalingService {
    Recipe scaleRecipe(Recipe recipe, int targetServings);
    Map<String, Double> convertUnit(String unit, double quantity);
    double roundQuantity(double quantity);
} 