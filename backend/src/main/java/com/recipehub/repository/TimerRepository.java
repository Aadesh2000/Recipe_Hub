package com.recipehub.repository;

import com.recipehub.model.Timer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimerRepository extends MongoRepository<Timer, String> {
    List<Timer> findByUserIdAndIsActiveTrue(String userId);
    List<Timer> findByIsActiveTrue();
} 