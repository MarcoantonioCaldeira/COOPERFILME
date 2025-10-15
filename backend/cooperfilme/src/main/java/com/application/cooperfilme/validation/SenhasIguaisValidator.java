package com.application.cooperfilme.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapperImpl;

public class SenhasIguaisValidator implements ConstraintValidator<SenhasIguais, Object> {
    private String senha;
    private String confirmarSenha;

    @Override
    public void initialize(SenhasIguais constraintAnnotation) {
        this.senha = "senha";
        this.confirmarSenha = "confirmarSenha";
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        String senhaValue = (String) new BeanWrapperImpl(value).getPropertyValue(senha);
        String confirmarSenhaValue = (String) new BeanWrapperImpl(value).getPropertyValue(confirmarSenha);

        if (senhaValue == null || confirmarSenhaValue == null) {
            return true;
        }

        return senhaValue.equals(confirmarSenhaValue);
    }
}
