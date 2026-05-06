import {
  confirmResetPassword,
  confirmSignUp,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";

function getFriendlyAuthError(error) {
  const fallbackMessage = "Something went wrong. Please try again.";

  if (!error) return fallbackMessage;

  const errorName = typeof error === "object" ? error.name : "";
  const rawMessage = typeof error === "object" ? error.message : String(error);

  switch (errorName) {
    case "UserNotFoundException":
      return "No account found for this email.";
    case "NotAuthorizedException":
      return "Incorrect email or password.";
    case "UserNotConfirmedException":
      return "Your account is not verified yet. Please confirm the OTP code.";
    case "UsernameExistsException":
      return "An account with this email already exists.";
    case "CodeMismatchException":
      return "Invalid OTP code. Please try again.";
    case "ExpiredCodeException":
      return "That OTP code has expired. Please request a new one.";
    case "LimitExceededException":
      return "Attempt limit exceeded. Please wait and try again.";
    case "TooManyRequestsException":
      return "Too many requests. Please slow down and try again.";
    case "InvalidPasswordException":
      return "Password does not meet the policy requirements.";
    case "InvalidParameterException":
      return rawMessage || fallbackMessage;
    default:
      return rawMessage || fallbackMessage;
  }
}

export async function signUpUser({ name, email, password }) {
  try {
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
        },
      },
    });
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
}

export async function confirmSignup({ email, code }) {
  try {
    return await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
}

export async function resendSignupOtp({ email }) {
  try {
    return await resendSignUpCode({ username: email });
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
}

export async function signInUser({ email, password }) {
  try {
    return await signIn({
      username: email,
      password,
    });
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
}

export async function signOutUser() {
  try {
    return await signOut();
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
}

export async function getCurrentAuthenticatedUser() {
  // getCurrentUser() throws if not signed in.
  return getCurrentUser();
}

export async function startForgotPassword({ email }) {
  try {
    return await resetPassword({ username: email });
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
}

export async function submitResetPassword({ email, code, newPassword }) {
  try {
    return await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  } catch (error) {
    throw new Error(getFriendlyAuthError(error));
  }
}
