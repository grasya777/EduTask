package com.edutask.focussession;

import com.edutask.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "focus_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FocusSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int focusMinutes;
    private int breakMinutes;
    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

/*
 * OOP Concept: Encapsulation
 * JPA Entity representing a completed focus session.
 * Relationship Mapping: Many focus sessions can belong to one user.
 * Best Practice: Entity class only stores data.
 */
