# StoreIt

A unified storage management solution with Google SSO authentication.

## Project Structure

- **Frontend**: React application with TypeScript and Material UI
- **Backend**: Java Spring Boot application (Maven)

## Preparing for GitHub

Before pushing to GitHub, make sure:

1. **Dependencies are not included**: The `.gitignore` files are already set up to exclude:
   - `node_modules/`
   - `dependencies/`
   - `target/` (Java build files)

2. **Sensitive information is not included**:
   - Replace the placeholder Google OAuth Client ID in `src/Frontend/src/App.tsx`
   - Use environment variables for any sensitive data

3. **Create a new repository on GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/storeit.git
   git push -u origin main
   ```

## Local Development Setup

### Frontend

```bash
cd src/Frontend
npm install
npm start
```
if that doesnt work, try
```bash
cd src/Frontend && NODE_OPTIONS=--openssl-legacy-provider npm start
```

### Backend

```bash
mvn clean install
mvn spring-boot:run
```

## Google OAuth Setup

1. Obtain a Google OAuth Client ID from the [Google Cloud Console](https://console.cloud.google.com/)
2. Update the Client ID in `src/Frontend/src/App.tsx` or use environment variables
3. See `src/Frontend/README.md` for detailed Google SSO setup instructions

## Environment Variables

Copy `.env.example` to `.env` in the Frontend directory and update with your credentials:

```
REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here
REACT_APP_API_URL=http://localhost:8080/api
```
