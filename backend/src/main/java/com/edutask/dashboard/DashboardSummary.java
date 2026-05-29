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