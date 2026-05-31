package com.edutask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EduTaskApplication {
    public static void main(String[] args) {
        SpringApplication.run(EduTaskApplication.class, args);
    }
}

/*
 * Main Spring Boot Application Class
 * Responsibility: Entry point of the EduTask system.
 * Design Pattern: Dependency Injection (managed by Spring Framework).
 * Best Practice: Keeps startup configuration centralized.
 */