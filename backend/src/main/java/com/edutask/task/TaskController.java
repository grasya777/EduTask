package com.edutask.task;

import com.edutask.subject.Subject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @PatchMapping("/{id}/complete")
    public Task markCompleted(@PathVariable Long id) {
        return taskService.markCompleted(id);
    }

    @GetMapping("/filter/priority/{priority}")
    public List<Task> getTasksByPriority(@PathVariable Priority priority) {
        return taskService.getTasksByPriority(priority);
    }

    @GetMapping("/filter/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable TaskStatus status) {
        return taskService.getTasksByStatus(status);
    }

    @PostMapping("/filter/subject")
    public List<Task> getTasksBySubject(@RequestBody Subject subject) {
        return taskService.getTasksBySubject(subject);
    }

    @GetMapping("/due-today")
    public List<Task> getTasksDueToday() {
        return taskService.getTasksDueToday();
    }

    @GetMapping("/due-this-week")
    public List<Task> getTasksDueThisWeek() {
        return taskService.getTasksDueThisWeek();
    }

    @GetMapping("/upcoming")
    public List<Task> getUpcomingTasks() {
        return taskService.getUpcomingTasks();
    }
}

/*
 * Design Pattern: MVC Controller Pattern
 * Responsibility: Exposes REST endpoints for task management.
 * Best Practice: Controller only handles requests and responses.
 */