package com.edutask.task;

import com.edutask.subject.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByDueDate(LocalDate dueDate);
    List<Task> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
    List<Task> findByPriority(Priority priority);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findBySubject(Subject subject);
}