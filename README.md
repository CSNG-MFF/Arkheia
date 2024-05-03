Sure, here is a revised README file for your MERN application:

# Arkheia

Arkheia is a MERN application with the following prerequisites:

- Node.js: v20.7.0 or later (Use Nodeman for easy management)
- MongoDB: v2.0.0 or later
- Next.js: v13.4.19 or later
- npm: v9.6.5 or later
- Docker and Docker Compose (optional for containerized setup)

## Installation

### Clone the Repository

```bash
git clone https://github.com/NoPleaseNorbi/Arkheia.git
```

### Install Dependencies

This project uses `concurrently` to manage multiple npm scripts. To install all dependencies for both frontend and backend, run:

```bash
npm run set-up-frontend
npm run set-up-backend
```

## Running the Application

There are three ways to start the application:

1. **Using npm scripts (locally):**

   Start the database, frontend, and backend concurrently from the root of the project:

   ```bash
   npm start
   ```

2. **Using Docker:**

   Before using Docker, make sure to update the `.env` file:

   ```
   PORT=4000
   MONGODB_URI=mongodb://database/ArkheiaData
   MONGODB_TEST_URI=mongodb://database/ArkheiaTestDB
   ```

   And update the `proxy` in the frontend's `package.json`:

   ```json
   "proxy": "http://arkheia-node-server:4000",
   ```

   Then, you can use Docker Compose to start the application:

   ```bash
   docker-compose up
   ```

3. **Manually starting the frontend and backend:**

   - To start the frontend:

     ```bash
     cd frontend
     npm start
     ```

   - To start the backend:

     ```bash
     cd server
     npm start
     ```

## Testing

To run the tests, make sure the backend server is not running and that the database is still running. From the root directory, run:

```bash
npm run test
```