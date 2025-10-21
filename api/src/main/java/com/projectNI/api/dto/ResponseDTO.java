package com.projectNI.api.dto;

import java.util.UUID;

public record ResponseDTO (String name, String token, UUID userId) {
}