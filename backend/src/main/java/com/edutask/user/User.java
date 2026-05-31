package com.edutask.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String courseProgram;
    private LocalDateTime createdAt;
}

/*
 * OOP Concept: Encapsulation
 * JPA Entity representing a system user.
 * Stores account and profile information.
 */