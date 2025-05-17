# 🎪 EventX API

A comprehensive event management API built with Node.js and Express. EventX simplifies the entire event lifecycle for organizers who want powerful functionality without complexity - from creation and promotion to execution and analysis.

[![Node.js](https://img.shields.io/badge/Node.js-v16.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- **User Authentication & Authorization**: Secure JWT-based authentication system
- **Event Management**: Create and manage events with an intuitive, fluid process
- **Ticket Management**: Create, sell, and validate tickets with built-in QR code functionality
- **Attendee Management**: Track registrations, check-ins, and attendee information
- **Staff Management**: Add staff members with customizable permission levels
- **Analytics Dashboard**: Get real-time insights on ticket sales, attendance, and revenue
- **Payment Integration**: Process payments securely via PayPal
- **Event Categories**: Organize events by type (Sports, Parties, Classes, Music, Arts, etc.)
- **Event Discovery**: Browse events by popularity, recency, or upcoming dates
- **Search Functionality**: Find events by name, location, date, or combined parameters
- **QR Code Validation**: Scan tickets at event entry points with third-party applications

## 🚀 Tech Stack

### Core
- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment
- **[Express](https://expressjs.com/)**: Fast, minimalist web framework for Node.js
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database
- **[Mongoose](https://mongoosejs.com/)**: MongoDB object modeling for Node.js

### Authentication & Security
- **[JWT](https://jwt.io/)**: JSON Web Tokens for secure authentication
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)**: Password hashing and verification
- **[Helmet](https://helmetjs.github.io/)**: Security middleware for HTTP headers
- **[CORS](https://www.npmjs.com/package/cors)**: Cross-Origin Resource Sharing middleware

### Files & Data
- **[Multer](https://www.npmjs.com/package/multer)**: Middleware for handling multipart/form-data
- **[QRCode](https://www.npmjs.com/package/qrcode)**: QR code generation for tickets
- **[Joi](https://joi.dev/)**: Schema validation library

### Communications & Payments
- **[Nodemailer](https://nodemailer.com/)**: Email sending functionality
- **[PayPal SDK](https://developer.paypal.com/sdk/js/)**: Payment processing integration

### Performance
- **[Compression](https://www.npmjs.com/package/compression)**: Response compression middleware

## 📂 API Structure

The API is organized into logical modules:

```
src/
├── auth/       # Authentication & user registration
├── events/     # Event creation and management
├── tickets/    # Ticket creation, sales, and validation
├── users/      # User profile management
├── staff/      # Staff management and permissions
├── categories/ # Event categorization
├── payments/   # Payment processing
├── analytics/  # Event metrics and reporting
└── utils/      # Shared utilities and helpers
```

## 🔍 API Endpoints

### 🔐 Auth API
- `POST /auth/signup` - Register a new user
- `GET /auth/verify/:token` - Verify email with token
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Reset forgotten password
- `POST /auth/reset-password` - Complete password reset with token

### 🎪 Events API
- `POST /events` - Create a new event
- `GET /events` - List all events with filtering options
- `GET /events/:id` - Get specific event details
- `PUT /events/:id` - Update event information
- `DELETE /events/:id` - Cancel/remove an event
- `GET /events/categories` - Get all event categories
- `GET /events/popular` - Get popular events
- `GET /events/upcoming` - Get upcoming events

### 🎟️ Tickets API
- `POST /tickets/:eventId` - Create ticket types for an event
- `GET /tickets/:eventId` - Get all tickets for an event
- `POST /tickets/purchase/:ticketId` - Purchase a ticket
- `GET /tickets/user` - Get user's purchased tickets
- `POST /tickets/validate/:ticketId` - Validate a ticket at event entry
- `GET /tickets/download/:ticketId` - Download ticket with QR code

### 👤 Users API
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user information
- `GET /users/events` - Get events user is attending
- `POST /users/attend/:eventId` - Register attendance for an event
- `POST /users/unattend/:eventId` - Cancel attendance for an event

### 👥 Staff API
- `POST /staff` - Add staff member to an event
- `GET /staff/:eventId` - Get all staff for an event
- `PUT /staff/:id` - Update staff permissions
- `DELETE /staff/:id` - Remove staff member

### 📊 Analytics API
- `GET /analytics/events/:eventId` - Get event performance metrics
- `GET /analytics/tickets/:eventId` - Get ticket sales metrics
- `GET /analytics/attendance/:eventId` - Get attendance metrics

### 💳 Payment API
- `POST /payments/process` - Process payment for tickets
- `GET /payments/verify/:paymentId` - Verify payment status
- `POST /payments/refund/:paymentId` - Process refund for a payment

## 🧪 Testing API Endpoints

You can test all API endpoints using our comprehensive Postman collection:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/science-operator-17215056/eventx/documentation/qmyhfnr/event)

The collection includes pre-configured requests for every endpoint with example payloads and environment variables for easy testing.

## 📊 Database Schema

Our MongoDB schema is organized into the following main collections:

| Collection | Description |
|------------|-------------|
| **Users** | Account details, authentication info, and user preferences |
| **Events** | Event details including dates, location, and description |
| **Tickets** | Ticket types, pricing, availability, and QR codes |
| **Categories** | Event category classifications |
| **Attendees** | Records of users attending specific events |
| **Staff** | Event staff members and their permission levels |
| **Payments** | Payment records and transaction history |

Each collection implements data validation and maintains appropriate relationships with other collections.

## 🛡️ Security Features

The API implements industry-standard security practices:

- **JWT-based Authentication**: Secure token-based user authentication
- **Password Hashing**: Bcrypt algorithm for secure password storage
- **Request Rate Limiting**: Protection against brute force and DoS attacks
- **XSS Protection**: Prevention of cross-site scripting vulnerabilities
- **Secure HTTP Headers**: Properly configured security headers via Helmet
- **Input Validation**: Thorough request validation using Joi
- **CSRF Protection**: Safeguards against cross-site request forgery
- **Sanitized Database Queries**: Prevention of NoSQL injection attacks
- **Comprehensive Error Handling**: Secure error responses without sensitive info

## 🔧 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eventx.git
   cd eventx
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📄 License

EventX is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by Ahmed Ehab</p>
