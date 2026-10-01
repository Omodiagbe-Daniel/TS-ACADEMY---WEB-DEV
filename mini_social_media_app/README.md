# Mini Social Media API

A backend REST API for a mini social media application built with **Node.js, Express.js, MongoDB, and Mongoose**.

This project is part of my learning journey in backend development. I started by building the API with in-memory data and gradually developed it into a database-backed application with user registration, authentication, user profiles, and protected routes.

The project is still being developed, with features such as comments, likes, and image/video uploads planned for future development.

## Features

### Users

The API currently supports:

- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes
- User profile retrieval
- Viewing other users' profiles
- Updating user profiles
- Profile image URL support
- User input validation

### Authentication

Authentication is implemented using **JSON Web Tokens (JWT)**.

After a successful login, the API generates a JWT containing the authenticated user's ID.

Protected routes require the token to be sent in the request header:

```http
Authorization: Bearer <token>
```

The authentication middleware verifies the token and makes the authenticated user's ID available through:

```js
req.userId
```

This allows the application to identify the user making a request and restrict actions such as updating a profile.

### Password Security

User passwords are hashed using **bcrypt** before being stored in MongoDB.

The original password is never stored directly in the database.

During login, bcrypt compares the password provided by the user with the stored password hash.

### User Profiles

Authenticated users can retrieve their own profile:

```http
GET /api/users/profile
```

Users can also view another user's profile using their user ID:

```http
GET /api/users/profile/:userId
```

Users can update their own profile using:

```http
PUT /api/users/profile
```

Profile information currently includes:

- Full name
- Username
- Email
- Date of birth
- Country
- Profile image

Sensitive information such as the user's password is not returned in profile responses.

### Posts

The API supports CRUD operations for posts:

- Create a post
- Retrieve all posts
- Update a post
- Delete a post
- Automatic MongoDB document IDs
- Validation for post content
- Centralized error handling

Posts are stored persistently in MongoDB rather than only in application memory.

## Database

The project uses:

- **MongoDB Atlas** for cloud database storage
- **Mongoose** for interacting with MongoDB
- **dotenv** for managing environment variables

MongoDB stores both user and post data.

## Validation and Error Handling

The application includes:

- Required field validation using Mongoose
- Prevention of whitespace-only input
- Password length validation
- Email uniqueness validation
- `400 Bad Request` responses for invalid input
- `401 Unauthorized` responses for authentication failures
- `404 Not Found` responses when requested resources do not exist
- Centralized Express error-handling middleware
- `500 Internal Server Error` handling for unexpected errors

## Technologies Used

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Token (JWT)
- dotenv
- JavaScript
- REST API
- Thunder Client for API testing

## Project Structure

```text
mini_social_media_app/
│
├── config/
│   └── db.js
│
├── middleware/
│   └── authenticate.js
│
├── models/
│   ├── Post.js
│   └── user.js
│
├── routes/
│   ├── posts.js
│   └── user.js
│
├── data/
│   └── posts.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

## API Endpoints

### Users

#### Register a user

```http
POST /api/users/register
```

Example request:

```json
{
  "fullName": "Omo Dan",
  "username": "omo-dan",
  "email": "testrio@example.com",
  "dateOfBirth": "2007-01-16",
  "country": "USA",
  "password": "password123"
}
```

The password is hashed with bcrypt before the user is stored in MongoDB.

---

#### Login

```http
POST /api/users/login
```

Example request:

```json
{
  "email": "testrio@example.com",
  "password": "password123"
}
```

A successful login returns a JWT token.

Example response:

```json
{
  "username": "omo-dan",
  "email": "testrio@example.com",
  "_id": "6abeaad3d81571455f346c6e",
  "token": "JWT_TOKEN"
}
```

---

#### Get my profile

```http
GET /api/users/profile
```

Requires authentication.

Header:

```http
Authorization: Bearer <token>
```

Example response:

```json
{
  "_id": "6abeaad3d81571455f346c6e",
  "fullName": "Omo Dan",
  "username": "omo-dan",
  "email": "testrio@example.com",
  "dateOfBirth": "2007-01-16T00:00:00.000Z",
  "country": "USA",
  "profileImage": "https://example.com/profile.jpg"
}
```

The password is not returned.

---

#### Get another user's profile

```http
GET /api/users/profile/:userId
```

Requires authentication.

Example:

```http
GET /api/users/profile/6abeaad3d81571455f346c6e
```

This allows an authenticated user to view another user's profile.

---

#### Update my profile

```http
PUT /api/users/profile
```

Requires authentication.

Example request:

```json
{
  "country": "France"
}
```

Only the supplied information is changed while existing profile information is preserved.

Example response:

```json
{
  "fullName": "Omo Dan",
  "username": "omo-dan",
  "email": "testrio@example.com",
  "dateOfBirth": "2007-01-16T00:00:00.000Z",
  "country": "France",
  "profileImage": "https://example.com/profile.jpg"
}
```

A user can only update their own profile because the user ID comes from the authenticated JWT.

### Posts

#### Get all posts

```http
GET /api/posts
```

Returns all posts stored in MongoDB.

---

#### Create a post

```http
POST /api/posts
```

Example request:

```json
{
  "content": "Learning Node.js is fun!"
}
```

---

#### Update a post

```http
PUT /api/posts/:postID
```

Example request:

```json
{
  "content": "I am learning Node.js and MongoDB!"
}
```

---

#### Delete a post

```http
DELETE /api/posts/:postID
```

## Example User

A user stored in MongoDB looks similar to:

```json
{
  "_id": "6abeaad3d81571455f346c6e",
  "username": "omo-dan",
  "email": "testrio@example.com",
  "fullName": "Omo Dan",
  "country": "USA",
  "dateOfBirth": "2007-01-16T00:00:00.000Z",
  "profileImage": "https://example.com/profile.jpg",
  "password": "$2b$10$..."
}
```

The password shown above is a bcrypt hash and is never returned by the profile API responses.

## Example Post

A post stored in MongoDB looks similar to:

```json
{
  "_id": "6ab98a934f83566a2929b229",
  "content": "Learning Node.js is fun!",
  "__v": 0
}
```

The `_id` is automatically generated by MongoDB/Mongoose, so there is no need to manually create post IDs.

## Environment Variables

The project uses a `.env` file for sensitive configuration.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

The `.env` file should **not** be committed to GitHub.

Make sure `.env` is included in `.gitignore`:

```text
.env
node_modules/
```

When deploying the application, these environment variables should be configured through the hosting platform's environment variable settings.

## Installation

Clone the repository:

```bash
git clone https://github.com/Omodiagbe-Daniel/TS-ACADEMY---WEB-DEV.git
```

Navigate into the project:

```bash
cd mini_social_media_app
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file and add your environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm start
```

The server runs on:

```text
http://localhost:5000
```

## Authentication

For protected routes, first log in and obtain the JWT token.

Then include the token in the request header:

```http
Authorization: Bearer <token>
```

For example:

```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

The authentication middleware verifies the token before allowing access to protected routes.

## Testing

The API is currently tested using **Thunder Client**.

The main operations tested include:

- User registration
- User login
- Password validation
- JWT authentication
- Retrieving the authenticated user's profile
- Retrieving another user's profile
- Updating a user's profile
- Retrieving posts
- Creating posts
- Updating posts
- Deleting posts
- Invalid post content
- Non-existent post IDs
- MongoDB validation errors
- Authentication failures

## What I Learned

While building this project, I have worked with:

- Express routing
- HTTP methods and REST APIs
- Middleware
- Authentication middleware
- Authorization concepts
- Asynchronous JavaScript
- `async/await`
- MongoDB Atlas
- Mongoose models and schemas
- Mongoose validation
- MongoDB CRUD operations
- Password hashing with bcrypt
- JWT authentication
- Environment variables with dotenv
- Express error-handling middleware
- Passing errors with `next(error)`
- Git and GitHub

The project has helped me understand how a backend application evolves from simple in-memory data into a persistent application with authentication, protected routes, and user-specific data.

## Future Improvements

The project is still being developed. Planned features include:

- Connecting posts to users
- Protected post creation and modification
- Image uploads
- Video uploads
- Cloud media storage
- Comments
- Likes
- Following/followers
- Improved API validation
- More comprehensive error handling
- Pagination
- Search functionality
- Frontend application

## Author

**Daniel Omodiagbe Onosetale**

Computer Engineering graduate with an interest in software and backend development.

This project represents part of my continued practice with JavaScript, Node.js, Express, MongoDB, authentication, and REST API development.