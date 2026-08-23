Product Requirements Document (PRD)
Shram Setu — AI-Powered Workforce Discovery & Job Marketplace

Problem Statement

India has a large workforce of skilled and semi-skilled workers across household services, construction, agriculture, factories, maintenance, and other local industries. However, finding reliable workers and finding suitable work often depends on informal networks, word of mouth, local agents, or fragmented communication.

Workers may struggle to showcase their skills, experience, ratings, and availability to potential employers. Employers, meanwhile, may struggle to discover suitable workers, compare profiles, communicate with them, and manage hiring requests efficiently.

Shram Setu addresses this gap by providing a digital workforce marketplace where employers can either post jobs for workers to apply or directly discover workers and send work requests. The platform also provides worker profiles, applications, ratings, real-time communication, OTP-based work-completion verification, email services, and an AI assistant named KAIYO for general assistance and workforce-related guidance.

Document Information
Field	                             Details
Version	                          1.0.0
Status	                          Completed – Project Assessment
Created	                          2026-03-19
Last Updated	                    2026-08-21
Document Type	                    Product Requirements Document
Project	                          Shram Setu
Product Type	                    Workforce Marketplace & Job Management Platform
Tech Stack	                       React · Vite · Tailwind CSS · Node.js · Express · MongoDB · Mongoose · JWT ·                                  .Socket.IO · Nodemailer · Brevo SMTP · Groq API
Frontend Deployment	              Vercel
Backend Deployment	              Render
Database	                          MongoDB Atlas
Table of Contents
Executive Summary
Business Problem
User Personas
User Pain Points
Project Goals
Success Metrics
Functional Requirements
Non-Functional Requirements
User Stories
MVP Scope
Future Scope
Risks and Assumptions
Acceptance Criteria
Database Design
User Flow
Architecture
API Endpoints
Glossary
Appendix
1. Executive Summary

Shram Setu is a digital workforce marketplace designed to connect people who need workers with workers looking for employment opportunities.

The platform supports multiple categories of work, including:

Household services
Construction
Agriculture
Factory and manufacturing work
Maintenance
Skilled trades
Local service work
Other worker-defined skills and services

The platform supports two primary hiring models:

Model 1 — Job Posting

An employer creates a job containing information such as:

Job title
Description
Required skills
Location
Budget
Other job-related requirements

Workers can browse available jobs and submit applications.

Model 2 — Direct Worker Hiring

An employer can search and browse registered workers directly, inspect their profiles, skills, ratings, experience and other available information, and send a work request.

This dual approach allows Shram Setu to support both job-centric hiring and worker-centric hiring.

The platform also supports:

Worker and employer profiles
Individual workers
Worker groups
Worker discovery
Job applications
Hiring requests
Application status management
Ratings and reviews
Real-time communication
Work completion verification using OTP
Password reset using OTP
Email notifications
AI assistance through KAIYO
Worker recognition through the SETURYX badge
Administrative application management
2. Business Problem
2.1 Existing Problem

The local workforce ecosystem frequently operates through informal channels.

Employers may depend on:

Personal contacts
Local references
Contractors
Word of mouth
Unstructured messaging

Workers may depend on:

Local contacts
Friends and family
Contractors
Physical advertisements
Repeated visits to workplaces

These approaches make it difficult to:

Discover suitable workers efficiently.
Showcase worker skills and experience.
Compare different workers.
Maintain a record of ratings and reviews.
Discover suitable job opportunities.
Manage applications systematically.
Communicate efficiently.
Verify completion of work.
Establish a structured digital identity for workers.
2.2 Proposed Solution

Shram Setu provides a centralized platform where employers and workers can interact digitally.

The system allows:

Employers →

Search workers
View worker profiles
Post jobs
Receive applications
Send direct work requests
Communicate with workers
Manage hiring
Rate completed work

Workers →

Create worker profiles
Display skills
Find jobs
Apply for jobs
Receive work requests
Communicate with employers
Complete assigned work
Build ratings and reputation
3. User Personas
3.1 Worker
Attribute	                       Description
Role	                             Worker
Objective	                       Find suitable employment opportunities
Primary Activities	              Create profile, list skills, browse jobs, apply, receive requests
Needs	                             Visibility, opportunities, reputation, communication
Pain Point	                       Difficulty finding reliable work and showcasing skills

Workers can register as individuals or as part of a worker group.

3.2 Employer / Job Poster
Attribute	                 Description
Role	                       Employer
Objective	                 Find suitable workers and hire them
Primary Activities	        Search workers, post jobs, review applications, send requests
Needs	                       Worker discovery, trustworthy profiles, communication
Pain Point	                 Difficulty finding appropriate workers quickly
3.3 Administrator
Attribute	                 Description
Role	                       Administrator
Objective	                 Manage and monitor platform activities
Primary Activities	        View applications and manage application status
Needs	                       Visibility into platform activities
Pain Point	                 Managing workforce activity without a centralized system
3.4 General AI User

KAIYO is available as a general AI assistant for users who need assistance with topics such as:

Career guidance
Education
Job descriptions
Worker hiring guidance
Budget estimation
Programming
Technology
Languages
Productivity
General knowledge
Daily-life questions
4. User Pain Points
ID	            Pain Point
PP-01	         Workers have limited digital visibility
PP-02	         Employers struggle to discover suitable workers
PP-03  	      Job opportunities are fragmented across informal channels
PP-04	         Workers have difficulty demonstrating skills and experience
PP-05	         Employers cannot easily compare worker profiles
PP-06	         Job applications can become difficult to track
PP-07	         Communication between workers and employers may be fragmented
PP-08	         There is limited structured reputation information
PP-09	         Work completion may lack a simple verification mechanism
PP-10	         Users may require assistance creating job descriptions or understanding hiring-related tasks
5. Project Goals
5.1 Primary Goals
Create a centralized workforce marketplace.
Enable workers to digitally showcase their skills.
Allow employers to discover suitable workers.
Support both job posting and direct worker hiring.
Provide structured application management.
Enable worker-employer communication.
Build a reputation system through ratings and reviews.
Provide OTP-based work completion verification.
Provide password recovery through OTP.
Integrate an AI assistant into the platform.
Provide a responsive and accessible user interface.
Maintain secure authentication and API communication.
5.2 Technical Goals

The project also demonstrates:

RESTful API design
MongoDB schema modeling
CRUD operations
Authentication middleware
JWT-based authorization
React component architecture
Client-side routing
Asynchronous API communication
Real-time communication
External API integration
Environment-variable based secret management
Server-side error handling
AI prompt engineering
6. Success Metrics
Metric	                   Target
Worker registration	       Users can successfully create worker profiles
Job creation	             Employers can successfully create job postings
Job discovery	             Workers can discover available jobs
Worker discovery	          Employers can discover registered workers
Application completion	    Workers can submit applications
Hiring requests	          Employers can send direct requests
Communication	             Users can communicate through the platform
Work verification	          Completed work can be verified using OTP
Reputation	                Completed work can generate ratings/reviews
AI availability	          KAIYO can process supported user queries
Authentication	             Protected resources reject unauthorized requests
Deployment	                Frontend and backend operate through deployed environments
7. Functional Requirements
7.1 Authentication and Authorization
ID	       Requirement	                                                                           Priority
FR-01	    Users shall be able to register on the platform.	                                       High
FR-02	    Users shall be able to log in securely.	                                                High
FR-03	    The system shall use JWT-based authentication.	                                          High
FR-04	    Protected API routes shall verify authentication.	                                       High
FR-05	    Users shall be able to reset their password using OTP verification.	                     High
FR-06	    Email addresses shall be uniquely maintained for users.	                                 High
FR-07	    Authentication credentials and secrets shall be stored using environment variables.	   High
7.2 Worker Registration
ID	       Requirement	                                                                           Priority
FR-08	    Users shall be able to register as workers.	                                             High
FR-09	    Worker registration shall support individual workers.	                                 High
FR-10	    Worker registration shall support worker groups.	                                       High
FR-11	    Registered workers shall become discoverable through the worker marketplace.	            High
FR-12	    Workers shall be able to provide skills and profile information.	                        High
FR-13	    Workers shall be able to provide location information.	                                 High
FR-14	    Workers shall be able to provide profile descriptions/about information.	               Medium
FR-15	    Workers shall be able to maintain profile information.	                                 High
7.3 Worker Discovery
ID	      Requirement	                                                                              Priority
FR-16	   Employers shall be able to browse registered workers.	                                    High
FR-17	   Worker cards shall display relevant worker information.	                                 High
FR-18	   Employers shall be able to view detailed worker profiles.	                              High
FR-19	   Worker profiles shall display skills where available.	                                    High
FR-20	   Worker profiles shall display ratings where available.	                                 High
FR-21	   Employers shall be able to use worker information to make hiring decisions.	            High
7.4 Worker Ratings and Reputation
ID	      Requirement	                                                                            Priority
FR-22	   Completed work shall support rating/review functionality.	                            High
FR-23	   Worker ratings shall contribute to the worker's average rating.	                      High
FR-24	   The system shall maintain the number of ratings received by a worker.	                High
FR-25	   Highly rated workers can receive the Shram Setu SETURYX recognition badge                            when eligibility conditions are met.                                              	            Medium
SETURYX Recognition

A worker qualifies for the current SETURYX badge when:

Average rating = 5
Total ratings ≥ 100

Badge identity:

SETURYX

श्रमेव जयते

7.5 Job Management
ID	        Requirement	                                                                       Priority
FR-26	     Employers shall be able to create job postings.	                                   High
FR-27	     Job postings shall contain relevant job information.	                             High
FR-28	     Workers shall be able to browse jobs.	                                            High
FR-29	     Workers shall be able to apply for suitable jobs.	                                High
FR-30	     Employers shall be able to view submitted applications.	                          High
FR-31	     Employers shall be able to update application status.	                             High
FR-32	     Applications shall support statuses such as pending, accepted and rejected.	        High
7.6 Direct Work Requests
ID	        Requirement	                                                                       Priority
FR-33	     Employers shall be able to select workers directly.	                                High
FR-34	     Employers shall be able to send work requests to workers.	                          High
FR-35	     Workers shall be able to view received work requests.	                             High
FR-36	     Work request status shall be maintained by the system.	                             High
FR-37	     Employers and workers shall be able to communicate regarding work requests.	        High
7.7 Work Completion Verification
ID	        Requirement	                                                                       Priority
FR-38	     The system shall generate a work-completion OTP.	                                   High
FR-39      The OTP shall have an expiry period.	                                               High
FR-40	     The system shall send the OTP through email.	                                      High
FR-41	     The OTP shall be used to verify work completion.	                                   High
FR-42	     Completed work shall not be completed repeatedly once its status is finalized.	     High

The current work-completion OTP uses a 6-digit OTP with a limited validity period.

7.8 Real-Time Communication
ID	        Requirement	                                                                       Priority
FR-43   	  Users shall be able to communicate through the platform.	                          High
FR-44	     Real-time communication shall use Socket.IO.	                                      High
FR-45	     Communication shall support worker-employer interaction related to work. 	        High
7.9 Email Services
ID	        Requirement	                                                                       Priority
FR-46	     The system shall send password-reset OTP emails.	                                   High
FR-47	     The system shall send work-completion OTP emails.	                                High
FR-48	     Email delivery shall be handled through an SMTP service.	                          High
FR-49	     Email configuration shall be stored using environment variables.	                 High

The project uses Nodemailer with Brevo SMTP for email delivery.

7.10 KAIYO AI Assistant
ID	       Requirement	                                                                       Priority
FR-50	    The system shall provide an AI assistant named KAIYO.	                             High
FR-51	    KAIYO shall accept natural-language user questions.	                                High
FR-52	    KAIYO shall use an external LLM API.	                                               High
FR-53	    KAIYO shall provide general-purpose assistance.	                                   High
FR-54	    KAIYO shall support workforce-related queries.	                                      High
FR-55	    KAIYO shall support job-description and hiring-related assistance.	                 Medium
FR-56	    KAIYO shall support career and educational guidance.	                                Medium
FR-57	    AI API credentials shall be stored securely using environment variables.	           High

KAIYO is designed as a general AI assistant rather than a database-connected conversational agent.

7.11 Administration
ID	       Requirement	                                                                        Priority
FR-58	    Administrators shall be able to view applications.	                                 High
FR-59	    Administrators shall be able to inspect application information.	                     High
FR-60	    Administrators shall be able to update application status.	                           High
FR-61	    Administrators shall be able to inspect relevant worker information.	               Medium
8. Non-Functional Requirements
8.1 Performance
ID	      Requirement
NFR-01	API requests should respond within an acceptable time under normal workload.
NFR-02	The frontend should avoid unnecessary API requests.
NFR-03	Real-time communication should provide low-latency message delivery.
8.2 Security
ID	      Requirement
NFR-04	Authentication shall use JWT tokens.
NFR-05	Protected endpoints shall use authentication middleware.
NFR-06	Secrets shall not be hardcoded in source code.
NFR-07	OTPs shall expire after a limited period.
NFR-08	Password-reset functionality shall require OTP verification.
8.3 Reliability
ID	      Requirement
NFR-09	Server-side errors shall be handled using appropriate HTTP responses.
NFR-10	External service failures should not crash the entire application.
NFR-11	Database operations shall use asynchronous processing.
8.4 Scalability
ID	      Requirement
NFR-12	Backend APIs shall be separated into modular routes/controllers.
NFR-13	MongoDB shall support growth in users, workers, jobs and applications.
NFR-14	Socket.IO shall support real-time communication between connected users.
8.5 Maintainability
ID	      Requirement
NFR-15	React functionality shall be divided into reusable components.
NFR-16	Backend functionality shall be separated into routes, controllers, models and middleware.
NFR-17	Environment-specific configuration shall be maintained through environment variables.
8.6 Usability
ID	      Requirement
NFR-18	The interface should be responsive.
NFR-19	Major actions should provide understandable feedback.
NFR-20	Worker and job information should be presented clearly.
9. User Stories
Worker Stories
ID	      User Story
US-101	As a worker, I want to register so that I can find work through the platform.
US-102	As a worker, I want to create a profile so employers can understand my skills.
US-103	As a worker, I want to list my skills so that I can be discovered for suitable work.
US-104	As a worker, I want to browse available jobs so that I can find suitable opportunities.
US-105	As a worker, I want to apply for jobs so that employers can consider me.
US-106	As a worker, I want to receive direct work requests from employers.
US-107	As a worker, I want to communicate with employers regarding work.
US-108	As a worker, I want to build ratings and reviews so that my reputation improves.
Employer Stories
ID	      User Story
US-109	As an employer, I want to create a job so workers can apply.
US-110	As an employer, I want to browse workers so I can find suitable candidates.
US-111	As an employer, I want to view worker profiles before hiring.
US-112	As an employer, I want to send a direct work request to a worker.
US-113	As an employer, I want to review job applications.
US-114	As an employer, I want to accept or reject applications.
US-115	As an employer, I want to communicate with workers.
US-116	As an employer, I want work completion to be verified.
AI Stories
ID	      User Story
US-117	As a user, I want to ask KAIYO general questions.
US-118	As an employer, I want help creating job descriptions.
US-119	As a user, I want career and educational guidance from KAIYO.
US-120	As a user, I want workforce-related guidance through an AI assistant.
Administrator Stories
ID	      User Story
US-121	As an administrator, I want to view applications.
US-122	As an administrator, I want to update application status.
US-123	As an administrator, I want to inspect worker/application information.
10. MVP Scope
10.1 Included

The Shram Setu MVP includes:

User registration
User authentication
JWT authorization
Worker registration
Individual worker registration
Worker group registration
Worker profiles
Worker skills
Worker discovery
Job creation
Job browsing
Job applications
Application status management
Direct work requests
Worker-employer communication
Ratings and reviews
Work completion OTP
Password-reset OTP
Email communication
KAIYO AI assistant
Administrative application management
SETURYX worker recognition
MongoDB persistence
Responsive React frontend
RESTful Node/Express backend
Socket.IO real-time communication
Vercel/Render deployment
10.2 Explicitly Outside Current MVP

The following should not be presented as currently implemented unless added later:

Online payment gateway
Automated background verification
Government identity verification
GPS-based live worker tracking
Advanced recommendation engine
Automated dispute resolution
Full payroll management
PostgreSQL-based relational persistence
11. Future Scope

Potential future improvements include:

11.1 Payment Integration

Integrate secure online payments between employers and workers.

11.2 Identity Verification

Introduce optional verification mechanisms to increase trust.

11.3 Advanced Worker Matching

Use machine-learning or AI-based matching between:

Job requirements ↔ Worker skills

11.4 Location Intelligence

Introduce location-aware worker discovery and distance-based matching.

11.5 Worker Availability

Workers could indicate:

Available
Busy
Available from a specific date
11.6 Advanced Notifications

Push notifications for:

New jobs
Applications
Work requests
Messages
Work completion
Ratings
11.7 Dispute Management

Introduce structured workflows for handling disputes between employers and workers.

11.8 Worker Verification

Verified identity or skill certifications could improve trust.

11.9 AI-Powered Recommendations

KAIYO could eventually use platform data to provide personalized job and worker recommendations, subject to appropriate privacy and authorization controls.

12. Risks and Assumptions
12.1 Risks
ID	     Risk	                             Mitigation
R-01	  Fake worker profiles	              Introduce future identity verification
R-02 	  Fake ratings	                       Restrict ratings to valid completed work
R-03	  External AI API downtime	           Implement server-side error handling and fallback messaging
R-04	  Email service failure	              Handle SMTP errors gracefully
R-05	  Unauthorized API access	           JWT authentication middleware
R-06	  Database connectivity problems	     Server-side error handling
R-07	  Real-time connection failures	     Handle Socket.IO connection/disconnection events
R-08	  Exposure of secrets	              Environment variables
12.2 Assumptions
Users provide accurate registration information.
Workers provide accurate skill information.
Employers provide accurate job information.
Users have internet connectivity.
Email services are available for OTP delivery.
External AI services remain accessible within their usage limits.
MongoDB Atlas remains available for production database access.
Users are responsible for their interactions and hiring decisions.
13. Acceptance Criteria
Authentication
 User can register.
 User can log in.
 Invalid credentials are rejected.
 Protected routes require authentication.
 Password reset can be initiated using email.
 Password-reset OTP expires.
Worker
 User can register as a worker.
 Worker profile can be created.
 Individual worker registration works.
 Group worker registration works.
 Worker appears in worker discovery after registration.
 Worker skills and profile information are displayed.
Jobs
 Employer can create a job.
 Worker can view jobs.
 Worker can apply.
 Employer can view applications.
 Application status can be updated.
Direct Hiring
 Employer can browse workers.
 Employer can open worker profile.
 Employer can send work request.
 Worker can receive/view request.
Communication
 Users can communicate.
 Socket.IO connection can be established.
 Messages can be exchanged in real time.
Work Completion
 Work completion OTP can be generated.
 OTP is sent through email.
 OTP expires.
 Valid OTP can verify completion.
 Already completed work cannot be completed again.
Ratings
 Completed work can produce a rating.
 Worker average rating is maintained.
 Total ratings are maintained.
 Eligible workers receive SETURYX recognition.
AI
 KAIYO accepts user prompts.
 Prompt is sent to the configured LLM API.
 AI response is returned to the client.
 API failures are handled gracefully.
14. Database Design

Shram Setu uses MongoDB with Mongoose as its primary database.

The application follows a document-oriented data model rather than a relational SQL schema.

14.1 Core Data Entities

The primary domain entities include:

User
Worker
Job
Application
Job Request
Rating/Review
Authentication/OTP-related information
Communication-related data
14.2 User

The User entity represents a registered platform account.

Typical information includes:

Field	                     Purpose
_id	                     MongoDB document identifier
firstName	               User's first name
email	                     Unique user email
password	                  Authentication credential
role	                     Identifies user type
otp	                     Temporary OTP where applicable
otpExpiry	               OTP expiration timestamp
Other profile fields	      User information

The email is intended to be unique.

14.3 Worker

The Worker entity contains workforce-specific information.

Important attributes include:

Worker identity
Profile picture
Skills
Location
Description
About information
Age
Gender
Registration type
Rating information
Number of ratings

The worker registration type supports:

individual
group
14.4 Job

The Job entity represents an employment opportunity created by an employer.

A job can contain information such as:

Job title
Job description
Skills
Location
Budget
Employer information
Job status
Other job requirements
14.5 Application

The Application entity represents a worker applying for a posted job.

Conceptually:

Worker
   ↓
Application
   ↓
Job
   ↓
Employer

Application status is maintained to represent the hiring process.

Example statuses include:

Pending
Accepted
Rejected
14.6 Job Request

A Job Request represents direct hiring initiated by an employer toward a worker.

Conceptually:

Employer
    ↓
Job Request
    ↓
Worker

A request can contain work-related details and completion information.

Work completion OTP-related fields include:

workOTP
workOTPExpiry
14.7 Rating

Ratings provide reputation information about workers.

The system maintains information such as:

Average rating
Total number of ratings

This information is used to display worker reputation and determine SETURYX eligibility.

15. User Flow
15.1 General Registration Flow
User
  ↓
Registration
  ↓
Account Created
  ↓
Login
  ↓
Authenticated Platform
15.2 Worker Flow
User
  ↓
Register as Worker
  ↓
Choose Registration Type
  ↓
Individual / Group
  ↓
Enter Worker Information
  ↓
Worker Profile Created
  ↓
Worker Appears in Discovery
  ↓
Browse Jobs / Receive Requests
  ↓
Apply / Accept Work
  ↓
Communicate
  ↓
Complete Work
  ↓
OTP Verification
  ↓
Rating / Review
15.3 Job Posting Flow
Employer
   ↓
Create Job
   ↓
Enter Job Details
   ↓
Submit
   ↓
Job Stored in MongoDB
   ↓
Workers Discover Job
   ↓
Worker Applies
   ↓
Employer Reviews Application
   ↓
Accept / Reject
15.4 Direct Hiring Flow
Employer
   ↓
Browse Workers
   ↓
Open Worker Profile
   ↓
Review Skills / Rating / Information
   ↓
Send Work Request
   ↓
Worker Receives Request
   ↓
Communication
   ↓
Work
   ↓
Completion OTP
   ↓
Completion
   ↓
Rating
15.5 Password Reset Flow
User
  ↓
Forgot Password
  ↓
Enter Email
  ↓
Server Finds User
  ↓
Generate OTP
  ↓
Store OTP + Expiry
  ↓
Send Email
  ↓
User Enters OTP
  ↓
OTP Validation
  ↓
Password Reset
16. Architecture
16.1 High-Level Architecture
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + Vite Client │
                    │   Tailwind CSS      │
                    └──────────┬──────────┘
                               │
                       HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
      ┌───────────────┐                  ┌──────────────┐
      │   MongoDB     │                  │  Socket.IO   │
      │   Atlas       │                  │ Real-time    │
      └───────────────┘                  │ Communication│
                                         └──────────────┘
              │
              │
       ┌──────┴───────────┐
       ▼                  ▼
┌───────────────┐  ┌─────────────────┐
│ Email Service │  │  Groq AI API    │
│ Nodemailer +  │  │     KAIYO       │
│ Brevo SMTP    │  └─────────────────┘
└───────────────┘
16.2 Frontend

The frontend is built using:

React
Vite
Tailwind CSS
Axios
React Router

Responsibilities include:

Rendering user interfaces
Client-side routing
Managing UI state
Calling backend APIs
Handling asynchronous responses
Displaying jobs and workers
Managing forms
Displaying application/request status
AI chat interface
Real-time communication interface
16.3 Backend

The backend uses:

Node.js
Express

Responsibilities include:

REST API
Authentication
Authorization
Business logic
Validation
Database operations
OTP generation
Email communication
AI API communication
Application management
Job management
Worker management
Real-time communication integration
16.4 Database

MongoDB Atlas stores application data.

Mongoose provides:

Schema modeling
Validation
Database interaction
Document querying
Population of referenced information
16.5 Authentication

Authentication uses JWT.

General flow:

Login
  ↓
Credentials Validation
  ↓
JWT Generated
  ↓
Client Stores Token
  ↓
Token Sent with Protected Requests
  ↓
Authentication Middleware
  ↓
Request Authorized
16.6 Middleware

Backend middleware is responsible for concerns such as:

Authentication
Request processing
Authorization
Error handling
API-level request control

Authentication middleware validates JWT credentials before allowing access to protected resources.

16.7 AI Integration

KAIYO communicates with the configured Groq API through the backend.

User
 ↓
KAIYO UI
 ↓
Frontend API Request
 ↓
Backend AI Controller
 ↓
Groq API
 ↓
AI Response
 ↓
Backend
 ↓
Frontend
 ↓
User

The API key is maintained through an environment variable rather than exposed directly in frontend code.

16.8 Email Integration
Backend
   ↓
Nodemailer
   ↓
Brevo SMTP
   ↓
User Email

Email is used for OTP-based workflows.

16.9 Deployment Architecture
                  Internet
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       Vercel                 Render
      Frontend                Backend
          │                     │
          │              ┌──────┴──────┐
          │              │             │
          │              ▼             ▼
          │          MongoDB       External APIs
          │           Atlas        Groq / SMTP
          │
          └────── HTTPS API ────────►
17. API Endpoints

The following endpoint categories represent the Shram Setu backend API structure established during development.

17.1 Authentication
Method	         Endpoint	                      Purpose
POST	            /api/auth/register	          Register user
POST	            /api/auth/login	             Authenticate user
POST	            /api/auth/send-otp	          Send password-reset OTP
POST	            /api/auth/reset-password	    Reset password
17.2 Workers
Method	         Endpoint 	                   Purpose
POST	            /api/workers/register	       Register worker
GET	            /api/workers	                Retrieve workers
GET	            /api/workers/top-workers	    Retrieve top-rated workers
GET	            /api/workers/:id	             Retrieve worker information
PUT	            /api/workers/:id	             Update worker information

Exact endpoint availability can vary with the final deployed route configuration.

17.3 Jobs
Method	         Endpoint	                      Purpose
POST	            /api/jobs	                   Create job
GET	            /api/jobs	                   Retrieve jobs
GET	            /api/jobs/:id	                Retrieve specific job
PUT	            /api/jobs/:id	                Update job
DELETE	         /api/jobs/:id	                Delete job
17.4 Applications
Method	         Endpoint	                      Purpose
POST	            /api/applications	             Submit application
GET	            /api/applications	             Retrieve applications
GET	            /api/applications/admin	       Retrieve applications for administration
PUT/PATCH	      /api/applications/:id/status	 Update application status
17.5 Work Requests
Method	         Endpoint	                      Purpose
POST	            /api/job-requests	             Create direct work request
GET	            /api/job-requests	             Retrieve requests
PUT/PATCH	      /api/job-requests/:id	       Update request
POST	            /api/job-requests/:id/otp	    Generate work-completion OTP
POST	            /api/job-requests/:id/complete Verify/complete work
17.6 AI
Method	         Endpoint	                      Purpose
POST	            /api/ai/chat	                Send prompt to KAIYO
17.7 Ratings
Method	         Endpoint	                      Purpose
POST	            /api/ratings	                Submit rating
GET	            /api/ratings/:workerId	       Retrieve worker ratings
18. Glossary
Term	                        Definition
Shram Setu	                  Workforce marketplace connecting workers and employers
Worker	                     Person or group offering skills/services
Employer	                     User looking to hire workers
Job	                        Employment opportunity posted by an employer
Application	                  Worker request to be considered for a posted job
Job Request	                  Direct hiring request sent by an employer to a worker
OTP	                        One-Time Password used for verification
JWT	                        JSON Web Token used for authentication
KAIYO	                        General AI assistant integrated into Shram Setu
SETURYX	                     Shram Setu recognition badge for highly rated workers
श्रमेव जयते	                     Sanskrit phrase used with the SETURYX badge
Socket.IO	                  Technology used for real-time communication
MongoDB	                     Document-oriented database used by Shram Setu
Mongoose	                     ODM used to interact with MongoDB
REST API	                     HTTP-based interface used by frontend and backend
Middleware	                  Backend processing layer executed during request handling
SMTP	                        Protocol used for sending email
Brevo	                        SMTP service used for transactional email
CRUD	                        Create, Read, Update and Delete operations
LLM	                        Large Language Model
Prompt Engineering	         Designing prompts to guide AI model behavior
19. Appendix
19.1 Technology Stack
Layer	                        Technology
Frontend	                     React
Build Tool	                  Vite
Styling	                     Tailwind CSS
Routing	                     React Router
HTTP Client	                  Axios
Backend	                     Node.js
Server Framework	            Express
Database	                     MongoDB Atlas
ODM	                        Mongoose
Authentication	               JWT
Real-Time	                  Socket.IO
Email 	                     Nodemailer
SMTP	                        Brevo
AI	                           Groq API
Frontend Deployment	         Vercel
Backend Deployment	         Render
19.2 Key System Capabilities

The completed Shram Setu platform provides two complementary ways of finding work:

Employer → Job → Workers
Employer
   ↓
Posts Job
   ↓
Workers Discover
   ↓
Workers Apply
   ↓
Employer Reviews
   ↓
Accept / Reject
Employer → Worker → Work
Employer
   ↓
Search Workers
   ↓
View Profile
   ↓
Send Work Request
   ↓
Worker
   ↓
Communication
   ↓
Work Completion
   ↓
OTP Verification
   ↓
Rating

This dual marketplace model is one of the central differentiating characteristics of Shram Setu.

19.3 AI Capability

KAIYO is positioned as a general-purpose AI assistant within the Shram Setu ecosystem.

It can assist with:

General questions
Career guidance
Education
Job descriptions
Hiring guidance
Budget estimation
Programming
Technology
Languages
Productivity
General knowledge

The AI service is accessed through the backend so that the Groq API credential remains server-side.

19.4 Project Assessment Alignment

Shram Setu also demonstrates the following technical concepts required for the project assessment:

Assessment Concept	         Shram Setu Implementation
LLM API Integration	         Groq API through KAIYO
Prompt Engineering	         Backend-generated AI prompts
Structured Outputs	         Can be applied to structured AI tasks such as job-generation workflows; document only if enabled in final implementation
HTTP Status Codes	            Express API responses
Middleware	                  Authentication/request middleware
Problem Modeling	            Worker-employer marketplace domain
RESTful Endpoints	            /api/... resource-based APIs
Server-side Error Handling	   try/catch and HTTP error responses
System Design	               React + Express + MongoDB + external services
Environment Variables	      API keys, database URL, SMTP credentials
Git Workflow	               Source-code version control
Async API Fetching	         Axios + asynchronous React operations
Client-side Routing	         React Router
Async/Await	                  Frontend and backend API/database operations
Closures	                     JavaScript language concept
Event Loop	                  JavaScript runtime behavior
Hoisting	                     JavaScript language concept
Promises	                     API and asynchronous operations
React Composition	            Reusable components
useEffect	                  Side effects/API fetching
useState	                     UI/application state
MongoDB CRUD	               Mongoose operations
MongoDB Schema Modeling	      Mongoose schemas
SQL PK/FK	                  Not used as the production database; prepare conceptually for viva
SQL JOINs	                  Not used in the production database; prepare conceptually for viva

Important: The last two SQL items are assessment concepts, not claims that Shram Setu uses PostgreSQL. The production system is MongoDB-based.

Conclusion

Shram Setu provides a centralized digital platform for connecting workers and employers through both job-based applications and direct worker hiring.

The system combines:

Workforce Discovery + Job Marketplace + Applications + Direct Hiring + Real-Time Communication + Ratings + OTP Verification + AI Assistance

into a single platform.

Its architecture separates the frontend, backend, database, real-time communication, email infrastructure, and AI integration, while JWT authentication, middleware, environment variables, asynchronous operations, and server-side error handling provide the foundation for a secure and maintainable application.

The platform is designed to reduce the friction involved in discovering workers, finding employment, managing hiring interactions, and establishing a digital reputation for skilled workers.