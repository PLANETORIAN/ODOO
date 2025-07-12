# StackIt Q&A Forum Backend

A complete backend for a Q&A forum like StackOverflow, built with Express.js and MongoDB (Mongoose).

## Features
- User registration, login, and profile management (JWT authentication)
- CRUD for questions and answers
- Upvote/downvote system for questions and answers
- Accept answers
- Search, trending, and unanswered questions endpoints
- Proper MVC architecture
- CORS enabled

## Tech Stack
- Node.js, Express.js
- MongoDB, Mongoose
- JWT for authentication
- bcryptjs for password hashing
- dotenv for configuration

## File Structure
```
stackit-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── questionController.js
│   ├── answerController.js
│   └── voteController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Question.js
│   ├── Answer.js
│   └── Vote.js
├── routes/
│   ├── authRoutes.js
│   ├── questionRoutes.js
│   ├── answerRoutes.js
│   └── voteRoutes.js
├── utils/
│   └── generateToken.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env` sample below).
3. Start MongoDB locally or use a cloud provider.
4. Start the server:
   ```bash
   npm run dev
   ```

## .env Sample
```
MONGO_URI=mongodb://localhost:27017/stackit-forum
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## API Endpoints
### Auth
- `POST   /api/auth/register`   Register a new user
- `POST   /api/auth/login`      Login
- `GET    /api/auth/profile`    Get user profile (auth)
- `PUT    /api/auth/profile`    Update user profile (auth)

### Questions
- `GET    /api/questions`           List questions (search, filter, pagination)
- `POST   /api/questions`           Create question (auth)
- `GET    /api/questions/:id`       Get question by ID
- `PUT    /api/questions/:id`       Update question (auth)
- `DELETE /api/questions/:id`       Delete question (auth)
- `GET    /api/questions/trending`  Trending questions
- `GET    /api/questions/unanswered` Unanswered questions

### Answers
- `POST   /api/answers/:questionId`      Post answer (auth)
- `PUT    /api/answers/:id`              Update answer (auth)
- `DELETE /api/answers/:id`              Delete answer (auth)
- `PUT    /api/answers/:id/accept`       Accept answer (auth)
- `GET    /api/answers/question/:questionId`  Get answers for a question
- `GET    /api/answers/user/:userId`     Get answers by user

### Votes
- `POST   /api/votes/question/:id`   Upvote/downvote question (auth)
- `POST   /api/votes/answer/:id`     Upvote/downvote answer (auth)
- `GET    /api/votes/user`           Get user's voting history (auth)

## Sample Test Data

### User
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Question
```json
{
  "title": "How do I connect to MongoDB with Mongoose?",
  "content": "I'm trying to connect my Node.js app to MongoDB using Mongoose. What is the correct way to do this?",
  "tags": ["mongodb", "mongoose", "nodejs"]
}
```

---

## License
MIT 