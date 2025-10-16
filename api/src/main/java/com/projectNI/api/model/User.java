package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Table(name="user")
@Entity(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idUser")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idUser;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private int phone;

    @Column(nullable = false)
    private int cnpj;
}