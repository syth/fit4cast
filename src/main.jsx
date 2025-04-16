import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Amplify } from "aws-amplify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css'

Amplify.configure({
  Interactions: {
    LexV2: {
      jcandbot: {
        aliasId: "TSTALIASID",
        botId: "2J7WFDYDMG",
        localeId: "en_US",
        region: "us-east-1",
      },
    },
  },
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
