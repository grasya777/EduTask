package com.edutask.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

/*
 * Design Pattern: Repository Pattern
 * Responsibility: Handles database operations for User entities.
 */