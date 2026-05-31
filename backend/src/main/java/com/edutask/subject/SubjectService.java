package com.edutask.subject;

import com.edutask.user.User;
import com.edutask.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public SubjectService(SubjectRepository subjectRepository, UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public Subject createSubject(Subject subject) {
        if (subject == null || subject.getUser() == null || subject.getUser().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject must belong to a valid user.");
        }

        User user = userRepository.findById(subject.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User does not exist. Please sign in again."));

        subject.setUser(user);
        subject.setCreatedAt(LocalDateTime.now());
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject updateSubject(Long id, Subject updatedSubject) {
        Subject subject = subjectRepository.findById(id).orElse(null);

        if (subject == null) return null;

        subject.setName(updatedSubject.getName());
        subject.setColor(updatedSubject.getColor());
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}

/*
 * Design Pattern: Service Layer Pattern
 * Responsibility: Contains business rules for subjects.
 * OOP Principle: Single Responsibility Principle (SRP).
 */