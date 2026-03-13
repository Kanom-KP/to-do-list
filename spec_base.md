# TaskFlow – Base Specification

## 1. Project Overview

### Problem Statement

Many users have multiple tasks or responsibilities to manage every day. However, tracking tasks using traditional methods often causes users to forget deadlines or lose clarity about task priorities. This is especially problematic for tasks that have already reached or passed their due dates, which should be more visible and prioritized compared to regular tasks.

### Solution Vision

Develop a multi-user To-Do List responsive web application that allows each user to register, log in, and manage their own task lists privately. Users can create, edit, delete, and update the status of their tasks.

The system will visually display task status based on deadlines using color highlights:

- Tasks that are overdue will be displayed in **red**
- Tasks that are due today will be displayed in **yellow**
- Other tasks will appear in normal status

This system helps users quickly identify tasks that require immediate attention and automatically separates completed tasks from unfinished tasks.

### Target Users

- Students
- Working professionals who manage multiple tasks
- General users who want a simple but practical task tracking system
- Users who want to clearly identify urgent or overdue tasks

### Business Goals

- Build an MVP To-Do List system that supports multiple users
- Make it easy for users to manage their personal tasks
- Help users instantly see tasks that are due soon or overdue
- Develop a practical web application that can be extended with additional features in the future

### Success Metrics

- Users can successfully register and log in
- Users can create, edit, delete, and update task status
- The system correctly separates tasks into "Pending" and "Completed"
- The system correctly highlights tasks in yellow and red based on defined conditions
- Users can clearly see task priority based on the defined sorting rules

---

# 2. User Persona & Journey

### Role / Job

Office workers who need to manage multiple tasks daily

### Pain Points

- Having many tasks and forgetting which ones are due soon
- Frequently forgetting tasks that have reached or passed their deadline
- Wanting to separate completed tasks from unfinished tasks
- Needing a simple and easy-to-use system

### Goals

- Quickly record tasks
- Easily identify which tasks should be done first
- Clearly separate completed tasks from unfinished tasks
- Use a private workspace without seeing other users’ data

### Key User Journey Steps

1. The user registers using an email and password
2. The user logs into the system
3. The user creates a new task by entering a title, description, and due date
4. The system displays the user's tasks on the main page, separating unfinished and completed tasks
5. The system sorts unfinished tasks by urgency
6. Tasks due today appear in yellow, and overdue tasks appear in red
7. When the user changes a task status to "completed", the task automatically moves to the completed section

### Opportunities

- Improve visibility of urgent tasks using visual status indicators
- Make the task list page the central place for users to decide what to do next
- Design the system so it can support future features such as reminders, priority levels, filters, or calendar views

---

# 3. Core Features & User Stories

## Feature List

### Authentication

- User registration
- User login
- Duplicate email validation during registration
- Notification when email is not found during login

### Task Management

- Create To-Do task
- Edit To-Do task
- Delete To-Do task
- Change task status between **Pending** and **Completed**

### Task Display

Tasks must be separated into two sections on the same page:

- Pending Tasks
- Completed Tasks

### Task Highlighting

Tasks should be visually highlighted based on deadline conditions:

- **Red** = Overdue
- **Yellow** = Due Today

### Task Sorting

Pending tasks must be sorted by urgency in the following order:

1. Overdue
2. Due Today
3. Near due date
4. Farther due date

### Data Visibility

Users must only see tasks that they created themselves.

---

## User Stories

### Register

As a new user 
I want to register using my email and password 
So that I can access the system and store my own tasks.

### Duplicate Email Validation

As a new user 
I want to receive a notification when my email is already registered 
So that I know the email has already been used.

### Login

As an existing user 
I want to log in using my email and password 
So that I can access my tasks.

### Missing Email Login Warning

As a user 
If I enter an email that does not exist in the system 
I should receive a message saying the email is not registered and be directed to the Register page.

### Create Task

As a user 
I want to create a new task with a title, due date, and optional description 
So that I can track my work.

### Update Task

As a user 
I want to edit my task information 
So that my task details stay up to date.

### Delete Task

As a user 
I want to delete tasks I no longer need 
So that my task list remains clean.

### Complete Task

As a user 
I want to mark tasks as completed 
So that the system separates them from unfinished tasks.

### Task Priority Visibility

As a user 
I want the most urgent tasks to appear at the top 
So that I know what I should work on first.

### Due-Date Highlight

As a user 
I want tasks that are due today or overdue to be visually highlighted 
So that I can quickly identify tasks requiring immediate attention.

---

## MVP Scope

The MVP must include the following features:

- Register
- Login
- Duplicate email validation
- Email-not-found validation during login
- Create task
- Read task list
- Update task
- Delete task
- Mark tasks as completed/uncompleted
- Separate pending and completed tasks on the same page
- Highlight tasks in yellow and red based on due date
- Sort tasks according to the defined rules
- Restrict task access based on the task owner

---

# 4. Tech Stack & Tools

### Frontend

- Next.js
- React
- Tailwind CSS

### Backend

- Next.js API Routes or Route Handlers

### Database

- Vercel PostgreSQL

### ORM / Database Access

- Prisma

### Authentication

- Session-based authentication or JWT-based authentication
- For MVP, a simple authentication mechanism linked to the Users table can be used

### Date Handling

- date-fns or dayjs for comparing current date with due_date

### UI Utilities

- shadcn/ui

### Dev Tools

- GitHub
- Vercel for deployment
- AI coding tools such as Cursor or Claude Code

---

# 5. Database Schema (High-level)

## Key Entities

- User
- Task

## Relationships

- One User can have many Tasks
- Every Task must belong to one User
- Each user can only see their own tasks

---

## Example Tables

### Table: Users


| Field         | Type                      |
| ------------- | ------------------------- |
| id            | UUID (PK)                 |
| email         | String (Unique, Required) |
| password_hash | String (Required)         |
| created_at    | Timestamp                 |
| updated_at    | Timestamp                 |


### Table: Tasks


| Field        | Type                     |
| ------------ | ------------------------ |
| id           | UUID (PK)                |
| user_id      | UUID (FK → Users.id)     |
| title        | String (Required)        |
| description  | Text (Optional)          |
| due_date     | Date (Required)          |
| is_completed | Boolean (Default: false) |
| created_at   | Timestamp                |
| updated_at   | Timestamp                |


---

## Business Rules

- User emails must be unique
- Password must contain at least 8 characters including letters and numbers
- Title is required
- Due date is required
- Description is optional
- Completed tasks appear in the **Completed Tasks** section
- Unfinished tasks appear in the **Pending Tasks** section

---

## Computed Task State

The system should compute additional task states dynamically without storing them in the database:

- `is_overdue`
- `is_due_today`

### Definitions

is_overdue = current_date > due_date AND is_completed = false
is_due_today = current_date == due_date AND is_completed = false

Note:
`is_overdue` and `is_due_today` are **computed states** and should not be stored as database columns.

---

# 6. API Contract & Interfaces

## Authentication APIs

### POST /api/register

Registers a new user.

#### Request

```json
{
 "email": "user@example.com",
 "password": "abc12345"
}
```
Validation
Email must be unique


Password must contain at least 8 characters including letters and numbers


#### Response (Success)

```json
{
 "status": "success",
 "message": "Registration successful"
}
```

#### Response (Duplicate Email)
```json
{
 "status": "error",
 "message": "This email has already been registered"
}
```

### POST /api/login
Logs in a user.
#### Request
```json
{
 "email": "user@example.com",
 "password": "abc12345"
}
```
#### Response (Success)
```json
{
 "status": "success",
 "message": "Login successful"
}
```
#### Response (Email Not Found)
```json
{
 "status": "error",
 "message": "This email is not registered",
 "redirect_to": "/register"
}
```
#### Response (Invalid Password)
```json
{
 "status": "error",
 "message": "Incorrect password"
}
```

## Task APIs
### GET /api/tasks
Retrieves the task list of the currently logged-in user.
#### Response
```json
[
 {
   "id": "task-001",
   "title": "Submit weekly report",
   "description": "Summarize work for the manager",
   "due_date": "2026-03-14",
   "is_completed": false,
   "is_overdue": false,
   "is_due_today": true
 }
]
```
### POST /api/tasks
Creates a new task.
#### Request
```json
{
 "title": "Submit weekly report",
 "description": "Summarize work for the manager",
 "due_date": "2026-03-14"
}
```
#### Response
```json
{
 "status": "success",
 "message": "Task created successfully"
}
```
### PUT /api/tasks/:id
Updates task information or status.
#### Request
```json
{
 "title": "Submit weekly report",
 "description": "Report content updated",
 "due_date": "2026-03-15",
 "is_completed": true
}
```
#### Response
```json
{
 "status": "success",
 "message": "Task updated successfully"
}
```

### DELETE /api/tasks/:id
Deletes a task.
#### Response
```json
{
 "status": "success",
 "message": "Task deleted successfully"
}
```
UI Interaction Rules
Main Page Layout
The main page must display tasks in a single page separated into two sections:
Pending Tasks

Completed Tasks



Task Highlight Rules
If
is_completed = false AND current_date > due_date
→ display task in red with label "Overdue"
If
is_completed = false AND current_date == due_date
→ display task in yellow with label "Due Today"
If
is_completed = true
→ no highlight is required

Sorting Rules
For Pending Tasks, sort tasks in this order:
Overdue tasks


Tasks due today


Tasks with the nearest due date


Tasks with later due dates


For Completed Tasks:
Sort by updated_at with the most recently updated first.



Access Control Rule
Each user can only view, edit, and delete tasks that they created.


If a user attempts to access another user's task, the system must reject the request.



7. Constraints & Non-Functional Requirements
Security
Users must log in before accessing the To-Do List page


If a user attempts to access the main page without logging in, the system must redirect to the Login page


Users can only view their own data


Passwords must never be stored in plain text and must be hashed before storing in the database



Validation
Email must be unique


Password must contain at least 8 characters including letters and numbers


Title must not be empty


Due date must be a valid date


Description can be empty



Performance
The task list page should load quickly even with a moderate number of tasks in MVP


Overdue and due-today calculations must be accurate and consistent



Availability
The system must work in web browsers on both desktop and mobile devices


UI must be responsive and readable on smaller screens



Usability
Users should be able to create tasks quickly


The task page should clearly separate Pending and Completed tasks


Tasks that are due today or overdue must be more visually prominent than normal tasks



Scalability
The database structure must support multiple users


The system should allow additional features in the future without major redesign



Cost Constraints
The system should use tools and services with free tiers


The scope should remain limited to CRUD + authentication + visual overdue logic
```

