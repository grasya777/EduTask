package com.edutask.task;

import com.edutask.subject.SubjectRepository;
import com.edutask.user.UserRepository;
import org.springframework.stereotype.Service;
import com.edutask.subject.Subject;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, SubjectRepository subjectRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    public Task createTask(Task task) {
        if (task.getUser() != null && task.getUser().getId() != null) {
            task.setUser(userRepository.findById(task.getUser().getId()).orElse(null));
        }

        if (task.getSubject() != null && task.getSubject().getId() != null) {
            task.setSubject(subjectRepository.findById(task.getSubject().getId()).orElse(null));
        }

        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return null;

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());
        task.setSubject(updatedTask.getSubject());
        task.setStatus(updatedTask.getStatus());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task markCompleted(Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return null;

        task.setStatus(TaskStatus.COMPLETED);
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public List<Task> getTasksByPriority(Priority priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> getTasksBySubject(Subject subject) {
        return taskRepository.findBySubject(subject);
    }

    public List<Task> getTasksDueToday() {
        return taskRepository.findByDueDate(LocalDate.now());
    }

    public List<Task> getTasksDueThisWeek() {
        LocalDate today = LocalDate.now();
        return taskRepository.findByDueDateBetween(today, today.plusDays(7));
    }

    public List<Task> getUpcomingTasks() {
        LocalDate today = LocalDate.now();
        return taskRepository.findByDueDateBetween(today, today.plusDays(30));
    }
}

/*
 * Design Pattern: Service Layer Pattern
 * Responsibility: Implements task business logic.
 * OOP Principle: Single Responsibility Principle (SRP).
 * Best Practice: Separates logic from controllers.
 */