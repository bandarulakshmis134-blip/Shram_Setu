Shram Setu — High-Level Design Document
1. Introduction
1.1 Purpose

This High-Level Design (HLD) document describes the architecture, major components, data flow, integrations, security model, and deployment structure of Shram Setu.

Shram Setu is a workforce marketplace platform designed to connect employers with skilled workers for different types of work including household services, construction, maintenance, factory-related work, agriculture, and other skilled/local services.

The platform supports two primary hiring mechanisms:

Job-based hiring — an employer posts a job and workers apply.
Direct hiring — an employer searches for a worker and sends a work request directly.

The system also provides worker profiles, applications, direct work requests, ratings and reviews, work-completion verification through OTP, real-time communication, email services, and an AI assistant called KAIYO.

2. System Objectives

The major objectives of Shram Setu are:

Connect employers with skilled workers.
Allow workers to create professional worker profiles.
Allow employers to publish job requirements.
Allow workers to discover and apply for suitable jobs.
Allow employers to search workers directly.
Allow employers to send work requests directly to workers.
Provide a mechanism to verify completion of work.
Allow users to rate and review workers.
Provide real-time communication between users.
Provide AI-powered assistance through KAIYO.
Provide password recovery using OTP.
Provide a simple and accessible user interface.
Maintain secure authentication and authorization.
3. System Scope
3.1 In Scope

The system includes:

User registration and login
JWT-based authentication
Worker registration
Worker profiles
Worker search
Job creation
Job browsing
Job applications
Application management
Direct worker hiring
Work completion verification
OTP-based verification
Ratings and reviews
Real-time messaging
Email notifications
Password reset
AI assistant
Responsive frontend
REST APIs
MongoDB database
3.2 Out of Scope

The current architecture does not include:

Integrated payment gateway
Payroll processing
Government identity verification
Automated worker background verification
Full enterprise HR management
Advanced recommendation engine
Blockchain-based worker verification

These can be considered future enhancements.

4. Technology Stack
Layer	                           Technology
Frontend	                        React.js
Build Tool	                     Vite
Styling	                        Tailwind CSS
Backend	                        Node.js
API Framework	                  Express.js
Database	                        MongoDB
ODM	                           Mongoose
Authentication	                  JWT
Real-Time Communication	         Socket.IO
Email	                           Nodemailer
SMTP Provider	                  Brevo SMTP
AI Integration	                  Groq API
AI Model	                        Llama 3.3 70B Versatile
Frontend Deployment	            Vercel
Backend Deployment	            Render
Database Hosting	               MongoDB Atlas
5. High-Level Architecture

The system follows a client-server architecture.

                         ┌───────────────────────┐
                         │        USERS          │
                         │                       │
                         │ Workers / Employers   │
                         │        / Admin        │
                         └───────────┬───────────┘
                                     │
                                     │ HTTPS
                                     ▼
                         ┌───────────────────────┐
                         │   React Frontend      │
                         │                       │
                         │ React + Vite          │
                         │ Tailwind CSS          │
                         │ Client-side Routing   │
                         └───────────┬───────────┘
                                     │
                                     │ REST API
                                     ▼
                    ┌────────────────────────────────┐
                    │       Node.js / Express        │
                    │          Backend API            │
                    │                                │
                    │ Controllers                    │
                    │ Routes                         │
                    │ Middleware                     │
                    │ Business Logic                 │
                    └───────┬───────────┬────────────┘
                            │           │
             ┌──────────────┘           └──────────────┐
             │                                         │
             ▼                                         ▼
   ┌────────────────────┐                    ┌────────────────────┐
   │   MongoDB Atlas    │                    │ External Services  │
   │                    │                    │                    │
   │ Users              │                    │ Groq API           │
   │ Workers            │                    │ Brevo SMTP         │
   │ Jobs               │                    │ Socket.IO          │
   │ Applications       │                    │                    │
   │ Requests           │                    └────────────────────┘
   │ Reviews            │
   │ Messages           │
   └────────────────────┘
6. Major System Components

Shram Setu consists of the following major components:

                    SHRAM SETU
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   FRONTEND          BACKEND         SERVICES
        │               │                │
        │               │        ┌───────┼────────┐
        │               │        │       │        │
        ▼               ▼        ▼       ▼        ▼
     React          Express    Groq   Brevo   Socket.IO
     Vite           Node.js
        │               │
        │               ▼
        │           MongoDB
        │
        ▼
   User Interface
7. Frontend Architecture

The frontend is implemented using React.js and Vite.

                    React Application
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Pages        Components      Utils
             │             │             │
             │             │             │
             ▼             ▼             ▼
        Login          Navbar       API Helpers
        Register       Cards         Validation
        Home           Modals        Badge Logic
        Jobs           Forms
        Profile        Chat
        Dashboard      AI Chat
7.1 Frontend Responsibilities

The frontend handles:

User interface rendering.
Form input.
Client-side validation.
API communication.
Authentication state.
Job browsing.
Worker browsing.
Application interaction.
Messaging interface.
AI chat interface.
Profile management.
Routing.
Displaying success/error messages.
8. Backend Architecture

The backend follows a layered structure.

                  HTTP Request
                       │
                       ▼
                    Routes
                       │
                       ▼
                  Middleware
                       │
                       ▼
                 Controllers
                       │
                       ▼
                 Business Logic
                       │
                       ▼
                    Models
                       │
                       ▼
                   MongoDB
Main backend responsibilities
Authentication
Authorization
Request validation
Business logic
Database operations
Error handling
Email communication
AI API communication
Real-time communication
9. User Roles

The platform primarily works with:

9.1 Worker

Workers can:

Create worker profiles.
Add skills and experience.
Browse jobs.
Apply for jobs.
Receive direct work requests.
Accept/reject requests.
Complete work.
Receive ratings and reviews.
Communicate with employers.
9.2 Employer/User

Employers can:

Create an account.
Search workers.
View worker profiles.
Post jobs.
Receive applications.
Accept/reject workers.
Directly send work requests.
Communicate with workers.
Verify work completion.
Provide ratings and reviews.
9.3 Administrator

The administrator can manage platform-level operations and application-related workflows available through the administrative interface.

10. Authentication Architecture

Authentication uses JWT.

             User
              │
              │ Login
              ▼
        React Frontend
              │
              │ POST credentials
              ▼
       Express Backend
              │
              ▼
       User Controller
              │
              ▼
        MongoDB User
              │
        Credentials Valid?
          ┌───┴───┐
         NO       YES
          │         │
          ▼         ▼
        Error     JWT Token
                    │
                    ▼
              Frontend Storage
                    │
                    ▼
             Authenticated APIs
Authentication Flow
User submits login credentials.
Frontend sends credentials to backend.
Backend searches for the user.
Password is validated.
Backend generates JWT.
JWT is returned to the frontend.
Frontend uses the token for protected requests.
Authentication middleware validates the token.
11. Authorization Architecture

Protected routes use authentication middleware.

HTTP Request
     │
     ▼
Authorization Header
     │
     ▼
JWT Middleware
     │
     ├──── Invalid ────► 401 Unauthorized
     │
     ▼
Valid Token
     │
     ▼
User Information
     │
     ▼
Controller

The backend should not rely only on frontend restrictions because frontend restrictions can be bypassed.

12. Workforce Marketplace Architecture

Shram Setu supports two major hiring flows.

                    Hiring
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
       Job-Based Hiring    Direct Hiring
             │                 │
             ▼                 ▼
       Employer Posts      Search Worker
            Job                 │
             │                 ▼
             ▼             View Profile
       Workers Apply           │
             │                 ▼
             ▼             Send Request
      Employer Reviews          │
       Applications             ▼
             │             Worker Responds
             ▼
      Worker Selected
13. Job Management Architecture

The job management system allows employers to publish work requirements.

Employer
   │
   ▼
Create Job
   │
   ▼
Frontend Form
   │
   ▼
POST API
   │
   ▼
Job Controller
   │
   ▼
Job Model
   │
   ▼
MongoDB
   │
   ▼
Published Job
   │
   ▼
Workers Browse Jobs

A job can contain information such as:

Job title
Description
Required skills
Location
Budget
Work category
Requirements
Status
Employer information
14. Application Architecture

Workers can apply to jobs.

Worker
  │
  ▼
Browse Jobs
  │
  ▼
Select Job
  │
  ▼
Apply
  │
  ▼
Application API
  │
  ▼
Application Controller
  │
  ▼
MongoDB
  │
  ▼
Employer Dashboard
  │
  ├── Accept
  ├── Reject
  └── Review

The employer can review applications and decide whether to accept or reject a worker.

15. Direct Hiring Architecture

Direct hiring allows an employer to hire a worker without creating a public job application flow.

Employer
   │
   ▼
Search Workers
   │
   ▼
Worker Profiles
   │
   ▼
Select Worker
   │
   ▼
Send Work Request
   │
   ▼
JobRequest
   │
   ▼
Worker
   │
   ├──── Accept
   │
   └──── Reject

This provides a second hiring mechanism for situations where an employer already knows which worker they want.

16. Worker Profile Architecture

Worker registration creates a searchable worker profile.

Worker
  │
  ▼
Worker Registration
  │
  ▼
Profile Data
  │
  ├── Name
  ├── Skills
  ├── Location
  ├── Description
  ├── Experience
  ├── Profile Picture
  └── Other Details
  │
  ▼
MongoDB
  │
  ▼
Worker Search

Registered workers can therefore become visible in the worker marketplace.

17. Worker Groups

Shram Setu supports both:

Individual workers
Worker groups

This allows workers to participate either individually or as a group depending on the nature of the work.

Worker Registration
       │
       ▼
Registration Type
       │
    ┌──┴──┐
    │     │
    ▼     ▼
Individual Group
18. Work Completion Architecture

After a work request has been accepted, work completion can be verified using an OTP.

              Work Completed
                    │
                    ▼
             Generate OTP
                    │
                    ▼
              Store OTP
                    │
                    ▼
             Set Expiration
                    │
                    ▼
              Send Email
                    │
                    ▼
                 Worker
                    │
                    ▼
              Enter OTP
                    │
                    ▼
             Verify OTP
              ┌─────┴─────┐
             FAIL        SUCCESS
              │             │
              ▼             ▼
            Error       Work Completed

The OTP provides an additional verification step before marking the work as completed.

19. Rating and Review Architecture

After work completion, the employer can provide a rating/review.

Work Completed
      │
      ▼
Rating Interface
      │
      ▼
Rating + Review
      │
      ▼
Review API
      │
      ▼
Review Model
      │
      ▼
MongoDB
      │
      ▼
Worker Profile
      │
      ▼
Average Rating

Worker ratings can be displayed on worker profiles.

20. Real-Time Communication Architecture

Socket.IO is used for real-time communication.

          Employer Browser
                 │
                 │
                 ▼
            Socket.IO
                 │
                 │
                 ▼
          Node.js Server
                 │
                 │
                 ▼
            Socket.IO
                 │
                 │
                 ▼
           Worker Browser

This allows users to communicate without repeatedly refreshing the page.

21. Email Service Architecture

Nodemailer is used with Brevo SMTP.

Backend
   │
   ▼
Nodemailer
   │
   ▼
Brevo SMTP
   │
   ▼
User Email

The email service can be used for:

Password reset OTP
Work completion OTP
Other system notifications
22. KAIYO AI Architecture

This is the important correction based on your controller.

Your current implementation uses Groq .

                   User
                     │
                     ▼
              KAIYO Chat UI
                     │
                     │ POST message
                     ▼
              Express Backend
                     │
                     ▼
              aiController.js
                     │
                     │ Groq SDK
                     ▼
                Groq API
                     │
                     ▼
        Llama 3.3 70B Versatile
                     │
                     ▼
                  Response
                     │
                     ▼
              aiController.js
                     │
                     ▼
                Frontend
                     │
                     ▼
                  KAIYO
22.1 AI Integration

The controller initializes the Groq client using an environment variable:

GROQ_API_KEY

The backend sends a request to the Groq API using:

llama-3.3-70b-versatile

The AI response is returned to the frontend.

23. KAIYO Prompt Architecture

KAIYO uses a system prompt to define its behavior.

                    KAIYO
                      │
                      ▼
                System Prompt
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
       Identity    Capabilities   Rules
          │           │           │
          ▼           ▼           ▼
      Shram Setu   Career       Concise
      Assistant    Education    Friendly
                   Technology    Accurate
                   Jobs          Language
                      │
                      ▼
                  User Query
                      │
                      ▼
                 Groq / Llama

The prompt currently instructs KAIYO to:

Answer general knowledge questions.
Help write job descriptions.
Explain worker requirements.
Help workers improve profiles.
Provide interview preparation.
Provide career guidance.
Help with programming and technology.
Help with education.
Translate text.
Write professional messages.
Help students.

The controller also dynamically specifies the requested language.

24. KAIYO Request Flow
User enters message
        │
        ▼
Frontend
        │
        ▼
POST / AI endpoint
        │
        ▼
chatWithAI()
        │
        ▼
Validate message
        │
        ├── Empty ──► 400 Bad Request
        │
        ▼
Create Groq request
        │
        ▼
Groq API
        │
        ▼
Llama 3.3 70B
        │
        ▼
AI Response
        │
        ▼
JSON Response
        │
        ▼
Frontend

The successful response has the structure:

{
  "reply": "AI generated response"
}
25. Database Architecture

MongoDB Atlas is used as the primary database.

                    MongoDB Atlas
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
        ▼                ▼                 ▼
      Users           Workers             Jobs
        │                │                 │
        │                │                 │
        ├────────────┐   │        ┌────────┘
        │            │   │        │
        ▼            ▼   ▼        ▼
 Applications    Requests       Reviews
                         │
                         ▼
                      Messages

The exact collections/models depend on the implemented backend models.

Major conceptual entities include:

User
Worker
Job
Application
JobRequest
Review
Message
26. Database Interaction

The backend uses Mongoose to communicate with MongoDB.

Controller
    │
    ▼
Mongoose Model
    │
    ▼
MongoDB Query
    │
    ▼
MongoDB Atlas
    │
    ▼
Document
    │
    ▼
Mongoose
    │
    ▼
Controller
    │
    ▼
JSON Response

Mongoose provides schema definitions and database interaction.

27. REST API Architecture

The backend exposes REST APIs.

React Client
     │
     │ HTTP/HTTPS
     ▼
Express Router
     │
     ▼
Controller
     │
     ▼
Mongoose
     │
     ▼
MongoDB

Examples of API categories include:

Category	                      Purpose
Auth APIs	                   Registration/login/password reset
Worker APIs	                   Worker registration/profile/search
Job APIs	                      Create/read/update/delete jobs
Application APIs	             Job applications
Request APIs	                Direct work requests
Review APIs	                   Ratings/reviews
Message APIs	                Messaging
AI APIs	                      KAIYO
Admin APIs	                   Administrative operations
28. CRUD Architecture

The platform performs CRUD operations on MongoDB entities.

              CRUD
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
     Create   Read    Update
       │       │        │
       └───────┼────────┘
               │
               ▼
             Delete

Examples:

Create
Create user
Create worker
Create job
Create application
Create request
Create review
Read
Get jobs
Search workers
Get profiles
Get applications
Update
Update profile
Update job
Update application status
Update request status
Delete
Remove appropriate resources where supported.
29. Error Handling Architecture

The backend handles errors using HTTP status codes.

Typical status codes include:

Status	      Meaning
200	         Successful request
201	         Resource created
400	         Invalid request
401	         Unauthorized
403	         Forbidden
404	         Resource not found
500	         Internal server error

For example, your AI controller explicitly handles missing messages:

message missing
     │
     ▼
HTTP 400
     │
     ▼
"Message required"

Unexpected AI/server failures result in:

HTTP 500
30. Environment Configuration

Sensitive configuration is stored in environment variables.

Example:

GROQ_API_KEY
BREVO_USER
BREVO_PASS
MONGODB_URI
JWT_SECRET

The frontend and backend should not expose private credentials in source code.

Architecture:

Environment Variables
        │
        ▼
Backend Runtime
        │
        ├── MongoDB
        ├── JWT
        ├── Groq
        └── Brevo
31. Security Architecture

The major security mechanisms include:

                    Security
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
     JWT          Environment       Validation
 Authentication     Secrets
       │               │               │
       ▼               ▼               ▼
 Protected        API Keys        Input Checks
 Routes

Security considerations include:

JWT authentication.
Protected backend routes.
Environment variables for secrets.
Server-side validation.
Authentication checks.
Role-based access where applicable.
Password protection.
OTP expiration.
API error handling.
32. Data Flow Architecture

A typical job flow is:

Employer
   │
   ▼
Create Job
   │
   ▼
React Frontend
   │
   ▼
Express API
   │
   ▼
MongoDB
   │
   ▼
Published Job
   │
   ▼
Worker
   │
   ▼
Apply
   │
   ▼
Application
   │
   ▼
Employer
   │
   ▼
Accept Worker
   │
   ▼
Work
   │
   ▼
Completion OTP
   │
   ▼
Completed
   │
   ▼
Rating / Review
33. Direct Hiring Data Flow
Employer
   │
   ▼
Search Workers
   │
   ▼
Worker Profile
   │
   ▼
Send Request
   │
   ▼
JobRequest
   │
   ▼
Worker
   │
   ▼
Accept
   │
   ▼
Work
   │
   ▼
OTP Verification
   │
   ▼
Completed
   │
   ▼
Review
34. System Integration Architecture

Shram Setu integrates with several external systems.

                         SHRAM SETU
                              │
                ┌─────────────┼──────────────┐
                │             │              │
                ▼             ▼              ▼
            MongoDB         Groq          Brevo
             Atlas           API           SMTP
                │             │              │
                │             │              │
                ▼             ▼              ▼
             Database       KAIYO         Emails
                             
                             
                         Socket.IO
                              │
                              ▼
                       Real-Time Chat
35. Deployment Architecture

The application is deployed using separate frontend and backend environments.

                         INTERNET
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
             Vercel                    Render
                │                         │
                ▼                         ▼
          React Frontend           Node.js Backend
                                          │
                         ┌────────────────┼─────────────┐
                         │                │             │
                         ▼                ▼             ▼
                    MongoDB Atlas       Groq         Brevo
36. Frontend Deployment

The React/Vite application is deployed on a frontend hosting platform such as Vercel.

User
 │
 ▼
Vercel
 │
 ▼
React Application
 │
 ▼
API Requests

The frontend uses the configured backend API URL through environment configuration.

37. Backend Deployment

The Node.js/Express backend is deployed on Render.

Client
  │
  ▼
Render
  │
  ▼
Express Server
  │
  ├── MongoDB
  ├── Groq
  ├── Brevo
  └── Socket.IO
38. Complete System Architecture
                               USERS
                                 │
                                 ▼
                       ┌─────────────────┐
                       │ React + Vite    │
                       │ Frontend        │
                       └────────┬────────┘
                                │
                         HTTPS / REST
                                │
                                ▼
                    ┌──────────────────────┐
                    │ Node.js + Express    │
                    │ Backend              │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
       Authentication      Controllers       Middleware
             │                 │                  │
             └─────────────────┼──────────────────┘
                               │
                               ▼
                         Mongoose Models
                               │
                               ▼
                        MongoDB Atlas
                              
                              
       ┌───────────────────────┼────────────────────────┐
       │                       │                        │
       ▼                       ▼                        ▼
   Groq API                Brevo SMTP              Socket.IO
       │                       │                        │
       ▼                       ▼                        ▼
 Llama 3.3 70B              Emails               Real-Time Chat
       │
       ▼
     KAIYO
39. Overall Business Flow
                         SHRAM SETU
                             │
                             ▼
                         Register
                             │
                             ▼
                      Choose / Create Role
                             │
             ┌───────────────┴────────────────┐
             │                                │
             ▼                                ▼
          WORKER                           EMPLOYER
             │                                │
             ▼                                ▼
       Create Profile                    Search Workers
             │                                │
             ▼                                │
        Browse Jobs                          │
             │                                │
             ▼                                ▼
          Apply                         Direct Request
             │                                │
             └───────────────┬────────────────┘
                             │
                             ▼
                           WORK
                             │
                             ▼
                      Completion OTP
                             │
                             ▼
                         Completed
                             │
                             ▼
                       Rating / Review
40. Scalability Considerations

The architecture can be extended as user traffic grows.

Potential improvements include:

Redis caching.
Database indexing.
API rate limiting.
Background job processing.
Dedicated notification service.
Image/object storage.
Load balancing.
Horizontal backend scaling.
AI request throttling.
Message persistence optimization.

Current architecture is suitable for a student/MVP-scale application while providing a foundation for future scaling.

41. Reliability

Reliability is supported through:

Server-side validation.
HTTP status codes.
Error handling.
Database persistence.
OTP expiration.
Authentication checks.
External service error handling.
Environment-based configuration.

External service failures should not expose internal error details to end users.

42. Maintainability

The system is divided into independent responsibilities:

Routes
  ↓
Controllers
  ↓
Models
  ↓
Database

and:

Frontend
  ↓
Pages
  ↓
Components
  ↓
API Communication

This separation makes it easier to:

Add features.
Debug errors.
Replace external services.
Modify individual modules.
Test components independently.
43. Important Design Decisions
43.1 MongoDB

MongoDB was selected because the platform contains user, worker, job, application, request, review, and message data whose structures can evolve.

43.2 REST API

REST provides a simple communication mechanism between React and Express.

43.3 JWT

JWT provides stateless authentication for API requests.

43.4 Socket.IO

Socket.IO provides real-time communication for messaging.

43.5 Groq

Groq is used as the LLM API provider for KAIYO.

43.6 Llama 3.3 70B

The current AI controller explicitly requests:

llama-3.3-70b-versatile

Therefore, your HLD should say Groq + Llama 3.3 70B.