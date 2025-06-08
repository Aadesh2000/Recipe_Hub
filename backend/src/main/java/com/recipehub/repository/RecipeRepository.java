package com.recipehub.repository;

import com.recipehub.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    List<Recipe> findByIsPublicTrue();
    List<Recipe> findByTagsContaining(String tag);
    List<Recipe> findByOwnerId(String ownerId);
    List<Recipe> findByCollaboratorsContaining(String userId);
    List<Recipe> findByOwnerIdOrCollaboratorsContaining(String ownerId, String userId);
    List<Recipe> findByTagsContainingAndIsPublicTrue(String tag);
} 