# Form Builder - Next.js & PostgreSQL

A form-building application built with **Next.js**, **PostgreSQL**, and **Tailwind CSS** that allows users to create, save, and manage forms. The project is designed to be deployed on **Vercel** and supports form creation, response storage, and viewing through a PostgreSQL backend.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Project](#running-the-project)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Contributing](#contributing)


## Features
- **Form Creation**: Admins can create custom forms with various input types.
- **Response Collection**: Users can submit responses that are saved to a PostgreSQL database.
- **Admin Dashboard**: View and manage saved forms and user responses.
- **Tailwind CSS**: For fast and responsive UI styling.
- **Next.js**: Full-stack capabilities with server-side rendering.


## Tech Stack
- **Next.js** - Framework for server-side rendering and frontend development.
- **PostgreSQL** - Relational database to store forms and responses.
- **Tailwind CSS** - Utility-first CSS framework.
- **Vercel** - Hosting platform for easy deployment.


## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (>= v14)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12+)
- **Vercel CLI** (if deploying on Vercel)


## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ahmetdzdrr/form-builder-nextjs-postgresql.git
   cd form-builder-nextjs-postgresql
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up PostgreSQL**:
   - Create a new PostgreSQL database (e.g., `formdb`).
   - Create the required tables as specified in the [Database Schema](#database-schema).


## Configuration

Create a `.env.local` file in the root directory and configure the following variables:

```bash
NEXT_PUBLIC_DATABASE_URL='DB_URL_HERE'
NEXT_PUBLIC_JWT_SECRET="SECRET_KEY_HERE"
NEXT_PUBLIC_USERNAME='USERNAME_HERE'
NEXT_PUBLIC_PASSWORD='PASSWORD_HERE'
```

Replace:
- `DB_URL_HERE` with your PostgreSQL connection URL.
- `SECRET_KEY_HERE` with a secret key for JWT authentication.
- `USERNAME_HERE` and `PASSWORD_HERE` with your database credentials.

2. **Tailwind CSS**:
   Tailwind is already configured. If you need to customize styles, you can modify the `tailwind.config.js` file.


## Running the Project

To start the development server, use:

```bash
npm run dev
```

Visit the app at [http://localhost:3000](http://localhost:3000).


## API Endpoints

- **GET /api/forms**: Fetches all created forms.
- **POST /api/forms**: Creates a new form.
- **GET /api/forms/[id]**: Fetches a single form by ID.
- **POST /api/responses**: Submits a form response.


## Database Schema

- **Forms Table**: Stores form metadata.
  ```sql
  CREATE TABLE Forms (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

- **Responses Table**: Stores user responses.
  ```sql
  CREATE TABLE Responses (
    id SERIAL PRIMARY KEY,
    form_id INT REFERENCES Forms(id),
    response JSONB,
    submitted_at TIMESTAMP DEFAULT NOW()
  );
  ```


## Deployment

1. **Deploying to Vercel**:
   - Install the Vercel CLI:
     ```bash
     npm install -g vercel
     ```
   - Deploy the project:
     ```bash
     vercel
     ```

   Follow the prompts to link your project and deploy.

2. **Configure PostgreSQL on Vercel**:
   - Use a managed PostgreSQL service like **Supabase** or **Heroku**.
   - Set the `DATABASE_URL` in the Vercel dashboard for environment variables.


## Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.


## License
This project is licensed under the MIT License.
