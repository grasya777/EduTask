package com.edutask.dashboard;

import com.edutask.task.TaskRepository;
import com.edutask.task.TaskStatus;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;

    public DashboardService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public DashboardSummary getDashboardSummary() {

        long totalTasks = taskRepository.count();

        long completedTasks = taskRepository.findAll()
                .stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                .count();

        long pendingTasks = totalTasks - completedTasks;

        double completionPercentage =
                totalTasks == 0 ? 0 :
                ((double) completedTasks / totalTasks) * 100;

        return DashboardSummary.builder()
                .pendingTasks(pendingTasks)
                .completedTasks(completedTasks)
                .totalTasks(totalTasks)
                .completionPercentage(completionPercentage)
                .build();
    }
}

/*
 * Design Pattern: Service Layer Pattern
 * Responsibility: Contains business logic for dashboard summaries.
 * OOP Principle: Single Responsibility Principle (SRP).
 * Best Practice: Keeps business logic separate from controllers.
 */