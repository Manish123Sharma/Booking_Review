# Booking_Review API

A RESTful API built with Node.js and Express.js for managing books and their reviews. This API supports user authentication, CRUD operations for books and reviews, and pagination with optional filters.

---

## 🛠️ Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Postman](https://www.postman.com/) or [curl](https://curl.se/) for testing endpoints

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Manish123Sharma/Booking_Review.git
   cd Booking_Review

   ```

2. Install dependencies:

   npm install

3. Set up environment variables:

   PORT=3000
   MONGO_URI=mongodb://localhost:27017/booking_review
   JWT_SECRET=your_jwt_secret

🚀 Running Locally

Start the server:

    npm start

📚 API Endpoints
Authentication

    POST /api/auth/signup: Register a new user.
    POST /api/auth/login: Authenticate and receive a JWT token.

Books

    POST /api/books: Add a new book (Authenticated users only).

    GET /api/books: Retrieve all books with optional filters and pagination.
    GET /api/books/:id: Get details of a specific book by ID.
    PUT /api/books/:id: Update a book (Authenticated users only).
    DELETE /api/books/:id: Delete a book (Authenticated users only).

Reviews

    POST /api/books/:id/reviews: Submit a review for a book (Authenticated users only).
    PUT /api/reviews/:id: Update your own review.
    DELETE /api/reviews/:id: Delete your own review.

Search

    GET /api/search: Search books by title or author (case-insensitive).

📌 Example API Requests

Register a new user

    curl -X POST http://localhost:3000/api/auth/signup \ -H "Content-Type: application/json" \ -d '{"username": "john_doe", "email": "john@example.com", "password": "password123"}'

Login and get JWT token

    curl -X POST http://localhost:3000/api/auth/login \-H "Content-Type: application/json" \ -d '{"email": "john@example.com", "password": "password123"}'

Add a new book (Authenticated)

    curl -X POST http://localhost:3000/api/books \ -H "Authorization: Bearer <your_jwt_token>" \ -H "Content-Type: application/json" \ -d '{"title": "Node.js Basics", "author": "Jane Doe", "genre": "Programming"}'

Get all books with pagination and filters

    curl "http://localhost:3000/api/books?page=1&limit=10&author=Jane&genre=Programming"

🧠 Design Decisions & Assumptions

Authentication: Implemented using JWT for secure user sessions.

Database: MongoDB was chosen for its flexibility and scalability.

Models:

    User: Stores user credentials and profile information.
    Book: Contains book details and an array of reviews.
    Review: Embedded within the Book model to simplify data retrieval.

Pagination: Implemented for the GET /api/books endpoint to handle large datasets efficiently.

Filters: Optional filters for author and genre are supported in the GET /api/books endpoint.

Error Handling: Basic error handling is implemented; consider enhancing it for production environments.

🧬 Database Schema

User
    {
        username: String,
        email: { type: String, unique: true },
        password: String,
        createdAt: { type: Date, default: Date.now }
    }

Book
    {
        title: String,
        author: String,
        genre: String,
        reviews: [
            {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            createdAt: { type: Date, default: Date.now }
            }
        ],
        createdAt: { type: Date, default: Date.now }
    }

Review (Embedded within Book)
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }
