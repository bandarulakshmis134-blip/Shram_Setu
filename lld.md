Low-Level Design (LLD)
Shram Setu — Workforce Marketplace Platform

Document Version: 1.0.0
Status: Completed – Project Assessment
Document Type: Low-Level Design
Project: Shram Setu

Table of Contents
Introduction
System Overview
Technology Stack
System Architecture
Module Architecture
Project Structure
Database Design
Detailed Schema Design
Authentication and Authorization Design
Middleware Design
API Design
Frontend Design
Job Management Design
Worker Management Design
Application Management Design
Direct Hiring Design
Work Completion OTP Design
Rating and Review Design
Real-Time Messaging Design
Email Service Design
KAIYO AI Design
Error Handling Design
Validation and Security Design
Data Flow Design
Sequence Diagrams
Component Interaction
Design Decisions
Deployment Design
Future Improvements
Appendix
1. Introduction
1.1 Purpose

This Low-Level Design document describes the internal implementation structure of Shram Setu, a workforce marketplace platform designed to connect people requiring services with skilled workers.

The LLD defines:

System architecture
Frontend components
Backend modules
Database models
API interactions
Authentication
Middleware
Job management
Worker management
Applications
Direct hiring
Work completion verification
Ratings and reviews
Real-time messaging
Email communication
KAIYO AI integration
Error handling
Security
Deployment

The objective is to provide an implementation-level reference for developers and a clear technical representation of the system for project evaluation and viva.

2. System Overview

Shram Setu provides a digital platform through which employers can find and hire skilled workers.

The system supports two major hiring mechanisms.

2.1 Job-Based Hiring

An employer posts a job and workers can apply.

Employer
   │
   ▼
Create Job
   │
   ▼
Workers View Job
   │
   ▼
Worker Applies
   │
   ▼
Employer Reviews Application
   │
   ├── Accept
   │
   └── Reject
2.2 Direct Hiring

An employer can search for workers directly and send a work request.

Employer
   │
   ▼
Search Workers
   │
   ▼
Worker Profile
   │
   ▼
Send Work Request
   │
   ▼
Worker
   │
   ├── Accept
   └── Reject

The platform supports both individual workers and worker groups.

3. Technology Stack
Layer	                        Technology
Frontend	                      React
Build Tool	                   Vite
Styling	                      Tailwind CSS
Routing	                      React Router
HTTP Client	                   Axios
Backend	                      Node.js
API Framework	                Express.js
Database	                      MongoDB
ODM	                         Mongoose
Authentication	                JWT
Real-Time Communication	       Socket.IO
Email	                         Nodemailer
SMTP Provider	                Brevo
AI Integration	                Groq API
Database Hosting	             MongoDB Atlas
Frontend Deployment	          Vercel
Backend Deployment	          Render
4. System Architecture

Shram Setu follows a layered client-server architecture.

                         ┌─────────────────────┐
                         │        USER         │
                         │      Browser        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │       REACT FRONTEND        │
                    │                             │
                    │ React + Vite + Tailwind    │
                    │ React Router + Axios       │
                    └─────────────┬───────────────┘
                                  │
                         HTTP / REST API
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │      NODE + EXPRESS         │
                    │                             │
                    │ Routes                      │
                    │ Middleware                  │
                    │ Controllers                 │
                    └──────┬────────┬─────────────┘
                           │        │
              ┌────────────┘        └─────────────┐
              ▼                                    ▼
    ┌────────────────────┐              ┌────────────────────┐
    │ MONGOOSE / MODELS  │              │ EXTERNAL SERVICES  │
    └─────────┬──────────┘              │                    │
              │                         │ Groq API           │
              ▼                         │ Brevo SMTP         │
    ┌────────────────────┐              │ Socket.IO          │
    │   MONGODB ATLAS    │              └────────────────────┘
    └────────────────────┘
5. Module Architecture

The application is divided into independent functional modules.

                         SHRAM SETU
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
 Authentication         Marketplace           Communication
       │                     │                     │
       ├─ Register           ├─ Jobs               ├─ Messages
       ├─ Login              ├─ Workers            ├─ Socket.IO
       ├─ JWT                ├─ Applications       └─ Notifications
       └─ OTP                └─ Direct Requests
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
           Reviews & Ratings            KAIYO
                │                         │
                ▼                         ▼
             Worker                  Groq API
             Ranking
Core Modules
Module	                      Responsibility
Authentication	                Registration, login, JWT and OTP
User	                         User information and profile
Worker	                      Worker registration and profiles
Job	                         Job creation and management
Application	                   Worker job applications
Job Request	                   Direct hiring
Review	                      Ratings and reviews
Messaging	                   Conversations and messages
Email	                         OTP and email communication
AI	KAIYO                       AI assistant
Badge	                         Worker achievement recognition
6. Project Structure
6.1 Frontend
client/
│
├── public/
│   └── seturyx-badge.png
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   ├── JobCard/
│   │   ├── WorkerCard/
│   │   ├── WorkerProfileModal/
│   │   ├── ApplyModal/
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Landing/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── WorkerRegister/
│   │   ├── Jobs/
│   │   ├── Applications/
│   │   ├── Profile/
│   │   └── ...
│   │
│   ├── utils/
│   │   └── getWorkerBadge.js
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── .env
6.2 Backend
server/
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── workerController.js
│   ├── jobController.js
│   ├── applicationController.js
│   ├── jobRequestController.js
│   ├── reviewController.js
│   └── aiController.js
│
├── models/
│   ├── User.js
│   ├── Worker.js
│   ├── Job.js
│   ├── Application.js
│   ├── JobRequest.js
│   ├── Review.js
│   └── Message.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── workerRoutes.js
│   ├── jobRoutes.js
│   ├── applicationRoutes.js
│   ├── jobRequestRoutes.js
│   ├── reviewRoutes.js
│   ├── messageRoutes.js
│   └── aiRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── utils/
│   └── sendEmail.js
│
├── server.js
└── .env
7. Database Design

Shram Setu uses MongoDB Atlas as its database.

Mongoose is used as the ODM layer.

The major collections/entities are:

┌───────────────┐
│     User      │
└───────┬───────┘
        │
        │
        ├───────────────┐
        │               │
        ▼               ▼
┌───────────────┐  ┌───────────────┐
│     Job       │  │    Worker     │
└───────┬───────┘  └───────┬───────┘
        │                  │
        │                  │
        ▼                  ▼
┌───────────────┐  ┌───────────────┐
│ Application   │  │    Review     │
└───────────────┘  └───────────────┘
        │
        ▼
┌───────────────┐
│  JobRequest   │
└───────────────┘


User ─────────────── Message ─────────────── User

MongoDB relationships are represented using ObjectId references rather than relational SQL foreign keys.

8. Detailed Schema Design
8.1 User Schema

The User collection stores account and authentication information.

Field	              Type	              Description
_id	              ObjectId	           Unique document identifier
firstName	        String	              Userfirst name
lastName	           String	              User last name
email	              String	              Unique email
password	           String	              Hashed password
role	              String	              User role
profilePic	        String	              Profile image
otp	              String	              Password reset OTP
otpExpiry	        Date	              OTP expiration

Email configuration:

email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
}
8.2 Worker Schema

Worker documents store professional information.

Field	                Type	                     Description
_id	                ObjectId	               Worker identifier
firstName	          String	                  Worker name
profilePic	          String	                  Profile picture
skills	             Array	                  Worker skills
location	             String	                  Worker location
description	          String	                  Worker description
age	                Number	                  Worker age
gender	             String	                  Worker gender
about	                String	                  Additional information
averageRating	       Number	                  Average rating
totalRatings	       Number	                  Total ratings
registrationType	    String	                  Individual/group

Registration type:

individual
group
8.3 Job Schema

A Job document represents a job posted by an employer.

Job
│
├── _id
├── title
├── description
├── category
├── location
├── budget
├── requirements
├── createdBy
└── status

createdBy references the user who created the job.

8.4 Application Schema

An Application connects a worker to a posted job.

Application
│
├── _id
├── job
├── worker
├── status
└── timestamps

Application status can represent states such as:

Pending
Accepted
Rejected
8.5 JobRequest Schema

JobRequest represents direct hiring.

JobRequest
│
├── _id
├── userId
├── worker
├── job information
├── status
├── workOTP
└── workOTPExpiry

The OTP fields are used for work completion verification.

8.6 Review Schema
Review
│
├── _id
├── worker
├── user
├── rating
├── comment
└── timestamps

Reviews contribute to worker rating statistics.

8.7 Message Schema

Messages represent communication between users.

Conceptually:

Message
│
├── _id
├── sender
├── receiver
├── content
└── timestamps

The exact field names should follow the final Message model implementation.

9. Authentication and Authorization Design
9.1 Registration
┌──────────┐
│   User   │
└────┬─────┘
     │
     ▼
Registration Form
     │
     ▼
Frontend Validation
     │
     ▼
POST /api/auth/register
     │
     ▼
Auth Controller
     │
     ├── Validate input
     ├── Check email
     ├── Hash password
     └── Create user
             │
             ▼
         MongoDB
9.2 Login
User
 │
 ▼
Email + Password
 │
 ▼
POST Login API
 │
 ▼
Auth Controller
 │
 ▼
Find User
 │
 ▼
Compare Password
 │
 ▼
Generate JWT
 │
 ▼
Return Token
 │
 ▼
Frontend
9.3 JWT Flow

Protected requests contain:

Authorization: Bearer <token>

The authentication middleware:

Reads the Authorization header.
Extracts the JWT.
Verifies the token.
Identifies the user.
Attaches authenticated user information to the request.
Allows the controller to execute.
9.4 Password Reset OTP
User
 │
 ▼
Forgot Password
 │
 ▼
Enter Email
 │
 ▼
Send OTP API
 │
 ▼
Find User
 │
 ▼
Generate 6-digit OTP
 │
 ▼
Save OTP + Expiry
 │
 ▼
Brevo SMTP
 │
 ▼
User Email
 │
 ▼
Enter OTP
 │
 ▼
Reset Password

The implemented password-reset flow stores the OTP with an expiry time of 2 minutes.

10. Middleware Design

Middleware provides common processing before controller execution.

Authentication Middleware
                  Request
                     │
                     ▼
              Auth Middleware
                     │
             ┌───────┴────────┐
             │                │
       Invalid Token       Valid Token
             │                │
             ▼                ▼
          401 Error       Controller

Middleware prevents unauthorized users from accessing protected resources.

11. API Design

Shram Setu follows REST-style API design.

11.1 Authentication APIs
Method	       Endpoint	                         Purpose
POST	          /api/auth/register	                Register user
POST	          /api/auth/login	                   Authenticate user
POST	          /api/auth/send-otp	                Send password reset OTP
POST	          /api/auth/reset-password	          Reset password
11.2 Worker APIs
Method	        Endpoint	                         Purpose
POST	           /api/workers/register	             Register worker
GET	           /api/users/top-workers	          Retrieve top workers
11.3 Application APIs
Method	        Endpoint	                         Purpose
GET	           /api/applications/admin	          Retrieve applications
PUT/PATCH	     /api/applications/:id/status	    Update application status

The exact HTTP method should match the final route implementation.

11.4 Messaging APIs
Method	         Endpoint                    	     Purpose
GET	            /api/messages/conversations	     Retrieve conversations
GET/POST	         /api/messages	                    Retrieve/create messages
11.5 Job APIs

The job module provides APIs for:

Creating jobs
Retrieving jobs
Updating jobs
Managing job status
Retrieving job details
11.6 Direct Hiring APIs

The direct hiring module provides APIs for:

Creating work requests
Retrieving requests
Accepting requests
Rejecting requests
Work completion
12. Frontend Design

The frontend uses React's component-based architecture.

12.1 Component Hierarchy
                         App
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
      Navbar            Pages            Shared
                          │             Components
          ┌───────────────┼───────────────┐
          │               │               │
        Home             Jobs        Applications
          │               │               │
     ┌────┼────┐       JobCard       WorkerProfile
     │    │    │          │              Modal
    Hero Categories   ApplyModal
     │
 TopRatedWorkers
     │
 WorkerCard
12.2 React State Management

useState manages component-level state.

Typical states include:

Loading
Error
Selected worker
Selected job
Modal visibility
Form values
AI response
Application status
12.3 useEffect

useEffect handles side effects such as API requests.

Component Mount
       │
       ▼
useEffect()
       │
       ▼
Axios Request
       │
       ▼
API Response
       │
       ▼
setState()
       │
       ▼
UI Re-render
12.4 Client-Side Routing

React Router provides client-side navigation.

Conceptual route structure:

/
├── /login
├── /register
├── /home
├── /jobs
├── /worker-register
├── /applications
└── /profile
13. Job Management Design
13.1 Job Creation
Employer
   │
   ▼
Job Form
   │
   ▼
Client Validation
   │
   ▼
POST Job API
   │
   ▼
Authentication Middleware
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
Job Created
13.2 Job Retrieval
User
 │
 ▼
Jobs Page
 │
 ▼
GET Jobs API
 │
 ▼
Job Controller
 │
 ▼
MongoDB
 │
 ▼
Job Documents
 │
 ▼
React
 │
 ▼
Job Cards
14. Worker Management Design

Workers can register on the platform.

Worker Registration
Worker
 │
 ▼
Worker Registration Form
 │
 ▼
POST /api/workers/register
 │
 ▼
Worker Controller
 │
 ▼
Worker Model
 │
 ▼
MongoDB
 │
 ▼
Worker Available

Workers become searchable after registration.

14.1 Worker Profile

Worker profiles contain information such as:

Name
Profile Picture
Skills
Location
Description
Age
Gender
About
Average Rating
Total Ratings
Registration Type
14.2 Worker Badge

The SETURYX badge is displayed when:

averageRating === 5
AND
totalRatings >= 100

Utility implementation:

export const getWorkerBadge = (worker) => {
    if (
        worker?.averageRating === 5 &&
        worker?.totalRatings >= 100
    ) {
        return {
            name: "SETURYX",
            slogan: "श्रमेव जयते",
            image: "/seturyx-badge.png"
        };
    }


    return null;
};
15. Application Management Design

Workers apply for jobs through the application system.

Worker
 │
 ▼
View Job
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
Application Model
 │
 ▼
MongoDB

Employers can review applications.

Employer
 │
 ▼
Applications
 │
 ├── Review
 │
 ├── Accept
 │
 └── Reject

Worker information can be populated when displaying the application.

Relevant fields include:

firstName
profilePic
skills
location
description
age
gender
about
averageRating
totalRatings
16. Direct Hiring Design

Direct hiring is separate from job applications.

Employer
    │
    ▼
Worker Search
    │
    ▼
Worker Card
    │
    ▼
Worker Profile
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
    ├──────────────► Accept
    │
    └──────────────► Reject

This allows an employer to hire a worker without waiting for job applications.

17. Work Completion OTP Design

OTP verification is used to confirm work completion.

17.1 Generate OTP

The implemented flow:

Find the JobRequest.
Check whether it is already completed.
Generate a six-digit OTP.
Save the OTP.
Save the OTP expiry.
Send the OTP through email.
JobRequest
    │
    ▼
Check Status
    │
    ├── Completed ──► Reject Request
    │
    ▼
Generate OTP
    │
    ▼
Save OTP + Expiry
    │
    ▼
Send Email

The work-completion OTP expires after 5 minutes.

17.2 OTP Verification
User
 │
 ▼
Enter OTP
 │
 ▼
Backend
 │
 ├── OTP Incorrect ──► Error
 │
 ├── OTP Expired ────► Error
 │
 └── OTP Valid
          │
          ▼
    Mark Work Completed
18. Rating and Review Design

After work completion, the employer can submit a rating and review.

Completed Work
      │
      ▼
Review Form
      │
      ├── Rating
      └── Comment
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
Worker Rating

Worker statistics include:

averageRating
totalRatings
19. Real-Time Messaging Design

Socket.IO is used for real-time communication.

                    Socket.IO
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
       User A                    User B
          │                         │
          ▼                         ▼
      React UI                  React UI

The messaging system combines:

REST APIs for retrieving/storing message data
Socket.IO for real-time communication
19.1 Messaging Architecture
User A
  │
  ▼
Messages UI
  │
  ├──────────── REST ──────────────┐
  │                               ▼
  │                         Express API
  │                               │
  │                               ▼
  │                           MongoDB
  │
  └────────── Socket.IO ──────────►
                                    │
                                    ▼
                                  User B
19.2 Socket Events

The implementation uses Socket.IO events such as:

join
userOnline
userOffline
receiveMessage

The socket layer is responsible for delivering real-time events to connected clients.

20. Email Service Design

Nodemailer is used with Brevo SMTP.

Backend Controller
       │
       ▼
sendEmail()
       │
       ▼
Nodemailer
       │
       ▼
Brevo SMTP
       │
       ▼
Recipient

The email service is reusable.

It supports important operations including:

Password reset OTP
Work completion OTP
20.1 SMTP Configuration

SMTP credentials are stored using environment variables.

BREVO_USER
BREVO_PASS

Credentials are not hard-coded into application logic.

21. KAIYO AI Design

KAIYO is the AI assistant integrated into Shram Setu.

It acts as a general-purpose AI assistant.

21.1 Supported Areas

KAIYO can assist with:

Worker hiring
Job descriptions
Budget estimation
Career guidance
Education
Programming
Technology
Languages
Productivity
Resume guidance
Interview preparation
General knowledge
Daily-life questions
21.2 KAIYO Architecture
                     USER
                       │
                       ▼
                 KAIYO CHAT UI
                       │
                       ▼
                  AI API Route
                       │
                       ▼
                 AI Controller
                       │
                       ▼
               Prompt Construction
                       │
                       ▼
                 Groq API
                       │
                       ▼
                Generated Response
                       │
                       ▼
                  KAIYO UI
21.3 Prompt Engineering

The backend constructs a prompt containing:

Assistant role
Behavioral instructions
User query
Required context
Response expectations

The resulting prompt is submitted to Groq.

This separates user input from the instructions controlling the assistant's behavior.

21.4 AI Error Handling
User Query
    │
    ▼
AI Controller
    │
    ▼
Groq API
    │
    ├── Success ──► Response
    │
    └── Failure ──► Server Error

Internal API credentials and provider-specific implementation details should not be exposed to the client.

22. Error Handling Design

The backend uses HTTP status codes to communicate request results.

Code	Meaning
200	Successful request
201	Resource successfully created
400	Invalid request
401	Authentication required/invalid
403	Access forbidden
404	Resource not found
409	Resource conflict
500	Internal server error

Example:

if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
}
22.1 Error Flow
Request
   │
   ▼
Validation
   │
   ▼
Authentication
   │
   ▼
Controller
   │
   ▼
Database / External API
   │
   ├── Success ─────► 2xx
   │
   ├── Bad Request ─► 400
   ├── Unauthorized ► 401
   ├── Forbidden ───► 403
   ├── Not Found ───► 404
   └── Exception ───► 500
23. Validation and Security Design
23.1 Authentication

Protected APIs require a valid JWT.

23.2 Password Protection

Passwords must not be stored in plain text.

The authentication layer hashes passwords before storage and verifies them during login.

23.3 Environment Variables

Sensitive values are stored in environment variables.

Typical configuration includes:

MONGODB_URI
JWT_SECRET
Groq_API_KEY
BREVO_USER
BREVO_PASS
23.4 Email Uniqueness

Email addresses are configured as unique in the User model.

Important implementation detail:

unique: true creates a MongoDB unique index; it is not itself a normal Mongoose validation rule. Therefore duplicate-key errors should also be handled by the backend.

23.5 OTP Security

OTP protection includes:

Random six-digit generation
Expiration
Server-side verification
Preventing completion of already completed work
24. Data Flow Design
24.1 General Request Flow
┌──────────────┐
│ React Client │
└──────┬───────┘
       │
       │ Axios
       ▼
┌──────────────┐
│ Express Route│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Middleware  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Mongoose   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   MongoDB    │
└──────┬───────┘
       │
       ▼
   Response
       │
       ▼
┌──────────────┐
│ React State  │
└──────┬───────┘
       │
       ▼
      UI
25. Sequence Diagrams
25.1 Login Sequence
 User          React         Express       MongoDB
  │              │              │              │
  │ Login        │              │              │
  ├─────────────►│              │              │
  │              │ POST /login  │              │
  │              ├─────────────►│              │
  │              │              │ Find User    │
  │              │              ├─────────────►│
  │              │              │◄─────────────┤
  │              │              │              │
  │              │              │ Verify Pass  │
  │              │              │              │
  │              │              │ Generate JWT │
  │              │◄─────────────┤              │
  │◄─────────────┤              │              │
25.2 Worker Registration
Worker       React       Express       MongoDB
  │            │            │             │
  │ Register   │            │             │
  ├───────────►│            │             │
  │            │ POST       │             │
  │            ├───────────►│             │
  │            │            │ Validate    │
  │            │            │             │
  │            │            │ Create Worker│
  │            │            ├────────────►│
  │            │            │◄────────────┤
  │            │◄───────────┤             │
  │◄───────────┤            │             │
25.3 Job Application
Worker       React       Express       MongoDB
  │            │            │             │
  │ Apply      │            │             │
  ├───────────►│            │             │
  │            │ POST Apply │             │
  │            ├───────────►│             │
  │            │            │ Create App  │
  │            │            ├────────────►│
  │            │            │◄────────────┤
  │            │◄───────────┤             │
  │◄───────────┤            │             │
25.4 Direct Hiring
Employer      React       Express       MongoDB      Worker
   │            │            │             │           │
   │ Search     │            │             │           │
   ├───────────►│            │             │           │
   │            │ GET        │             │           │
   │            ├───────────►│             │           │
   │            │            │ Find Worker │           │
   │            │            ├────────────►│           │
   │            │            │◄────────────┤           │
   │            │◄───────────┤             │           │
   │            │            │             │           │
   │ Send Request│            │             │           │
   │───────────►│            │             │           │
   │            │ POST       │             │           │
   │            ├───────────►│             │           │
   │            │            │ Create      │           │
   │            │            │ JobRequest  │           │
   │            │            ├────────────►│           │
   │            │            │             │           │
   │            │            │────────────────────────►│
   │            │            │             │   Request │
25.5 Work Completion OTP
Employer      Backend       MongoDB       Brevo       User
   │             │             │            │           │
   │ Request OTP │             │            │           │
   ├────────────►│             │            │           │
   │             │ Find Request│            │           │
   │             ├────────────►│            │           │
   │             │◄────────────┤            │           │
   │             │ Generate OTP│            │           │
   │             │             │            │           │
   │             │ Save OTP    │            │           │
   │             ├────────────►│            │           │
   │             │             │            │           │
   │             │ Send Email  │            │           │
   │             ├─────────────────────────►│           │
   │             │             │            ├──────────►│
   │             │             │            │           │
   │             │◄────────────────────────┴───────────┤
   │             │             │            │           │
   │             │ Verify OTP  │            │           │
   │             │◄────────────────────────────────────┤
   │             │             │            │           │
   │             │ Mark Completed            │           │
25.6 KAIYO AI
User          React        Express        Groq
 │              │             │             │
 │ Question     │             │             │
 ├─────────────►│             │             │
 │              │ POST AI     │             │
 │              ├────────────►│             │
 │              │             │ Build Prompt│
 │              │             │             │
 │              │             │ Generate    │
 │              │             ├────────────►│
 │              │             │◄────────────┤
 │              │◄────────────┤             │
 │◄─────────────┤             │             │
26. Component Interaction
26.1 Frontend Component Interaction
                          App
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Navbar        Pages       Modals
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
            Home          Jobs     Applications
             │             │             │
       ┌─────┼─────┐       │             │
       ▼     ▼     ▼       ▼             ▼
     Hero Categories Workers JobCard WorkerProfile
                       │
                       ▼
                   WorkerCard
26.2 Backend Component Interaction
                     Express Server
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
              Routes    Middleware  Socket.IO
                │
                ▼
           Controllers
                │
        ┌───────┼────────┐
        │       │        │
        ▼       ▼        ▼
      Models  Services  AI
        │       │        │
        ▼       ▼        ▼
    MongoDB   Brevo    Groq
27. Design Decisions
27.1 MongoDB

MongoDB is suitable for the platform because worker profiles, skills, jobs, applications, reviews and messaging data can have flexible document structures.

27.2 Mongoose

Mongoose provides:

Schema definitions
Validation
MongoDB interaction
ObjectId references
Query functionality
27.3 React

React provides reusable components and state-driven UI rendering.

27.4 Express

Express provides the REST API layer and allows routes, middleware and controllers to remain separated.

27.5 JWT

JWT provides stateless authentication between the frontend and backend.

27.6 Socket.IO

Socket.IO provides real-time event-based communication.

It is particularly suitable for messaging and live application events.

27.7 Groq API

Using an external LLM API allows KAIYO to provide generative AI capabilities without hosting an AI model within the application infrastructure.

28. Deployment Design
                         INTERNET
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
             VERCEL                   RENDER
                │                       │
                │                 Node.js Server
                │                 Express Backend
                │                       │
                │          ┌────────────┼─────────────┐
                │          │            │             │
                │          ▼            ▼             ▼
                │      MongoDB         Groq        Brevo
                │       Atlas          API          SMTP
                │
                ▼
             React App
28.1 Frontend Deployment

The React/Vite frontend is deployed through Vercel.

28.2 Backend Deployment

The Node.js/Express backend is deployed through Render.

28.3 Database Deployment

MongoDB is hosted using MongoDB Atlas.

28.4 Environment Configuration

Production secrets are supplied through environment variables rather than committed to source control.

29. Future Improvements

The current architecture can be extended with:

Advanced worker verification.
Location-based worker search.
Worker availability management.
Online payment integration.
Advanced notification infrastructure.
Job tracking.
AI-assisted job creation.
AI-based worker-job matching.
Structured AI responses for selected workflows.
Worker analytics.
Fraud detection.
Mobile application.
Multi-language support.
Expanded worker achievement levels.
Improved recommendation algorithms.
30. Appendix
A. Core Entities
Entity	              Purpose
User	                 Account and authentication
Worker	              Worker profile
Job	                 Employer-created job
Application	           Worker application
JobRequest	           Direct hiring request
Review	              Worker rating/review
Message	              User communication
B. Core Business Rules
Rule	                   Description
Unique Email	          User email must be unique
Worker Registration	    Registered workers become available for discovery
Worker Types	          Individual and group workers are supported
Application	             Workers can apply to posted jobs
Direct Hiring	          Employers can directly send work requests
OTP	                   Work completion uses a time-limited OTP
Password Reset	          Password recovery uses an OTP
Rating	                Completed work can receive ratings
SETURYX	                5-star workers with at least 100 ratings qualify
Authentication	Protected operations require valid authentication
C. Important OTP Rules
Password Reset
OTP Length: 6 digits
Expiry: 2 minutes
Purpose: Password reset
Delivery: Email
Work Completion
OTP Length: 6 digits
Expiry: 5 minutes
Purpose: Work completion verification
Delivery: Email
D. SETURYX Badge Rule
IF averageRating === 5
AND totalRatings >= 100


THEN


Display:
SETURYX
श्रमेव जयते
E. External Integrations
┌─────────────────────┬─────────────────────────────┐
│ Service             │ Purpose                     │
├─────────────────────┼─────────────────────────────┤
│ Groq API            │ KAIYO AI                    │
│ Brevo SMTP          │ Email delivery              │
│ Socket.IO           │ Real-time communication     │
│ MongoDB Atlas       │ Cloud database              │
│ Vercel              │ Frontend deployment         │
│ Render              │ Backend deployment          │
└─────────────────────┴─────────────────────────────┘
F. Assessment-Relevant Implementation Mapping
Concept	                               Shram Setu Implementation
LLM API Integration	                      Groq API
Prompt Engineering	                      KAIYO prompt construction
HTTP Status Codes	                         Express API responses
Middleware	                               JWT authentication middleware
REST API	                                  Express REST endpoints
Server-side Error Handling	                Controller error handling
System Design	                            React + Express + MongoDB + external services
Environment Variables	                   API keys, DB URI, JWT secret, SMTP credentials
Async API Fetching	                      Axios
Client-side Routing	                      React Router
async/await	                               API and database operations
React Components	                         Reusable UI components
useEffect	                               API/side effects
useState	                                  Component state
MongoDB CRUD	                            Mongoose operations
MongoDB Schema Modeling	                   Mongoose schemas
Real-time Communication	                   Socket.IO
Email Integration	                         Nodemailer + Brevo
Important note

Shram Setu uses MongoDB, not PostgreSQL, for its production database. Therefore, SQL-specific concepts such as relational PK/FK design and SQL JOINs should not be represented as implemented Shram Setu database features in this LLD. If those concepts are required by your assessment rubric, they should be prepared separately for the viva as conceptual knowledge rather than falsely documenting them as part of the system.

End of LLD

Shram Setu — Low-Level Design Document
Version 1.0.0