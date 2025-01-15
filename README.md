# API Documentation

This document provides a detailed description of all the routes available in the User and Task modules, along with their request methods, parameters, and guards.

---

## **User Module**

### **POST /user/signup**
- **Description**: Create a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "optional (USER | ADMIN)" 
  }
  ```
- **Role**: By default role is assign to user and have to set to admin manually in the database
- **Guards**: None

### **POST /user/signin**
- **Description**: Sign in an existing user and return a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Guards**: None

### **GET /user**
- **Description**: Retrieve all users except the logged-in user.
- **Guards**:
  - `JwtAuthGuard`
  - `RoleGuard` (Requires `ADMIN` role)
- **Response**: Array of users excluding the logged-in user.

### **GET /user/:id**
- **Description**: Retrieve a specific user by ID.
- **Path Parameters**:
  - `id` (integer): The ID of the user.
- **Guards**:
  - `JwtAuthGuard`
  - `RoleGuard` (Requires `ADMIN` role)

### **PATCH /user**
- **Description**: Update the logged-in user's information.
- **Request Body**:
  ```json
  {
    "username": "optional string",
    "email": "optional string",
    "password": "optional string"
  }
  ```
- **Guards**:
  - `JwtAuthGuard`

### **DELETE /user/:id**
- **Description**: Delete a user by ID.
- **Path Parameters**:
  - `id` (integer): The ID of the user to delete.
- **Guards**:
  - `JwtAuthGuard`
  - `RoleGuard` (Requires `ADMIN` role)

---

## **Task Module**

### **POST /task**
- **Description**: Create a new task for the logged-in user.
- **Request Body**:
  ```json
  {
    "title": "string",
    "status": "optional (PENDING | IN_PROGRESS | COMPLETED)"
  }
  ```
- **Guards**:
  - `JwtAuthGuard`

### **GET /task**
- **Description**: Retrieve all tasks for the logged-in user, with optional filtering by status.
- **Query Parameters**:
  - `status` (optional): Filter tasks by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
- **Guards**:
  - `JwtAuthGuard`


### **PATCH /task/:id**
- **Description**: Update a task created by the logged-in user.
- **Path Parameters**:
  - `id` (integer): The ID of the task to update.
- **Request Body**:
  ```json
  {
    "title": "optional string",
    "status": "optional (PENDING | IN_PROGRESS | COMPLETED)"
  }
  ```
- **Guards**:
  - `JwtAuthGuard`

### **DELETE /task/:id**
- **Description**: Delete a task created by the logged-in user.
- **Path Parameters**:
  - `id` (integer): The ID of the task to delete.
- **Guards**:
  - `JwtAuthGuard`

---

## **Guards**
- **JwtAuthGuard**:
  - Ensures the user is authenticated.
  - Adds the `user` object to the request for downstream use.
- **RoleGuard**:
  - Ensures the user has the required role (e.g., `ADMIN`).

---

## **Decorators**
- **@Roles**:
  - Used to specify roles for endpoints, works in conjunction with `RoleGuard`.
  - Example: `@Roles(RoleEnum.ADMIN)`

---

### Notes:
- All routes requiring `JwtAuthGuard` expect the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```
- Validation is applied to all incoming requests using `ValidationPipe` to ensure proper data format.

