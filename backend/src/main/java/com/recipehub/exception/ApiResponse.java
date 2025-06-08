package com.recipehub.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private LocalDateTime timestamp;
    private int status;
    private String errorCode;
    private String message;
    private T data;
    private Map<String, String> errors;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(200)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(int status, String errorCode, String message) {
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .errorCode(errorCode)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> validationError(Map<String, String> errors) {
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(400)
                .errorCode("VALIDATION_ERROR")
                .message("Validation failed")
                .errors(errors)
                .build();
    }
} 