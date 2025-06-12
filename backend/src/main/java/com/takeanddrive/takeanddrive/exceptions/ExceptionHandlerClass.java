package com.takeanddrive.takeanddrive.exceptions;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

@ControllerAdvice
public class ExceptionHandlerClass {

    @ExceptionHandler(value = EntityNotFoundException.class)
    protected ResponseEntity<Error> entityNotFound(EntityNotFoundException ex) {
        return buildErrorResponse("Entity not found", ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = EntityExistsException.class)
    protected ResponseEntity<Error> alreadyExistsException(EntityExistsException ex) {
        return buildErrorResponse("Entity already exists", ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    protected ResponseEntity<Error> validationException(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return buildErrorResponse("Validation error", details, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Error> buildErrorResponse(String message, String details, HttpStatus status) {
        Error error = new Error(message, details, status.value());
        return new ResponseEntity<>(error, status);
    }
}