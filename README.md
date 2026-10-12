# Expense Tracker API

A RESTful backend API for managing personal expenses, built with Node.js, Express.js, and MongoDB. The API supports user authentication and allows each user to securely create, view, update, and delete their own expenses.

## Features

- **User Authentication:** Signup and login with password hashing using bcrypt.
- **JWT Authorization:** Protects expense routes using JSON Web Tokens.
- **Expense Management:** Create, retrieve, update, and delete expenses.
- **User-Specific Data:** Users can access and manage only their own expenses.
- **Input Validation:** Validates expense fields and MongoDB ObjectIds.
- **Database Integration:** Stores users and expenses in MongoDB using Mongoose.
- **Error Handling:** Centralized handling of asynchronous errors and consistent API error responses.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Thunder Client for API testing

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB connection URI
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
   MONGO_URI=mongodb://localhost:27017/expense_tracker
   JWT_SECRET=replace_with_a_long_random_secret
   ```

   Use a strong, private JWT secret. Never commit your `.env` file or real credentials to GitHub.

5. Start the development server:

   ```bash
   npm run dev
   ```

   To start the server normally:

   ```bash
   npm start
   ```

The API will run at `http://localhost:3000`, provided the port is available.

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
| GET | `/expenses` | Get all expenses belonging to the logged-in user |
| GET | `/expenses/:id` | Get one expense by ID |
| POST | `/expenses` | Create a new expense |
| PUT | `/expenses/:id` | Update an existing expense |
| DELETE | `/expenses/:id` | Delete an expense |

## Example Request

### Create an Expense

**POST** `/expenses`

Add your JWT using the `Authorization: Bearer <your-token>` header.

Request body:

```json
{
  "title": "Groceries",
  "amount": 500,
  "category": "Food"
}
```

The API responds with the created expense, including its generated ID, user association, and timestamps.

## Error Handling

The API returns appropriate HTTP status codes for common situations, including:

- `400 Bad Request` — Invalid input or malformed expense ID
- `401 Unauthorized` — Missing, invalid, or expired authentication token
- `404 Not Found` — Expense not found for the authenticated user
- `500 Internal Server Error` — Unexpected server-side error

## Project Purpose

This project demonstrates practical backend development concepts, including REST API design, authentication and authorization, database integration, input validation, and error handling.

## Future Improvements

- Automated tests for API endpoints
- API documentation with Swagger
- Deployment to a cloud hosting platform
- Rate limiting and additional security controls

## Author

Mehak
