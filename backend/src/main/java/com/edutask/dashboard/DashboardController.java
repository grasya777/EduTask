package com.edutask.dashboard;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummary getSummary() {
        return dashboardService.getDashboardSummary();
    }
}

/*
 * Design Pattern: MVC Controller Pattern
 * Responsibility: Handles HTTP requests related to dashboard data.
 * Best Practice: Thin Controller - delegates business logic to DashboardService.
 * OOP Principle: Single Responsibility Principle (SRP).
 */