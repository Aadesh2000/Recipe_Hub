package com.recipehub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class RecipeHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(RecipeHubApplication.class, args);
    }
} 