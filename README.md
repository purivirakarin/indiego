# The Indiego

A fully functional web platform for exploring Singapore's indie film and arts community. Built with React (Vite) and an Express.js backend powered by Prisma connecting to a database for dynamic event storage.

## Local Development Setup

To run the application locally with a SQLite database:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Initialize the local SQLite database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
3. Start the development servers (runs both Vite frontend and Express backend concurrently):
   ```bash
   npm run dev
   ```
   The web application will be available at `http://localhost:5173`.

## Deployment Setup

When deploying to a production environment (such as Vercel, Heroku, or Render), it is highly recommended to use a robust database like **PostgreSQL** instead of SQLite.

1. **Schema Update**: In your `prisma/schema.prisma` file, alter the datasource block `provider` from `"sqlite"` to `"postgresql"`.
2. **Environment Variables**: Configure the `DATABASE_URL` environment variable in your hosting platform to point to your deployed PostgreSQL instance.
3. **Build & Migrate**: During deployment, ensure the platform runs:
   ```bash
   npx prisma generate
   npm run build
   ```
4. **Hosting**: You can deploy the frontend static files in `dist` to a CDN, and host the Express server (`server/index.js`) on a Node.js environment, ensuring CORS is configured to match your frontend domain.
