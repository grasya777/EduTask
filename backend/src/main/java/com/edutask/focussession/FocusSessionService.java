package com.edutask.focussession;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FocusSessionService {
    private final FocusSessionRepository focusSessionRepository;

    public FocusSessionService(FocusSessionRepository focusSessionRepository) {
        this.focusSessionRepository = focusSessionRepository;
    }

    public FocusSession completeSession(FocusSession session) {
        session.setCompletedAt(LocalDateTime.now());
        return focusSessionRepository.save(session);
    }

    public List<FocusSession> getAllSessions() {
        return focusSessionRepository.findAll();
    }

    public void deleteSession(Long id) {
        focusSessionRepository.deleteById(id);
    }
}

/*
 * Design Pattern: Service Layer Pattern
 * Responsibility: Processes focus session business logic.
 * OOP Principle: Single Responsibility Principle (SRP).
 */