package com.recipehub.service;

import com.recipehub.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User registerUser(User user);
    User findByEmail(String email);
    User findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    User updateUser(User user);
    void deleteUser(String id);
    User findById(String id);
} 