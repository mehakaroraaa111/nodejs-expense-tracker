# Expense Tracker API

A RESTful backend API for managing personal expenses, built with **Node.js, Express.js, and MongoDB Atlas**. The API provides secure user authentication and allows users to create, retrieve, update, and delete their own expenses.

## Live Deployment

**Base URL:** https://nodejs-expense-tracker-4vyc.onrender.com

This is a backend API, so opening the base URL in a browser may return a route-not-found response. Use the API endpoints below to interact with the application.

## Features

- **User Authentication:** User signup and login with password hashing using bcrypt.
- **JWT Authentication:** Protects expense endpoints using JSON Web Tokens.
- **Expense CRUD:** Create, retrieve, update, and delete expenses.
- **User-Specific Authorization:** Users can access and manage only their own expenses.
- **Input Validation:** Validates expense fields and MongoDB ObjectIds.
- **Database Integration:** Stores users and expenses in MongoDB Atlas using Mongoose.
- **Centralized Error Handling:** Handles asynchronous errors and returns consistent API error responses.
- **Cloud Deployment:** Deployed on Render with environment-based configuration.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- Thunder Client for API testing

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | Not required |
| POST | `/auth/login` | Log in and receive a JWT | Not required |

### Expenses

All expense endpoints require a valid JWT Bearer token.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/expenses` | Retrieve all expenses for the logged-in user |
| GET | `/expenses/:id` | Retrieve one expense by ID |
| POST | `/expenses` | Create a new expense |
| PUT | `/expenses/:id` | Update an existing expense |
| DELETE | `/expenses/:id` | Delete an expense |

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB instance, either local or MongoDB Atlas
- Thunder Client or another API testing tool

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mehakaroraaa111/nodejs-expense-tracker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nodejs-expense-tracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_long_random_secret
   ```

   Replace the example values with your own configuration. Never commit `.env` or expose database credentials and JWT secrets.

5. Start the development server:

   ```bash
   npm run dev
   ```

   To start the server normally:

   ```bash
   npm start
   ```

The API will run locally at `http://localhost:3000`, provided the port is available.

## Authentication and Usage

### 1. Register a user

Send a `POST` request to `/auth/signup` with a JSON body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "your_test_password"
}
```

Use your own test credentials when trying the API.

### 2. Log in

Send a `POST` request to `/auth/login` with your registered email and password. A successful response returns a JWT.

### 3. Access protected routes

For expense requests, include the token in the HTTP Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### 4. Create an expense

Send a `POST` request to `/expenses` with the Bearer token and this JSON body:

```json
{
  "title": "Groceries",
  "amount": 500,
  "category": "Food"
}
```

The API returns the created expense with its generated ID, associated user, and timestamps.

## Error Handling

The API uses appropriate HTTP status codes for common errors:

- `400 Bad Request` — Invalid input or malformed expense ID.
- `401 Unauthorized` — Missing, invalid, or expired authentication token.
- `404 Not Found` — Expense not found for the authenticated user.
- `500 Internal Server Error` — Unexpected server-side error.

## Security

- Passwords are hashed using bcrypt.
- Expense routes require JWT authentication.
- Expense operations are scoped to the authenticated user.
- Sensitive configuration is stored in environment variables rather than committed to source control.

## Future Improvements

- Automated tests for API endpoints.
- API documentation using Swagger/OpenAPI.
- Rate limiting and additional security hardening.
- A frontend interface for tracking expenses.

## Author

**Mehak**

- GitHub: [mehakaroraaa111](https://github.com/mehakaroraaa111)
