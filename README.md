# 🎬 COOPERFILME — Sistema de Análise de Roteiros

Aplicação **Full Stack** desenvolvida como teste técnico, que simula um sistema interno para submissão, triagem, revisão e aprovação de roteiros cinematográficos.  
O projeto integra **frontend React**, **backend Spring Boot** e **banco PostgreSQL**, com autenticação via **JWT (Spring Security)** e layout moderno baseado em **Tailwind CSS**.

---

## Visão Geral

O objetivo foi criar uma aplicação completa, com autenticação e controle de papéis (Analista, Revisor e Aprovador), seguindo boas práticas de arquitetura e design.

---

## Melhorias

- o fluxo de validação dos roteiros e a consulta por email deve passar por melhorias 

##  Tecnologias Utilizadas

### **Frontend**
-  [React + Vite](https://vitejs.dev/)
-  [Tailwind CSS](https://tailwindcss.com/)
-  [Shadcn/UI](https://ui.shadcn.com/)
-  [React Router DOM](https://reactrouter.com/)
-  [Axios](https://axios-http.com/)
-  [Lucide React](https://lucide.dev/)

### **Backend**
-  [Spring Boot](https://spring.io/projects/spring-boot)
-  [Spring Security (JWT)](https://spring.io/projects/spring-security)
-  [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
-  [Jakarta Validation](https://jakarta.ee/specifications/bean-validation/)
-  [Lombok](https://projectlombok.org/)

### **Banco de Dados**
- 🐘 [PostgreSQL](https://www.postgresql.org/)

### **Design**
-  [Figma](https://figma.com/) — Prototipagem de interface

---

##  Como Executar o Projeto

###  Backend — Spring Boot

#### ** Pré-requisitos**
- Java 21+
- Maven ou Gradle
- PostgreSQL rodando (local ou via Docker)

#### **2️⃣ Configuração**
Crie o banco de dados:

```sql
CREATE DATABASE cooperfilme;
