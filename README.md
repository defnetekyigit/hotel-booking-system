🏨 Hotel Booking System – SE4458 Final Project
This project is a cloud-native Hotel Booking System.
The system is inspired by Hotels.com and implements the required functional and non-functional requirements, including microservices, API Gateway, authentication, queue-based notifications, scheduled jobs, and cloud deployment.
here is my demo video link: https://drive.google.com/file/d/1fv7Q6A-ngUHVg5zCSxQ0uTMczvRwW4nZ/view?usp=sharing
🌐 Live Deployment URLs
Frontend (Vercel)
User & Admin UI:
👉 https://hotel-booking-system-sooty.vercel.app

Backend (Google Cloud Run)
API Gateway:
👉 https://hotel-booking-api-gateway-864918801742.europe-west1.run.app
Hotel Service (internal)
Booking Service (internal)
Notification Service (internal)
All backend services are deployed independently on Google Cloud Run and accessed only via API Gateway.


🧱 System Architecture
Microservice-based architecture with clear separation of concerns:
Frontend (Vercel)
        |
        v
API Gateway (Cloud Run)
 ├── Auth / IAM (Firebase Auth)
 ├── Hotel Service
 ├── Booking Service
 ├── Notification Service
 └── Pub/Sub Queue

Services
Service	Responsibility
API Gateway: Auth verification, routing, role-based access
Hotel Service: Hotels, rooms, availability management
Booking Service: Room booking, capacity reduction
Notification Service: Email notifications (queue + scheduler)
IAM	Firebase Authentication
Queue	Google Pub/Sub
Scheduler	Google Cloud Scheduler

🔐 Authentication & Authorization
Firebase Authentication is used as IAM (as required).
Roles:
USER
ADMIN
Role information is stored in PostgreSQL and resolved via:
GET /api/v1/auth/me

API Gateway injects:
x-user-id
x-user-role
headers into downstream services.

👤 User Features
🔍 Hotel Search

Search by:
City
Date range
Number of guests
Only available rooms are returned.

Logged-in users see:

✅ Discounted prices (10%)
🏨 Book Hotel

Users can book a room for selected dates.
Capacity is automatically decreased per day.
No payment transaction required (as per requirements).

📄 My Bookings
Logged-in users can view all their bookings.
Data fetched from:
GET /api/v1/bookings
Bookings are shown with:
Room ID
Date range
Guest count

🛠 Admin Features
Admins access the system via Admin Panel.
🏨 Hotel Management
Create hotels
Create rooms
Define room availability between date ranges

📅 Room Availability
Admins can set availability and price per day
Supports bulk date ranges
Prevents duplicate availability entries

📬 Notification Service (Queue + Scheduler)

🔔 Queue-Based Notifications (Google Pub/Sub)
Triggered when:
A new booking is created
Sends booking confirmation email to the user

⏰ Scheduled Jobs (Google Cloud Scheduler)
Nightly job checks:
Hotel room availability for the next month
If availability drops below 20%
Sends warning emails to hotel admins

🗄 Data Storage
PostgreSQL (Cloud SQL)
Entities:
User
Hotel
Room
RoomAvailability
Booking

📦 API Versioning

All APIs are versioned:
/api/v1/...

🐳 Docker & Cloud Readiness
Each backend service contains a Dockerfile
Services are:
Stateless
Independently deployable
Horizontally scalable

📮 Postman Collection
All API endpoints are tested via Postman
Collection includes:
Admin APIs
Search
Booking
Notifications
👉 https://ozdumanlara-4282103.postman.co/workspace/defne~9844051a-df43-46c6-9f0d-2d239f7b7b10/collection/50953676-0f6c6409-b2e6-48d2-af10-2bd97083ad6e?action=share&creator=50953676&active-environment=50953676-2f95beee-62f7-4bc7-8640-f1742a149357


📌 Assumptions
Payment flow is intentionally skipped.
Room availability is managed per day.

