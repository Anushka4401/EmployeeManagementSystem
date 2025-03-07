package com.anushka.ems_test.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)  // HTTP 409 Conflict
public class EmailException extends RuntimeException{
    public EmailException(String message){
        super(message);
    }
}
