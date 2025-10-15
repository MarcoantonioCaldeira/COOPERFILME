package com.application.cooperfilme.enums;

public enum Cargo {
    ANALISTA("ROLE_ANALISTA", "ROLE_USER"),
    REVISOR("ROLE_REVISOR", "ROLE_USER"),
    APROVADOR("ROLE_APROVADOR", "ROLE_USER");

    private final String[] roles;

    Cargo(String... roles) {
        this.roles = roles;
    }

    public String[] getRoles() {
        return roles;
    }
}
