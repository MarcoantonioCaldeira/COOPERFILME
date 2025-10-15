package com.application.cooperfilme.web;

import org.springframework.stereotype.Component;

@Component
public class SystemMessage<T>{

    private Integer status;
    private String message;
    private T object;

    public SystemMessage(Integer status, String message, T object) {
        super();
        this.status = status;
        this.message = message;
        this.object = object;
    }

    public SystemMessage() {
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getObject() {
        return object;
    }

    public void setObject(T object) {
        this.object = object;
    }
}
