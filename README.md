# 🎪 EventX API

A comprehensive event management API built with Node.js and Express. Ev simplifies the entire event lifecycle for organizers who want powerful functionality without complexity - from creation and promotion to execution and analysis.

[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

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
- **[Express Mongo Sanitize](https://www.npmjs.com/package/express-mongo-sanitize)**: Prevents MongoDB Operator Injection
- **[HPP](https://www.npmjs.com/package/hpp)**: Express middleware to protect against HTTP Parameter Pollution attacks
- **[XSS-Clean](https://www.npmjs.com/package/xss-clean)**: Middleware to sanitize user input

### Files & Data
- **[Multer](https://www.npmjs.com/package/multer)**: Middleware for handling multipart/form-data
- **[Cloudinary](https://cloudinary.com/)**: Cloud service for image and video management
- **[Joi](https://joi.dev/)**: Schema validation library
- **[UUID](https://www.npmjs.com/package/uuid)**: For generating unique identifiers
- **[Nanoid](https://www.npmjs.com/package/nanoid)**: Tiny, secure, URL-friendly unique string ID generator
- **[Slugify](https://www.npmjs.com/package/slugify)**: Converts strings to URL-friendly slugs

### Communications
- **[Nodemailer](https://nodemailer.com/)**: Email sending functionality

### Performance & Caching
- **[Compression](https://www.npmjs.com/package/compression)**: Response compression middleware
- **[Redis](https://www.npmjs.com/package/redis)**: In-memory data structure store
- **[IORedis](https://www.npmjs.com/package/ioredis)**: Redis client for Node.js
- **[Rate Limiter Flexible](https://www.npmjs.com/package/rate-limiter-flexible)**: Flexible rate limiter
- **[Node-Cron](https://www.npmjs.com/package/node-cron)**: Task scheduler in Node.js

## 📂 API Structure

The API is organized into logical modules:

```
src/
├── auth/        # Authentication & user registration
├── booking/     # Booking management
├── category/    # Event categorization
├── crons/       # Scheduled tasks
├── event/       # Event creation and management
├── middleware/  # Express middlewares
├── routes/      # API routes
└── user/        # User profile management

utils/           # Shared utilities and helpers

db/              # Database models and connections
```

## 🔍 API Endpoints

### 🔐 Auth API
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - User login
- `GET /auth/verify/:token` - Verify email with token
- `POST /auth/resend-verification-email` - Resend verification email
- `POST /auth/reset-password` - Reset forgotten password
- `POST /auth/change-password` - Change user password
- `POST /auth/refresh-token` - Refresh authentication token
- `POST /auth/logout` - Logout user

### 🎪 Events API
- `POST /event/create/:categoryId` - Create a new event
- `PUT /event/update/:id` - Update event information
- `DELETE /event/delete/:id` - Cancel/remove an event
- `GET /event/get/:id` - Get specific event details
- `GET /event/get-all` - List all events
- `GET /event/get-by-category/:categoryId` - Get events by category
- `GET /event/get-by-organizer/:organizerId` - Get events by organizer

### 📋 Categories API
- `POST /category/create` - Create a new category (admin only)
- `PUT /category/update/:id` - Update category information (admin only)
- `GET /category/:id` - Get specific category details
- `GET /category` - List all categories
- `DELETE /category/delete/:id` - Remove a category (admin only)

### 🎟️ Bookings API
- `POST /booking/create/:eventId` - Book an event
- `GET /booking/all` - Get all bookings (admin only)
- `GET /booking/user` - Get user's bookings
- `GET /booking/event/:eventId` - Get all bookings for an event
- `GET /booking/:id` - Get specific booking details
- `PUT /booking/cancel/:id` - Cancel a booking
- `PUT /booking/update/:id` - Update attendee details
- `DELETE /booking/:id` - Delete a booking (admin only)

### 👤 Users API
- `PUT /user/update-profile` - Update user profile
- `GET /user/profile` - Get user profile
- `GET /user` - Get all users (admin only)
- `DELETE /user/delete/:id` - Delete user account (admin only)

## 🧪 Testing API Endpoints

You can test all API endpoints using Postman or any API testing tool. The API is designed with comprehensive validation and error handling to provide clear feedback during testing.

## 📊 Database Schema

Our MongoDB schema is organized into the following main collections:

| Collection | Description |
|------------|-------------|
| **Users** | Account details, authentication info, and user preferences |
| **Events** | Event details including dates, location, and description |
| **Categories** | Event category classifications |
| **Bookings** | Records of users booking specific events |

Each collection implements data validation using Mongoose schemas and maintains appropriate relationships with other collections.

## 🛡️ Security Features

The API implements industry-standard security practices:

- **JWT-based Authentication**: Secure token-based user authentication
- **Password Hashing**: Bcrypt algorithm for secure password storage
- **Request Rate Limiting**: Protection against brute force and DoS attacks using Rate Limiter Flexible
- **XSS Protection**: Prevention of cross-site scripting vulnerabilities with xss-clean
- **Secure HTTP Headers**: Properly configured security headers via Helmet
- **Input Validation**: Thorough request validation using Joi
- **Parameter Pollution Protection**: Using HPP middleware
- **Sanitized Database Queries**: Prevention of NoSQL injection attacks with express-mongo-sanitize
- **Comprehensive Error Handling**: Secure error responses without sensitive info
- **Redis Cache**: Improved performance and security with Redis caching

## 🔧 Getting Started

### Prerequisites

- Node.js (Latest version)
- MongoDB
- Redis (for caching and rate limiting)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmedehhab/eventX.git
   cd eventX
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Edit .env with your configuration
   # Make sure to set up MongoDB and Redis connections
   ```

4. Start the server:
   ```bash
   node index 
   or
   nodemon
   ```

## 📄 License

EventX is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by Ahmed Ehab</p>
