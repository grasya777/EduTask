package com.edutask.user;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

/*
 * Design Pattern: Service Layer Pattern
 * Responsibility: Contains user registration and login logic.
 * OOP Principle: Single Responsibility Principle (SRP).
 */
