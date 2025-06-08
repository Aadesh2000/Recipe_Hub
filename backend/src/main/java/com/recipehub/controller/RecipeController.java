package com.recipehub.controller;

import com.recipehub.model.Recipe;
import com.recipehub.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.createRecipe(recipe, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable String id, @RequestBody Recipe recipe, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, recipe, userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipe(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.getRecipe(id, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.getAllRecipes(userDetails.getUsername()));
    }

    @GetMapping("/public")
    public ResponseEntity<List<Recipe>> getPublicRecipes() {
        return ResponseEntity.ok(recipeService.getPublicRecipes());
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Recipe>> getRecipesByTag(@PathVariable String tag) {
        return ResponseEntity.ok(recipeService.getRecipesByTag(tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        recipeService.deleteRecipe(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/collaborators/{userId}")
    public ResponseEntity<Recipe> addCollaborator(@PathVariable String id, @PathVariable String userId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.addCollaborator(id, userId, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}/collaborators/{userId}")
    public ResponseEntity<Recipe> removeCollaborator(@PathVariable String id, @PathVariable String userId, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.removeCollaborator(id, userId, userDetails.getUsername()));
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<Recipe> syncRecipe(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.syncRecipe(id, userDetails.getUsername()));
    }
} 