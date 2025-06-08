package com.recipehub.exception;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
public class ValidationErrorResponse extends ErrorResponse {
    private Map<String, String> errors;

    public ValidationErrorResponse(int status, Date timestamp, String message, Map<String, String> errors) {
        super(status, timestamp, message, null);
        this.errors = errors;
    }
} 