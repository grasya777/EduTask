package com.edutask.subject;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
}

/*
 * Design Pattern: Repository Pattern
 * Responsibility: Handles CRUD operations for Subject entities.
 */