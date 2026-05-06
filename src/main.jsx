import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { RouterProvider } from "react-router-dom";
import { amplifyConfig, getMissingAuthEnvVars } from "./aws-config";
import { router } from "./router";
import "./index.css";

const missingAuthEnvVars = getMissingAuthEnvVars();
if (missingAuthEnvVars.length > 0) {
  // Keeps startup beginner-friendly: the app still boots, but auth will fail.
  // Fix by adding the missing keys to .env (see .env.example).
  // eslint-disable-next-line no-console
  console.warn(
    `Missing auth env vars: ${missingAuthEnvVars.join(
      ", ",
    )}. Auth will not work until they are set.`,
  );
}

Amplify.configure(amplifyConfig, { ssr: false });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
