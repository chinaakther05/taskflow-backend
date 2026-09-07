# TaskFlow Backend 🚀

TaskFlow is an industry-level Project Management SaaS backend built with Node.js, TypeScript, Express.js, Prisma, and PostgreSQL.

TaskFlow provides a complete backend solution for managing organizations, projects, tasks, team members, comments, invitations, time tracking, attachments, notifications, subscriptions, and payments.

---

## 📌 Project Overview

TaskFlow is a Project Management SaaS platform designed to help teams and organizations manage their projects and collaborate efficiently.

The backend provides secure RESTful APIs with authentication, authorization, role-based access control, validation, database management, subscription management, and Stripe payment integration.

### Core Features

- User Registration & Login
- JWT Authentication
- Google Authentication
- Role-Based Access Control
- Organization Management
- Organization Member Management
- Project Management
- Project Member Management
- Task Management
- Task Assignment
- Comment Management
- Member Invitations
- Time Tracking
- File Attachments
- Activity Tracking
- Notifications
- Subscription Management
- Stripe Payment Integration
- Stripe Webhook
- Request Validation
- Centralized Error Handling

---

# 🛠️ Technologies Used

## Backend

- Node.js
- TypeScript
- Express.js

## Database

- PostgreSQL
- Prisma ORM

## Authentication & Security

- JSON Web Token (JWT)
- bcrypt
- Google OAuth / Google ID Token
- HTTP-only Refresh Token Cookie

## Validation

- Zod

## Payment

- Stripe
- Stripe Webhook

## Development Tools

- Prisma Studio
- Postman
- ESLint
- Prettier
- Git
- GitHub
- npm

---

# 📁 Project Structure

```text
taskflow-backend/
│
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma
│   │   └── ...
│   ├── migrations/
│   └── prisma7.config.ts
│
├── src/
│   │
│   ├── config/
│   │   └── index.ts
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── ...
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.interface.ts
│   │   │
│   │   ├── organization/
│   │   ├── project/
│   │   ├── task/
│   │   ├── comment/
│   │   ├── member/
│   │   ├── invitation/
│   │   ├── timeLog/
│   │   ├── attachment/
│   │   ├── activity/
│   │   ├── notification/
│   │   ├── subscription/
│   │   └── payment/
│   │
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   ├── apiResponse.ts
│   │   ├── catchAsync.ts
│   │   ├── jwt.ts
│   │   └── ...
│   │
│   └── server.ts
    ├──app.ts

│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── prisma7.config.ts
└── README.md

##Role-Based Access Control

TaskFlow supports different user roles and permissions.

Example roles include:

ADMIN
PROJECT_MANAGER
MEMBER

Each role has different permissions for managing:

Organizations
Members
Projects
Tasks
Comments
Invitations
Subscriptions
Payments
🏢 Organization Management

TaskFlow allows users to manage organizations.

Features
Create organization
Get organization
Update organization
Delete organization
Manage organization members
Assign member roles
Remove members
Role-based permissions
👨‍👩‍👧 Organization Members

Organization members can be managed through protected APIs.

Features
Add members
View members
Update member roles
Remove members
Invite new members
📁 Project Management

TaskFlow provides complete project management functionality.

Features
Create project
Get all projects
Get project details
Update project
Delete project
Manage project members
📋 Task Management

TaskFlow provides a complete task management system.

Features
Create task
Get tasks
Get task details
Update task
Delete task
Assign task
Update task status
Set task priority
Set due date
Track task progress
💬 Comment Management

Users can collaborate through task comments.

Features
Create comment
Get comments
Update comment
Delete comment
✉️ Member Invitation

TaskFlow supports organization/project member invitations.

Features
Send invitation
View invitations
Accept invitation
Reject invitation
Remove invitation
⏱️ Time Tracking

TaskFlow provides time tracking functionality for tasks.

Features
Start time tracking
Stop time tracking
Create time log
View time logs
Track time spent on tasks
📎 Attachments

Users can attach files to supported resources.

Features
Create attachment
Get attachments
Delete attachment
Associate attachments with tasks/projects
📊 Activity Tracking

TaskFlow tracks important activities within organizations and projects.

Examples include:

Project created
Task created
Task updated
Task assigned
Comment added
Member added
Member removed
🔔 Notifications

TaskFlow provides notifications for important activities.

Notifications can be generated for:

Task assignments
Invitations
Comments
Project activities
Organization activities
Other important events
💳 Subscription Management

TaskFlow supports multiple subscription plans.

Free Plan
Projects: 3
Members: 5
Pro Plan
Projects: 20
Members: 50
Business Plan
Projects: 100
Members: 200
Subscription Features
Create subscription
Get subscription
Update subscription
Cancel subscription
Check subscription status
Enforce project limits
Enforce member limits
💰 Stripe Payment Integration

TaskFlow uses Stripe for subscription payments.

Payment Flow
User
  ↓
Create Checkout Session
  ↓
Stripe Checkout
  ↓
Complete Payment
  ↓
Stripe Webhook
  ↓
Verify Payment
  ↓
Update Payment Status
  ↓
Activate Subscription
🔗 Stripe Webhook

Webhook endpoint:

POST /api/payments/webhook

The webhook is used to process successful Stripe payments and update the corresponding payment and subscription records.

For local development, Stripe CLI can be used:

stripe listen --forward-to localhost:5000/api/payments/webhook
🧪 API Testing

Postman can be used to test all APIs.

Main API modules:

Authentication
Organizations
Organization Members
Projects
Project Members
Tasks
Comments
Invitations
Time Logs
Attachments
Activities
Notifications
Subscriptions
Payments
🛡️ Security Features

TaskFlow implements several security mechanisms:

JWT authentication
Password hashing with bcrypt
Role-based authorization
Request validation
Protected routes
HTTP-only refresh token cookies
Environment variables for sensitive configuration
Google ID token verification
Stripe webhook verification
❌ Error Handling

TaskFlow uses centralized error handling.

The API provides consistent error responses for:

Validation errors
Authentication errors
Authorization errors
Not found errors
Database errors
Payment errors
Server errors

Example:

{
  "success": false,
  "message": "Unauthorized",
  "errors": []
}
📝 API Response Format

Successful response example:

{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}

Error response example:

{
  "success": false,
  "statusCode": 400,
  "message": "Something went wrong",
  "errors": []
}
📜 Available Scripts
Development
npm run dev
Build
npm run build
Start Production Server
npm start
Lint
npm run lint
Fix Lint Issues
npm run lint:fix
Format Code
npm run format
Check Formatting
npm run format:check
🏗️ Production Build

Create a production build:

npm run build

Then start the production server:

npm start
🌐 API Base URL
Local Development
http://localhost:5000
Production
YOUR_PRODUCTION_BACKEND_URL
📚 API Documentation

Postman documentation:

YOUR_POSTMAN_DOCUMENTATION_URL
git clone YOUR_GITHUB_REPOSITORY_URL

Swagger/OpenAPI documentation can also be added here if available.

🚀 Deployment

The backend can be deployed to platforms such as:

Render
Railway
Fly.io
AWS
Other Node.js hosting platforms

Before deployment, configure all required environment variables in the hosting platform.

🔧 Development Workflow

Typical development workflow:

1. Install dependencies
       ↓
2. Configure environment variables
       ↓
3. Configure PostgreSQL
       ↓
4. Run Prisma migration
       ↓
5. Generate Prisma Client
       ↓
6. Start development server
       ↓
7. Test APIs with Postman
       ↓
8. Build production version
       ↓
9. Deploy
📌 Important Notes
Do not commit .env.
Do not expose JWT secrets.
Do not expose Stripe secret keys.
Do not expose database credentials.
Use valid Google ID tokens for Google authentication.
Use Stripe CLI for local webhook testing.
Use Prisma migrations to manage database changes.
📦 Main Modules
Module	Description
Auth	Registration, Login, Google Login
Organization	Organization management
Member	Organization member management
Project	Project management
Task	Task management
Comment	Task comments
Invitation	Member invitations
Time Log	Time tracking
Attachment	File attachments
Activity	Activity tracking
Notification	User notifications
Subscription	Subscription plans
Payment	Stripe payment integration
🎯 Project Goals

The main goals of TaskFlow are:

Build a scalable SaaS backend
Implement secure authentication
Implement role-based authorization
Provide complete project management APIs
Support team collaboration
Integrate subscription-based plans
Integrate Stripe payments
Follow modular backend architecture
Provide production-ready REST APIs
👨‍💻 Author
China Akther

Full Stack Developer

📄 License

This project was developed for educational, learning, and portfolio purposes.