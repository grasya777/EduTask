package com.edutask.focussession;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
}

/*
 * Design Pattern: Repository Pattern
 * Responsibility: Handles database access for FocusSession entities.
 * Best Practice: Separates persistence logic from business logic.
 */