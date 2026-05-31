package com.edutask.progress;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {
    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/subjects")
    public List<ProgressSummary> getProgressBySubject() {
        return progressService.getProgressBySubject();
    }
}

/*
 * Design Pattern: MVC Controller Pattern
 * Responsibility: Provides progress tracking endpoints.
 * Best Practice: Keeps controllers lightweight.
 */