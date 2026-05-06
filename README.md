# : Cognito Auth & S3 Upload Portal

 is a modern React + Vite application that demonstrates custom (in-app) AWS Cognito authentication and secure, direct file uploads from the browser to Amazon S3 using pre-signed URLs. No files are sent to your backend—only metadata is exchanged to obtain the upload URL.

## Features

- **Custom Cognito Authentication**: Sign up, login, password reset, and email verification—all in-app, no AWS Hosted UI redirects.
- **Direct S3 Uploads**: Files are uploaded straight from the browser to S3 using a pre-signed URL from your API Gateway.
- **Progress Feedback**: Users see upload progress and receive success/error notifications.
- **Protected Dashboard**: Only authenticated users can access the upload dashboard.
- **Modern UI**: Built with Tailwind CSS and React Router DOM for a clean, responsive experience.

# : Cognito Auth & S3 Upload Portal

 is a modern React + Vite application that demonstrates custom (in-app) AWS Cognito authentication and secure, direct file uploads from the browser to Amazon S3 using pre-signed URLs. No file data is sent to your backend—only metadata is exchanged to obtain the upload URL.

## Features

- **Custom Cognito Authentication**: In-app sign up, login, password reset, and email verification (no AWS Hosted UI).
- **Direct S3 Uploads**: Files are uploaded straight from the browser to S3 using a pre-signed URL from your API Gateway.
- **Progress Feedback**: Users see upload progress and receive notifications.
- **Protected Dashboard**: Only authenticated users can access the upload dashboard.
- **Modern UI**: Built with Tailwind CSS and React Router DOM.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router DOM
- AWS Amplify (Cognito Auth)
- Axios
- Supabase (optional integration)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your AWS and API details:

```bash
copy .env.example .env
```

Edit `.env`:

```env
# API Gateway
VITE_API_BASE_URL=your-api-base-url

# Cognito
VITE_REGION=your-region
VITE_USER_POOL_ID=your-user-pool-id
VITE_USER_POOL_CLIENT_ID=your-client-id

# (Optional) Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  components/
    Navbar.jsx
    FileUploader.jsx
    ProtectedRoute.jsx
  pages/
    Login.jsx
    Register.jsx
    ConfirmSignup.jsx
    ForgotPassword.jsx
    ResetPassword.jsx
    Dashboard.jsx
  services/
    api.js
    auth.js
  utils/
    supabase.js
  aws-config.js
  router.jsx
  App.jsx
  main.jsx
  index.css
```

## How It Works

1. User selects a file (shows name and size)
2. Frontend requests a pre-signed S3 URL from your API Gateway (`POST /get-presigned-url`)
3. Backend returns `{ presignedUrl }`
4. Frontend uploads the file directly to S3 using a `PUT` request
5. UI displays upload progress and notifies on success or error

## Notes

- **No file data is sent to your backend**—only metadata for the pre-signed URL request.
- Your S3 bucket must have a CORS rule allowing `PUT` from your dev/prod origin for uploads to work.
- All authentication is handled in-app with custom React pages.

---
is a proof-of-concept for secure, user-friendly file uploads with AWS Cognito and S3. Fork, adapt, and use for your own projects!
