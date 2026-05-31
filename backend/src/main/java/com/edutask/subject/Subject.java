package com.edutask.subject;

import com.edutask.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subjects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subject {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String color;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;
}

/*
 * OOP Concept: Encapsulation
 * JPA Entity representing an academic subject.
 * Relationship Mapping: One subject can contain many tasks.
 * Best Practice: Entity stores data only.
 */