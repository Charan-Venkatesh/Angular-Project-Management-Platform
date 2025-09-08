# Angular-Project-Management-Platform
Built to enterprise standards, this Angular app provides full-stack project and task management. It features a true Kanban board with drag-and-drop, a responsive UI with modern micro-interactions, and a robust testing suite ensuring production readiness and scalability.
1. Introduction
1.1 Purpose

The purpose of this document is to define the requirements for the Angular Todo Application. It provides a detailed description of the system’s functional and non-functional requirements, its user interfaces, and design constraints. This application will serve as a modern productivity tool enabling users to create, manage, and track tasks across multiple projects with a responsive and intuitive user interface.

1.2 Document Conventions

Shall indicates a mandatory requirement.

Should indicates a recommended but optional requirement.

May indicates a permissible action.

Terminology follows IEEE 830/29148 SRS standards.

1.3 Intended Audience and Reading Suggestions

Developers: To understand implementation-level requirements.

Project Managers: To assess scope and milestones.

Testers: To design test cases based on functional requirements.

End-users: For feature overview and usability validation.

1.4 Product Scope

The Angular Todo Application is a web-based, single-page application (SPA) that enables efficient project and task management. Users can:

Create projects and assign tasks.

Organize tasks into Kanban-style workflow columns (To Do, In Progress, Done).

Manage tasks with quick actions, validations, and responsive UI.

Access from mobile, tablet, and desktop seamlessly.

This tool is designed to increase productivity, enhance collaboration, and provide a scalable base for future integration with APIs, authentication, and analytics.

1.5 References

IEEE 29148-2018: Systems and Software Engineering — Life Cycle Processes — Requirements Engineering.

Angular Documentation (https://angular.dev
).

Material Design Guidelines.

2. Overall Description
2.1 Product Perspective

The Todo App is a standalone Angular SPA designed for extensibility. It follows a modular component-based architecture, with reusable UI units (task cards, columns, forms).

High-level modules:

Project Management (projects dashboard, project details)

Task Management (creation, editing, completion)

Kanban Workflow (drag-and-drop columns)

Navigation & Routing (Angular Router-based SPA)

Feedback System (notifications, validations, error handling)

2.2 Product Functions

Manage multiple projects.

Create, edit, delete tasks.

Assign attributes (title, description, priority, due date, status).

Display tasks in Kanban board.

Provide instant feedback via UI notifications.

2.3 User Characteristics

Users are assumed to have basic computer literacy.

No technical expertise required to use UI.

System is designed for students, professionals, and project managers.

2.4 Constraints

Developed using Angular 20+, TypeScript, SCSS/CSS, HTML.

Deployment as a static site (Netlify/Vercel) or via a server.

Browser-based only (initial release, no native apps).

2.5 Assumptions and Dependencies

Internet connectivity required for hosting environment.

Future versions may depend on backend APIs for persistence.

Currently assumes local storage or mock API for data.

3. External Interface Requirements
3.1 User Interfaces

Navigation Bar: Links to dashboard, projects, tasks.

Project List View: Displays all projects with "Add Project" CTA.

Project Detail View: Kanban board with To Do, In Progress, Done.

Task Card: Compact card showing title, due date, priority, quick actions.

Forms: Reactive Forms with field validation and error messages.

3.2 Hardware Interfaces

Standard input devices (mouse, keyboard, touchscreen).

3.3 Software Interfaces

Angular Router for navigation.

(Optional) REST API for persistence.

Local storage or in-memory DB (mock backend).

3.4 Communications Interfaces

SPA design — all interactions within the app, minimal server requests.

4. System Features
4.1 Project Management

Description: Users can create, view, and delete projects.
Functional Requirements:

FR-1: System shall allow users to create a new project with name, description, and due date.

FR-2: System shall display all projects in a dashboard view.

FR-3: System shall allow users to delete projects.

4.2 Task Management

Description: Tasks are created within projects.
Functional Requirements:

FR-4: System shall allow users to create tasks with title, description, priority, and due date.

FR-5: System shall allow editing and deletion of tasks.

FR-6: System shall allow marking tasks as complete.

4.3 Kanban Workflow

Description: Tasks are displayed in status-based columns.
Functional Requirements:

FR-7: System shall display tasks grouped by status.

FR-8: System shall allow drag-and-drop of tasks between columns.

4.4 Forms & Validation

FR-9: All required fields shall be validated.

FR-10: Invalid inputs shall trigger error messages.

4.5 Feedback & Notifications

FR-11: Successful operations shall trigger success messages.

FR-12: Errors shall display inline messages or toasts.

5. Non-Functional Requirements
5.1 Performance

The system shall load within 3 seconds on standard broadband.

Task operations shall respond within 500ms.

5.2 Security

Data shall be stored in local storage or mock API (initial release).

Future versions shall support authentication and secure APIs.

5.3 Reliability & Availability

System shall operate 24/7 if hosted online.

Minimal downtime during deployments.

5.4 Maintainability

Modular Angular components for easy updates.

Codebase documented with comments and consistent conventions.

5.5 Portability

Responsive design for desktop, tablet, mobile.

Cross-browser compatibility (Chrome, Firefox, Edge, Safari).

6. Other Requirements

Testing: Jasmine + Karma test cases.

Deployment: Angular CLI build optimized for production.

Future Enhancements: REST API integration, user accounts, analytics dashboard.

7. Appendices
7.1 Glossary

SPA: Single Page Application.

Kanban: Workflow visualization with columns representing task states.

Reactive Forms: Angular forms providing reactive programming approach for form handling.
