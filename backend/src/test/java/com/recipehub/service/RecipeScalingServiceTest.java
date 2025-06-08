//package com.recipehub.service;
//
//import com.recipehub.model.Ingredient;
//import com.recipehub.model.Recipe;
//import com.recipehub.service.impl.RecipeScalingServiceImpl;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@ExtendWith(MockitoExtension.class)
//class RecipeScalingServiceTest {
//
//    @InjectMocks
//    private RecipeScalingServiceImpl recipeScalingService;
//
//    private Recipe recipe;
//
//    @BeforeEach
//    void setUp() {
//        recipe = new Recipe();
//        recipe.setId("1");
//        recipe.setTitle("Test Recipe");
//        recipe.setDescription("Test Description");
//        recipe.setServings(4);
//
//        List<Ingredient> ingredients = new ArrayList<>();
//
//        Ingredient ingredient1 = new Ingredient();
//        ingredient1.setName("Flour");
//        ingredient1.setQuantity(200);
//        ingredient1.setUnit("g");
//        ingredients.add(ingredient1);
//
//        Ingredient ingredient2 = new Ingredient();
//        ingredient2.setName("Milk");
//        ingredient2.setQuantity(500);
//        ingredient2.setUnit("ml");
//        ingredients.add(ingredient2);
//
//        recipe.setIngredients(ingredients);
//    }
//
//    @Test
//    void scaleRecipe_DoublesServings() {
//        Recipe scaledRecipe = recipeScalingService.scaleRecipe(recipe, 8);
//
//        assertEquals(8, scaledRecipe.getServings());
//        assertEquals(2, scaledRecipe.getIngredients().size());
//
//        Ingredient scaledFlour = scaledRecipe.getIngredients().get(0);
//        assertEquals("Flour", scaledFlour.getName());
//        assertEquals(400, scaledFlour.getQuantity());
//
//        Ingredient scaledMilk = scaledRecipe.getIngredients().get(1);
//        assertEquals("Milk", scaledMilk.getName());
//        assertEquals(1000, scaledMilk.getQuantity());
//    }
//
//    @Test
//    void convertUnit_ConvertsMlToTbsp() {
//        Map<String, Double> result = recipeScalingService.convertUnit("ml", 15);
//        assertEquals(1.0, result.get("quantity"), 0.01);
//        assertEquals(2.0, result.get("unit")); // tbsp
//    }
//
//    @Test
//    void roundQuantity_RoundsToNearestQuarter() {
//        assertEquals(0.25, recipeScalingService.roundQuantity(0.23), 0.01);
//        assertEquals(0.5, recipeScalingService.roundQuantity(0.4), 0.01);
//        assertEquals(1.0, recipeScalingService.roundQuantity(0.8), 0.01);
//    }
//}