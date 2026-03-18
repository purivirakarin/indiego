# indiego

A simple and modern React web application, bootstrapped with Vite and fully typed with TypeScript.

## Quick Start

To get started, clone the repository and install the necessary dependencies:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the development server with HMR.
- **`npm run build`**: Type-checks (`tsc`) and bundles the app for production (`vite build`).
- **`npm run lint`**: Lints the source files for potential errors.
- **`npm run format`**: Automatically formats the source code.
- **`npm run preview`**: Boots up a local static web server that serves the files from `dist` to preview the production build.

## Contribution Guidelines

This project enforces strict code style standards, ensuring all contributors write clean and unified code. We use **ESLint** and **Prettier**, governed automatically by pre-commit hooks (`husky` + `lint-staged`).

Before committing your changes, your code will be automatically linted and formatted.
If you simply want to format your code before creating a pull request, run `npm run format`.
