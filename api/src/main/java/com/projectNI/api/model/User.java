package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Table(name="client")
@Entity(name = "client")
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

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private int phone;

    @Column
    private int cnpj;
}