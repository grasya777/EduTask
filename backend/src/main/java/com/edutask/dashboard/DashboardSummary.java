package com.edutask.dashboard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummary {

    private long pendingTasks;
    private long completedTasks;
    private long totalTasks;
    private double completionPercentage;
}

/*
 * Design Pattern: DTO (Data Transfer Object)
 * Responsibility: Transfers dashboard statistics between layers.
 * OOP Concept: Encapsulation using private fields with getters/setters.
 * Best Practice: Prevents exposing unnecessary entity details.
 */