# RBAC Blog Platform Setup Guide

This guide will walk you through setting up the RBAC Blog Platform with PostgreSQL and Prisma, from database creation to running the development server.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed
- Access to PostgreSQL with admin privileges

## Step 1: Configure Environment Variables

Copy the example below into your `.env` file at the project root, replacing placeholders with your actual PostgreSQL credentials:

```env
JWT_SECRET=createingrbacblogapplicationassignment
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
DB_PASSWORD=password //Your postgres password
DATABASE_URL=`postgresql://postgres:${DB_PASSWORD}@localhost:5432/rbac_blog`
```

## Step 2: Install Dependencies

```bash
cd ./backend

```

Install all required Node.js dependencies:

```bash
npm install
```

## Step 3: Initialize Prisma Client

Generate the Prisma client:

```bash
npx prisma generate
```

## Step 4: Run Database Migrations

Apply the initial Prisma migration to set up your database schema:

```bash
npx prisma migrate dev --name init
```

## Step 5: Start the Development Server

Run the backend server:

```bash
npm start
```

The server should now be running and connected to your PostgreSQL database.

## Troubleshooting

- **Authentication Issues:** Double-check your PostgreSQL credentials and ensure the database is running.
- **Database Connection:** Test your connection with `npx prisma db pull`.
- **Permissions:** Ensure your PostgreSQL user has the necessary privileges.

## Project Structure

- `prisma/schema.prisma`: Prisma schema definitions
- `src/`: Application source code (controllers, routes, middleware, utils)
- `.env`: Environment variables

## Models Overview

- **User**: id, email, password, role, name, createdAt, updatedAt (One-to-Many with Blog)
- **Blog**: id, title, content, published, authorId, createdAt, updatedAt (Many-to-One with User)
- **Role Enum**: USER, ADMIN

## For Frontend
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

```bash
cd ../frontend

npm install
```

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## Here is the POSTMAN API DOCUMENTATION

https://api.postman.com/collections/19430201-e04dc87a-9114-45d3-b8cd-fb53fda346b6?access_key=PMAT-01JSYMPAW53HA6HGEYYJYAY9XT


## API Endpoints

Below is a list of API endpoints available in the RBAC Blog Platform:

- **POST /api/v1/auth/login**: Authenticates a user and returns a JWT token.
- **POST /api/v1/auth/register**: Registers a new user with email, password, and role.
- **GET /api/v1/users**: Retrieves a list of all users. Requires admin privileges.
- **GET /api/v1/users/:id**: Retrieves details of a specific user by ID.
- **PUT /api/v1/users/:id**: Updates user information. Requires admin privileges.
- **DELETE /api/v1/users/:id**: Deletes a user by ID. Requires admin privileges.
- **GET /api/v1/blogs**: Retrieves a list of all blogs.
- **POST /api/v1/blogs**: Creates a new blog post. Requires authentication.
- **GET /api/v1/blogs/:id**: Retrieves details of a specific blog post by ID.
- **PUT /api/v1/blogs/:id**: Updates a blog post. Requires authentication.
- **DELETE /api/v1/blogs/:id**: Deletes a blog post by ID. Requires authentication.

