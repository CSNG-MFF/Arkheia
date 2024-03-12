# Arkheia

## Prerequisites

- mongod version 2.0.0
- next version 13.4.19
- node version 20.7.0
- nodeman version 1.1.2
- nodemon version 3.0.1
- npm version 9.6.5

## Installation

### Clone

```bash
git clone https://github.com/NoPleaseNorbi/Arkheia.git
```
### Backend
After cloning you should go to the backend:
```bash
cd server
```
To install the dependencies:
```bash
npm install
```
To run the database:
```bash
npm run db
```
To run the development server:
```bash
npm run dev
```
Or to run the basic server:
```bash
npm run start
```

### Frontend
```bash
cd ../frontend
```
Assuming you were in the /server directory

To install the dependencies:
```bash
npm install
```
To start the frontend:
```bash
npm start
```

## Testing
Make sure the backend server is not running and that the database is still running!
Assuming you are in the root directory, to run the tests:
```bash
npm run test
```

