package com.edutask.progress;

import com.edutask.subject.Subject;
import com.edutask.subject.SubjectRepository;
import com.edutask.task.Task;
import com.edutask.task.TaskRepository;
import com.edutask.task.TaskStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressService {
    private final SubjectRepository subjectRepository;
    private final TaskRepository taskRepository;

    public ProgressService(SubjectRepository subjectRepository, TaskRepository taskRepository) {
        this.subjectRepository = subjectRepository;
        this.taskRepository = taskRepository;
    }

    public List<ProgressSummary> getProgressBySubject() {
        List<Subject> subjects = subjectRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<ProgressSummary> progressList = new ArrayList<>();

        for (Subject subject : subjects) {
            List<Task> subjectTasks = tasks.stream()
                    .filter(task -> task.getSubject() != null)
                    .filter(task -> task.getSubject().getId().equals(subject.getId()))
                    .toList();

            long total = subjectTasks.size();

            long completed = subjectTasks.stream()
                    .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                    .count();

            double percentage = total == 0 ? 0 : ((double) completed / total) * 100;

            progressList.add(
                    ProgressSummary.builder()
                            .subjectName(subject.getName())
                            .completedTasks(completed)
                            .totalTasks(total)
                            .completionPercentage(percentage)
                            .build()
            );
        }

        return progressList;
    }
}