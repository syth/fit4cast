import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Amplify } from "aws-amplify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: '4f3062cj4ggigrcnmtgie54162',
      userPoolId: 'us-east-1_tpgFqNvf3',
      loginWith: {
        email: 'true',
      }
    }
  }
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Authenticator>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </Authenticator>
  </StrictMode>
);
