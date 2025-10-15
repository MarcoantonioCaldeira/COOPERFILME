package com.application.cooperfilme.web;

import java.util.Date;
import java.util.List;

public class SystemErrorMessage {
    private int status;
    private Date date;
    private String message;
    private String description;
    private boolean error;
    private List<Fields> fields;

    public List<Fields> getFields() {
        return fields;
    }

    public void setFields(List<Fields> fields) {
        this.fields = fields;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private SystemErrorMessage message;

        public Builder() {
            this.message = new SystemErrorMessage();
        }

        public Builder addStatus(int status) {
            this.message.status = status;
            return this;
        }

        public Builder addDate(Date date) {
            this.message.date = date;
            return this;
        }

        public Builder addMessage(String message) {
            this.message.message = message;
            return this;
        }

        public Builder addDescription(String description) {
            this.message.description = description;
            return this;
        }

        public Builder addError(boolean isError) {
            this.message.error = isError;
            return this;
        }

        public Builder addFields(List<Fields> fields) {
            this.message.fields = fields;
            return this;
        }

        public SystemErrorMessage build() {
            return this.message;
        }
    }
}
