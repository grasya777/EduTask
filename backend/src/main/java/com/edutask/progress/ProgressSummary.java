package com.edutask.progress;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressSummary {
    private String subjectName;
    private long completedTasks;
    private long totalTasks;
    private double completionPercentage;
}