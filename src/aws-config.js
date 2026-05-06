const region = import.meta.env.VITE_REGION;
const userPoolId = import.meta.env.VITE_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;

export const amplifyConfig = {
  Auth: {
    Cognito: {
      // Cognito User Pool (no Hosted UI / OAuth)
      userPoolId,
      userPoolClientId,

      // Optional: explicitly set the login identifier (email)
      // This does NOT enable Hosted UI; it only informs Amplify of your intent.
      loginWith: {
        email: true,
      },
    },
  },
};

export function getMissingAuthEnvVars() {
  const missing = [];

  if (!region) missing.push("VITE_REGION");
  if (!userPoolId) missing.push("VITE_USER_POOL_ID");
  if (!userPoolClientId) missing.push("VITE_USER_POOL_CLIENT_ID");

  return missing;
}
