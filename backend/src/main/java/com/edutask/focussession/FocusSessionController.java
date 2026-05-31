package com.edutask.focussession;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/focus")
@CrossOrigin(origins = "*")
public class FocusSessionController {
    private final FocusSessionService focusSessionService;

    public FocusSessionController(FocusSessionService focusSessionService) {
        this.focusSessionService = focusSessionService;
    }

    @PostMapping("/complete")
    public FocusSession completeSession(@RequestBody FocusSession session) {
        return focusSessionService.completeSession(session);
    }

    @GetMapping
    public List<FocusSession> getAllSessions() {
        return focusSessionService.getAllSessions();
    }

    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        focusSessionService.deleteSession(id);
    }
}

/*
 * Design Pattern: MVC Controller Pattern
 * Responsibility: Exposes REST endpoints for focus sessions.
 * Best Practice: Delegates processing to FocusSessionService.
 */